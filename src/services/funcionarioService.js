import { db } from "@/lib/db";
import { gerarHash } from "@/lib/senha";
import { ErroNegocio, norm, texto } from "@/lib/erros";

export const CARGOS = ["Administrador", "Vendedor"];
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN = 6;

// Nunca devolve o hash da senha para o navegador.
const COLUNAS = "id, nome, email, cargo, status";
const buscar = (id) => db.prepare(`SELECT ${COLUNAS} FROM funcionario WHERE id = ?`).get(id);
const adminsAtivos = (exceto) =>
  db.prepare("SELECT COUNT(*) n FROM funcionario WHERE cargo = 'Administrador' AND status = 'Ativo' AND id IS NOT ?").get(exceto).n;

function validar(d, idAtual) {
  const nome = texto(d.nome);
  const email = texto(d.email).toLowerCase();
  const senha = String(d.senha ?? "");
  if (!nome) throw new ErroNegocio("O campo nome é obrigatório.");
  if (!EMAIL_VALIDO.test(email)) throw new ErroNegocio("Informe um e-mail válido.");
  if (!CARGOS.includes(d.cargo)) throw new ErroNegocio("Selecione um cargo válido.");
  // Na criação a senha é obrigatória; na edição, em branco mantém a atual.
  if (idAtual === null || senha) {
    if (senha.length < SENHA_MIN) throw new ErroNegocio(`A senha deve ter pelo menos ${SENHA_MIN} caracteres.`);
    if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) throw new ErroNegocio("A senha deve conter letras e números.");
  }
  if (db.prepare("SELECT 1 FROM funcionario WHERE email = ? AND id IS NOT ?").get(email, idAtual))
    throw new ErroNegocio("Já existe um funcionário com este e-mail.", 409);
  return { nome, email, cargo: d.cargo, senha };
}

export function listar(busca = "") {
  const q = norm(busca);
  return db.prepare(`
    SELECT ${COLUNAS} FROM funcionario
    WHERE ? = '' OR lower(nome) LIKE '%' || ? || '%' OR lower(email) LIKE '%' || ? || '%' OR CAST(id AS TEXT) = ?
    ORDER BY nome COLLATE NOCASE
  `).all(q, q, q, q);
}

export function criar(dados) {
  const c = validar(dados, null);
  const { lastInsertRowid } = db.prepare("INSERT INTO funcionario (nome, email, senha_hash, cargo) VALUES (?, ?, ?, ?)")
    .run(c.nome, c.email, gerarHash(c.senha), c.cargo);
  return buscar(lastInsertRowid);
}

export function atualizar(id, dados, usuario) {
  const atual = buscar(id);
  if (!atual) throw new ErroNegocio("Funcionário não encontrado.", 404);
  const c = validar(dados, id);
  const status = dados.status === "Inativo" ? "Inativo" : "Ativo";
  const perdeAdmin = atual.cargo === "Administrador" && (c.cargo !== "Administrador" || status === "Inativo");
  if (perdeAdmin && adminsAtivos(id) === 0) throw new ErroNegocio("O sistema precisa de pelo menos um administrador ativo.");
  if (id === usuario.id && status === "Inativo") throw new ErroNegocio("Você não pode inativar o próprio usuário.");

  db.transaction(() => {
    db.prepare("UPDATE funcionario SET nome = ?, email = ?, cargo = ?, status = ? WHERE id = ?").run(c.nome, c.email, c.cargo, status, id);
    if (c.senha) db.prepare("UPDATE funcionario SET senha_hash = ? WHERE id = ?").run(gerarHash(c.senha), id);
    // Ao inativar ou trocar a senha, derruba as sessões abertas desse funcionário.
    if (status === "Inativo" || (c.senha && id !== usuario.id)) db.prepare("DELETE FROM sessao WHERE funcionario_id = ?").run(id);
  })();
  return buscar(id);
}

// Com vendas registradas → inativa (preserva histórico); sem vendas → exclui.
export function remover(id, usuario) {
  const atual = buscar(id);
  if (!atual) throw new ErroNegocio("Funcionário não encontrado.", 404);
  if (id === usuario.id) throw new ErroNegocio("Você não pode excluir o próprio usuário.");
  if (atual.cargo === "Administrador" && adminsAtivos(id) === 0) throw new ErroNegocio("O sistema precisa de pelo menos um administrador ativo.");
  if (db.prepare("SELECT 1 FROM venda WHERE funcionario_id = ? LIMIT 1").get(id)) {
    db.transaction(() => {
      db.prepare("UPDATE funcionario SET status = 'Inativo' WHERE id = ?").run(id);
      db.prepare("DELETE FROM sessao WHERE funcionario_id = ?").run(id);
    })();
    return { inativado: true };
  }
  db.prepare("DELETE FROM funcionario WHERE id = ?").run(id);
  return { inativado: false };
}

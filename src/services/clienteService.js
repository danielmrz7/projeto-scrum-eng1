import { db } from "@/lib/db";
import { ErroNegocio, norm, digitos, texto } from "@/lib/erros";

export { ErroNegocio, paraResposta } from "@/lib/erros";

// RN01 e RNF02: nome obrigatório; sem duplicidade (mesmo nome + telefone)
function validar(d, idAtual) {
  const nome = texto(d.nome);
  if (!nome) throw new ErroNegocio("O campo nome é obrigatório.");
  const telefone = texto(d.telefone);
  const endereco = texto(d.endereco);
  const duplicado = db.prepare("SELECT id, nome, telefone FROM cliente WHERE id IS NOT ?").all(idAtual)
    .some((c) => norm(c.nome) === norm(nome) && digitos(c.telefone) === digitos(telefone));
  if (duplicado) throw new ErroNegocio("Já existe um cliente cadastrado com este nome e telefone.", 409);
  return { nome, telefone, endereco };
}

// RF02 / RN03: consulta por nome ou código
export function listar(busca = "") {
  const q = norm(busca);
  return db.prepare(`
    SELECT * FROM cliente
    WHERE ? = '' OR lower(nome) LIKE '%' || ? || '%' OR CAST(id AS TEXT) = ?
    ORDER BY nome COLLATE NOCASE
  `).all(q, q, q);
}

export function criar(dados) {
  const campos = validar(dados, null);
  const { lastInsertRowid } = db.prepare("INSERT INTO cliente (nome, telefone, endereco) VALUES (@nome, @telefone, @endereco)").run(campos);
  return db.prepare("SELECT * FROM cliente WHERE id = ?").get(lastInsertRowid);
}

export function atualizar(id, dados) {
  if (!db.prepare("SELECT 1 FROM cliente WHERE id = ?").get(id)) throw new ErroNegocio("Cliente não encontrado.", 404);
  const campos = validar(dados, id);
  const status = dados.status === "Inativo" ? "Inativo" : "Ativo";
  db.prepare("UPDATE cliente SET nome = @nome, telefone = @telefone, endereco = @endereco, status = @status WHERE id = @id").run({ ...campos, status, id });
  return db.prepare("SELECT * FROM cliente WHERE id = ?").get(id);
}

// RF04 / RN02: com vendas vinculadas → inativa; sem vendas → exclui fisicamente
export function remover(id) {
  if (!db.prepare("SELECT 1 FROM cliente WHERE id = ?").get(id)) throw new ErroNegocio("Cliente não encontrado.", 404);
  if (db.prepare("SELECT 1 FROM venda WHERE cliente_id = ? LIMIT 1").get(id)) {
    db.prepare("UPDATE cliente SET status = 'Inativo' WHERE id = ?").run(id);
    return { inativado: true };
  }
  db.prepare("DELETE FROM cliente WHERE id = ?").run(id);
  return { inativado: false };
}

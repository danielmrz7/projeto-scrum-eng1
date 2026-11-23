import { db } from "@/lib/db";
import { ErroNegocio, norm, texto } from "@/lib/erros";

export const CATEGORIAS = ["Matéria-prima", "Embalado"];
export const UNIDADES = ["kg", "g", "un", "pct", "cx", "L"];

const COLUNAS = `id, nome, categoria, unidade_medida AS unidadeMedida, preco_venda AS precoVenda,
  quantidade, quantidade_minima AS quantidadeMinima, status`;

const buscar = (id) => db.prepare(`SELECT ${COLUNAS} FROM produto WHERE id = ?`).get(id);

function numero(v, campo, { inteiro = false } = {}) {
  const s = texto(v).replace(",", ".");
  const n = Number(s);
  if (s === "" || !Number.isFinite(n)) throw new ErroNegocio(`O campo ${campo} é obrigatório e deve ser numérico.`);
  if (n < 0) throw new ErroNegocio(`O campo ${campo} não pode ser negativo.`);
  if (inteiro && !Number.isInteger(n)) throw new ErroNegocio(`O campo ${campo} deve ser um número inteiro.`);
  return inteiro ? n : Math.round(n * 100) / 100;
}

// RF02.01 / RF02.03 – validação dos dados do produto
function validar(d, idAtual) {
  const nome = texto(d.nome);
  if (!nome) throw new ErroNegocio("O campo nome é obrigatório.");
  if (nome.length > 150) throw new ErroNegocio("O nome deve ter no máximo 150 caracteres.");
  if (!CATEGORIAS.includes(d.categoria)) throw new ErroNegocio("Selecione uma categoria válida.");
  if (!UNIDADES.includes(d.unidadeMedida)) throw new ErroNegocio("Selecione uma unidade de medida válida.");
  const campos = {
    nome,
    categoria: d.categoria,
    unidadeMedida: d.unidadeMedida,
    precoVenda: numero(d.precoVenda, "preço de venda"),
    quantidade: numero(d.quantidade, "quantidade", { inteiro: true }),
    quantidadeMinima: numero(d.quantidadeMinima, "quantidade mínima", { inteiro: true }),
  };
  const duplicado = db.prepare("SELECT id, nome, unidade_medida FROM produto WHERE id IS NOT ? AND categoria = ?").all(idAtual, campos.categoria)
    .some((p) => norm(p.nome) === norm(nome) && p.unidade_medida === campos.unidadeMedida);
  if (duplicado) throw new ErroNegocio("Já existe um produto com este nome, categoria e unidade.", 409);
  return campos;
}

// RF02.02 – filtros por nome/código, categoria e disponibilidade em estoque
export function listar({ busca = "", categoria = "", estoque = "" } = {}) {
  const q = norm(busca);
  const filtroEstoque = {
    baixo: "AND quantidade <= quantidade_minima",
    zerado: "AND quantidade = 0",
    disponivel: "AND quantidade > 0",
  }[estoque] ?? "";
  return db.prepare(`
    SELECT ${COLUNAS} FROM produto
    WHERE (@q = '' OR lower(nome) LIKE '%' || @q || '%' OR CAST(id AS TEXT) = @q)
      AND (@categoria = '' OR categoria = @categoria)
      ${filtroEstoque}
    ORDER BY nome COLLATE NOCASE
  `).all({ q, categoria: CATEGORIAS.includes(categoria) ? categoria : "" });
}

export function criar(dados) {
  const c = validar(dados, null);
  const { lastInsertRowid } = db.prepare(`
    INSERT INTO produto (nome, categoria, unidade_medida, preco_venda, quantidade, quantidade_minima)
    VALUES (@nome, @categoria, @unidadeMedida, @precoVenda, @quantidade, @quantidadeMinima)
  `).run(c);
  return buscar(lastInsertRowid);
}

export function atualizar(id, dados) {
  if (!buscar(id)) throw new ErroNegocio("Produto não encontrado.", 404);
  const c = validar(dados, id);
  const status = dados.status === "Inativo" ? "Inativo" : "Ativo";
  db.prepare(`
    UPDATE produto SET nome = @nome, categoria = @categoria, unidade_medida = @unidadeMedida, preco_venda = @precoVenda,
      quantidade = @quantidade, quantidade_minima = @quantidadeMinima, status = @status
    WHERE id = @id
  `).run({ ...c, status, id });
  return buscar(id);
}

// RF02.04 – com histórico de vendas ou entradas → inativa; sem histórico → exclui
export function remover(id) {
  if (!buscar(id)) throw new ErroNegocio("Produto não encontrado.", 404);
  const temHistorico =
    db.prepare("SELECT 1 FROM item_venda WHERE produto_id = ? LIMIT 1").get(id) ||
    db.prepare("SELECT 1 FROM entrada_produto WHERE produto_id = ? LIMIT 1").get(id);
  if (temHistorico) {
    db.prepare("UPDATE produto SET status = 'Inativo' WHERE id = ?").run(id);
    return { inativado: true };
  }
  db.prepare("DELETE FROM produto WHERE id = ?").run(id);
  return { inativado: false };
}

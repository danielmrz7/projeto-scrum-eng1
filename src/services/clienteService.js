import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "data");
const ARQ_CLIENTES = path.join(DIR, "clientes.json");
const ARQ_VENDAS = path.join(DIR, "vendas.json"); // futuro módulo de vendas (cada venda: { clienteId })

export class ErroNegocio extends Error {
  constructor(msg, status = 400) { super(msg); this.status = status; }
}
export function paraResposta(e) {
  if (e instanceof ErroNegocio) return Response.json({ erro: e.message }, { status: e.status });
  return Response.json({ erro: "Falha na comunicação com a base de dados." }, { status: 500 });
}

const ler = async (arq) => { try { return JSON.parse(await fs.readFile(arq, "utf8")); } catch { return []; } };
const gravar = async (lista) => { await fs.mkdir(DIR, { recursive: true }); await fs.writeFile(ARQ_CLIENTES, JSON.stringify(lista, null, 2)); };
const norm = (s) => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const digitos = (s) => String(s ?? "").replace(/\D/g, "");

// RN01 e RNF02: nome obrigatório; sem duplicidade (mesmo nome + telefone)
function validar(d, lista, idAtual) {
  const nome = String(d.nome ?? "").trim();
  if (!nome) throw new ErroNegocio("O campo nome é obrigatório.");
  const telefone = String(d.telefone ?? "").trim();
  const endereco = String(d.endereco ?? "").trim();
  const duplicado = lista.some((c) => c.id !== idAtual && norm(c.nome) === norm(nome) && digitos(c.telefone) === digitos(telefone));
  if (duplicado) throw new ErroNegocio("Já existe um cliente cadastrado com este nome e telefone.", 409);
  return { nome, telefone, endereco };
}

// RF02 / RN03: consulta por nome ou código
export async function listar(busca = "") {
  const lista = await ler(ARQ_CLIENTES);
  const q = norm(busca);
  return lista
    .filter((c) => !q || norm(c.nome).includes(q) || String(c.id) === q)
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function criar(dados) {
  const lista = await ler(ARQ_CLIENTES);
  const campos = validar(dados, lista, null);
  const id = lista.reduce((m, c) => Math.max(m, c.id), 0) + 1;
  const cliente = { id, ...campos, status: "Ativo" };
  await gravar([...lista, cliente]);
  return cliente;
}

export async function atualizar(id, dados) {
  const lista = await ler(ARQ_CLIENTES);
  const i = lista.findIndex((c) => c.id === id);
  if (i < 0) throw new ErroNegocio("Cliente não encontrado.", 404);
  const campos = validar(dados, lista, id);
  const status = dados.status === "Inativo" ? "Inativo" : "Ativo";
  lista[i] = { ...lista[i], ...campos, status };
  await gravar(lista);
  return lista[i];
}

// RF04 / RN02: com vendas vinculadas → inativa; sem vendas → exclui fisicamente
export async function remover(id) {
  const lista = await ler(ARQ_CLIENTES);
  const i = lista.findIndex((c) => c.id === id);
  if (i < 0) throw new ErroNegocio("Cliente não encontrado.", 404);
  const vendas = await ler(ARQ_VENDAS);
  if (vendas.some((v) => v.clienteId === id)) {
    lista[i].status = "Inativo";
    await gravar(lista);
    return { inativado: true };
  }
  lista.splice(i, 1);
  await gravar(lista);
  return { inativado: false };
}

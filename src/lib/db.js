import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { gerarHash } from "@/lib/senha";

const DIR = path.join(process.cwd(), "data");
const ARQ_BANCO = process.env.DB_PATH || path.join(DIR, "comcil.db");

// Esquema baseado no Documento de Modelos (docs/doc-modelos.md)
const ESQUEMA = `
CREATE TABLE IF NOT EXISTS funcionario (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nome        TEXT    NOT NULL,
  email       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  senha_hash  TEXT    NOT NULL,
  cargo       TEXT    NOT NULL CHECK (cargo IN ('Administrador', 'Vendedor')),
  status      TEXT    NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo'))
);

CREATE TABLE IF NOT EXISTS sessao (
  token_hash     TEXT    PRIMARY KEY,
  funcionario_id INTEGER NOT NULL REFERENCES funcionario(id) ON DELETE CASCADE,
  expira_em      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cliente (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT NOT NULL,
  telefone  TEXT NOT NULL DEFAULT '',
  endereco  TEXT NOT NULL DEFAULT '',
  status    TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo'))
);

CREATE TABLE IF NOT EXISTS fornecedor (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT NOT NULL,
  telefone  TEXT NOT NULL DEFAULT '',
  endereco  TEXT NOT NULL DEFAULT '',
  status    TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo'))
);

CREATE TABLE IF NOT EXISTS produto (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  nome              TEXT    NOT NULL,
  categoria         TEXT    NOT NULL CHECK (categoria IN ('Matéria-prima', 'Embalado')),
  unidade_medida    TEXT    NOT NULL,
  preco_venda       REAL    NOT NULL CHECK (preco_venda >= 0),
  quantidade        INTEGER NOT NULL CHECK (quantidade >= 0),
  quantidade_minima INTEGER NOT NULL CHECK (quantidade_minima >= 0),
  fornecedor_id     INTEGER REFERENCES fornecedor(id),
  status            TEXT    NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo'))
);

CREATE TABLE IF NOT EXISTS entrada_produto (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  data        TEXT    NOT NULL DEFAULT (datetime('now')),
  quantidade  INTEGER NOT NULL CHECK (quantidade > 0),
  produto_id  INTEGER NOT NULL REFERENCES produto(id)
);

CREATE TABLE IF NOT EXISTS venda (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  data             TEXT    NOT NULL DEFAULT (datetime('now')),
  valor_total      REAL    NOT NULL CHECK (valor_total >= 0),
  status_pagamento TEXT    NOT NULL,
  funcionario_id   INTEGER NOT NULL REFERENCES funcionario(id),
  cliente_id       INTEGER NOT NULL REFERENCES cliente(id)
);

CREATE TABLE IF NOT EXISTS item_venda (
  venda_id       INTEGER NOT NULL REFERENCES venda(id),
  produto_id     INTEGER NOT NULL REFERENCES produto(id),
  quantidade     INTEGER NOT NULL CHECK (quantidade > 0),
  valor_unitario REAL    NOT NULL CHECK (valor_unitario > 0),
  subtotal       REAL    NOT NULL CHECK (subtotal > 0),
  PRIMARY KEY (venda_id, produto_id)
);

CREATE TABLE IF NOT EXISTS pagamento (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  data_pagamento  TEXT    NOT NULL,
  valor           REAL    NOT NULL CHECK (valor > 0),
  forma_pagamento TEXT    NOT NULL,
  status          TEXT    NOT NULL,
  venda_id        INTEGER NOT NULL REFERENCES venda(id)
);

CREATE TABLE IF NOT EXISTS conta (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  data_vencimento TEXT    NOT NULL,
  valor           REAL    NOT NULL CHECK (valor > 0),
  status          TEXT    NOT NULL,
  venda_id        INTEGER NOT NULL UNIQUE REFERENCES venda(id)
);
`;

// Primeiro acesso: cria um administrador para que seja possível entrar no sistema.
function criarAdministrador(db) {
  if (db.prepare("SELECT COUNT(*) n FROM funcionario").get().n > 0) return;
  const email = process.env.ADMIN_EMAIL || "admin@comcil.com.br";
  const senha = process.env.ADMIN_SENHA || "comcil123";
  db.prepare("INSERT INTO funcionario (nome, email, senha_hash, cargo) VALUES (?, ?, ?, 'Administrador')")
    .run("Administrador", email, gerarHash(senha));
  console.log(`[comcil] Administrador inicial criado: ${email} (altere a senha após o primeiro acesso)`);
}

// Importa os clientes da versão anterior (data/clientes.json), se existirem.
function importarClientesJson(db) {
  const arq = path.join(DIR, "clientes.json");
  if (!fs.existsSync(arq) || db.prepare("SELECT COUNT(*) n FROM cliente").get().n > 0) return;
  const lista = JSON.parse(fs.readFileSync(arq, "utf8"));
  const ins = db.prepare("INSERT INTO cliente (id, nome, telefone, endereco, status) VALUES (@id, @nome, @telefone, @endereco, @status)");
  lista.forEach((c) => ins.run({ telefone: "", endereco: "", status: "Ativo", ...c }));
  console.log(`[comcil] ${lista.length} cliente(s) importado(s) de data/clientes.json`);
}

function abrir() {
  fs.mkdirSync(path.dirname(ARQ_BANCO), { recursive: true });
  const db = new Database(ARQ_BANCO);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.exec(ESQUEMA);
  // IMMEDIATE trava a escrita: evita que dois processos (ex.: workers do build) criem dados iniciais em duplicidade.
  db.transaction(() => { criarAdministrador(db); importarClientesJson(db); }).immediate();
  return db;
}

// Reaproveita a conexão entre recarregamentos do Next.js em desenvolvimento.
export const db = globalThis.__comcilDb ?? (globalThis.__comcilDb = abrir());

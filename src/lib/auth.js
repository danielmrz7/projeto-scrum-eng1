import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { conferirSenha } from "@/lib/senha";
import { ErroNegocio, paraResposta, texto } from "@/lib/erros";

export const COOKIE = "comcil_sessao";
const DURACAO_MS = 8 * 60 * 60 * 1000; // 8 horas
const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS = 5 * 60 * 1000;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sha256 = (s) => createHash("sha256").update(s).digest("hex");
const tentativas = globalThis.__comcilTentativas ?? (globalThis.__comcilTentativas = new Map());

// RF01.01 / RF01.02 – valida o formato, confere a senha e bloqueia usuários inativos.
export function autenticar({ email, senha }) {
  email = texto(email).toLowerCase();
  senha = String(senha ?? "");
  if (!email || !senha) throw new ErroNegocio("Informe e-mail e senha.");
  if (!EMAIL_VALIDO.test(email)) throw new ErroNegocio("Informe um e-mail válido.");

  const t = tentativas.get(email);
  if (t && t.n >= MAX_TENTATIVAS && Date.now() - t.ultima < BLOQUEIO_MS)
    throw new ErroNegocio("Muitas tentativas incorretas. Aguarde alguns minutos e tente novamente.", 429);

  const f = db.prepare("SELECT * FROM funcionario WHERE email = ?").get(email);
  if (!f || !conferirSenha(senha, f.senha_hash)) {
    const n = t && Date.now() - t.ultima < BLOQUEIO_MS ? t.n + 1 : 1;
    tentativas.set(email, { n, ultima: Date.now() });
    throw new ErroNegocio("E-mail ou senha inválidos.", 401);
  }
  tentativas.delete(email);
  if (f.status !== "Ativo") throw new ErroNegocio("Usuário inativo. Procure o administrador do sistema.", 403);

  const token = randomBytes(32).toString("hex");
  db.prepare("DELETE FROM sessao WHERE expira_em < ?").run(Date.now());
  db.prepare("INSERT INTO sessao (token_hash, funcionario_id, expira_em) VALUES (?, ?, ?)").run(sha256(token), f.id, Date.now() + DURACAO_MS);
  cookies().set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: DURACAO_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
  return { id: f.id, nome: f.nome, email: f.email, cargo: f.cargo };
}

// RF01.03 – encerra a sessão no banco e apaga o cookie.
export function encerrarSessao() {
  const token = cookies().get(COOKIE)?.value;
  if (token) db.prepare("DELETE FROM sessao WHERE token_hash = ?").run(sha256(token));
  cookies().delete(COOKIE);
}

// Retorna o funcionário logado (ativo e com sessão válida) ou null.
export function usuarioAtual() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  return db.prepare(`
    SELECT f.id, f.nome, f.email, f.cargo FROM sessao s
    JOIN funcionario f ON f.id = s.funcionario_id
    WHERE s.token_hash = ? AND s.expira_em > ? AND f.status = 'Ativo'
  `).get(sha256(token), Date.now()) ?? null;
}

// Para páginas (Server Components): sem login válido, redireciona para /login.
// Layout e página renderizam em paralelo no App Router, então cada um deve chamar isto.
export function exigirUsuario() {
  const usuario = usuarioAtual();
  if (!usuario) redirect("/login");
  return usuario;
}

// RNF003 – envolve um handler de API exigindo usuário autenticado (e, opcionalmente, administrador).
export function protegido(handler, { admin = false } = {}) {
  return async (req, ctx) => {
    try {
      const usuario = usuarioAtual();
      if (!usuario) throw new ErroNegocio("Sessão expirada. Faça login novamente.", 401);
      if (admin && usuario.cargo !== "Administrador") throw new ErroNegocio("Acesso restrito a administradores.", 403);
      return await handler(req, ctx, usuario);
    } catch (e) {
      return paraResposta(e);
    }
  };
}

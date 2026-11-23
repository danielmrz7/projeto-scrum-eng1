"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const campo = "mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2";
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    // Validação rápida no navegador; a validação definitiva acontece no servidor.
    if (!email.trim() || !senha) return setErro("Informe e-mail e senha.");
    if (!EMAIL_VALIDO.test(email.trim())) return setErro("Informe um e-mail válido.");
    setEnviando(true);
    const { erro } = await api("/api/auth/login", { metodo: "POST", corpo: { email, senha } });
    setEnviando(false);
    if (erro) { setErro(erro); setSenha(""); return; }
    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={entrar} noValidate className="rounded-b-lg bg-white p-6 shadow">
      <label className="block text-sm font-medium">E-mail
        <input type="email" autoComplete="username" autoFocus className={campo} value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm font-medium">Senha
        <input type="password" autoComplete="current-password" className={campo} value={senha} onChange={(e) => setSenha(e.target.value)} />
      </label>
      {erro && <p role="alert" className="mt-3 text-sm text-comcil-red">{erro}</p>}
      <button disabled={enviando} className="mt-5 w-full rounded bg-comcil-red px-4 py-2 font-medium text-white hover:bg-red-800 disabled:opacity-60">
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

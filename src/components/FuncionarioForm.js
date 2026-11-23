"use client";
import { useState } from "react";

const campo = "mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2";

export default function FuncionarioForm({ inicial, onSalvar, onCancelar }) {
  const [dados, setDados] = useState({ nome: "", email: "", cargo: "Vendedor", ...inicial, senha: "" });
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const muda = (k) => (e) => setDados({ ...dados, [k]: e.target.value });
  const edicao = Boolean(dados.id);

  async function enviar(e) {
    e.preventDefault();
    if (dados.senha !== confirmacao) return setErro("A confirmação não confere com a senha.");
    setSalvando(true);
    setErro(await onSalvar(dados));
    setSalvando(false);
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form onSubmit={enviar} className="max-h-full w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl" noValidate>
        <h2 className="text-xl font-semibold">{edicao ? "Editar funcionário" : "Novo funcionário"}</h2>
        <label className="mt-4 block text-sm font-medium">Nome *
          <input className={campo} value={dados.nome} onChange={muda("nome")} autoFocus />
        </label>
        <label className="mt-3 block text-sm font-medium">E-mail (login) *
          <input type="email" className={campo} value={dados.email} onChange={muda("email")} autoComplete="off" />
        </label>
        <label className="mt-3 block text-sm font-medium">Cargo *
          <select className={campo} value={dados.cargo} onChange={muda("cargo")}>
            <option>Vendedor</option>
            <option>Administrador</option>
          </select>
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">{edicao ? "Nova senha" : "Senha *"}
            <input type="password" className={campo} value={dados.senha} onChange={muda("senha")} autoComplete="new-password" />
          </label>
          <label className="block text-sm font-medium">Confirmar senha
            <input type="password" className={campo} value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} autoComplete="new-password" />
          </label>
        </div>
        <p className="mt-1 text-xs text-stone-600">
          Mínimo de 6 caracteres, com letras e números.{edicao && " Deixe em branco para manter a senha atual."}
        </p>
        {erro && <p role="alert" className="mt-3 text-sm text-comcil-red">{erro}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancelar} className="rounded px-4 py-2 hover:bg-stone-100">Cancelar</button>
          <button disabled={salvando} className="rounded bg-comcil-red px-4 py-2 font-medium text-white hover:bg-red-800 disabled:opacity-60">Salvar funcionário</button>
        </div>
      </form>
    </div>
  );
}

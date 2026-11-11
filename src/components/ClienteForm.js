"use client";
import { useState } from "react";

const campo = "mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2";

export default function ClienteForm({ inicial, onSalvar, onCancelar }) {
  const [dados, setDados] = useState({ nome: "", telefone: "", endereco: "", ...inicial });
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const muda = (k) => (e) => setDados({ ...dados, [k]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro(await onSalvar(dados));
    setSalvando(false);
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form onSubmit={enviar} className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" noValidate>
        <h2 className="text-xl font-semibold">{dados.id ? "Editar cliente" : "Novo cliente"}</h2>
        <label className="mt-4 block text-sm font-medium">Nome *
          <input className={`${campo} ${erro?.includes("nome é") ? "border-comcil-red" : ""}`} value={dados.nome} onChange={muda("nome")} autoFocus />
        </label>
        <label className="mt-3 block text-sm font-medium">Telefone
          <input className={campo} value={dados.telefone} onChange={muda("telefone")} inputMode="tel" />
        </label>
        <label className="mt-3 block text-sm font-medium">Endereço
          <input className={campo} value={dados.endereco} onChange={muda("endereco")} />
        </label>
        {erro && <p role="alert" className="mt-3 text-sm text-comcil-red">{erro}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancelar} className="rounded px-4 py-2 hover:bg-stone-100">Cancelar</button>
          <button disabled={salvando} className="rounded bg-comcil-red px-4 py-2 font-medium text-white hover:bg-red-800 disabled:opacity-60">Salvar cliente</button>
        </div>
      </form>
    </div>
  );
}

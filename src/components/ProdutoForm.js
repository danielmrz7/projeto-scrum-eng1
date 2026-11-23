"use client";
import { useState } from "react";

const campo = "mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2";
const VAZIO = { nome: "", categoria: "Embalado", unidadeMedida: "un", precoVenda: "", quantidade: "0", quantidadeMinima: "0" };

export default function ProdutoForm({ inicial, onSalvar, onCancelar }) {
  const [dados, setDados] = useState({ ...VAZIO, ...inicial });
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
      <form onSubmit={enviar} className="max-h-full w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl" noValidate>
        <h2 className="text-xl font-semibold">{dados.id ? "Editar produto" : "Novo produto"}</h2>
        <label className="mt-4 block text-sm font-medium">Nome *
          <input className={campo} value={dados.nome} onChange={muda("nome")} maxLength={150} autoFocus />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">Categoria *
            <select className={campo} value={dados.categoria} onChange={muda("categoria")}>
              <option>Matéria-prima</option>
              <option>Embalado</option>
            </select>
          </label>
          <label className="block text-sm font-medium">Unidade de medida *
            <select className={campo} value={dados.unidadeMedida} onChange={muda("unidadeMedida")}>
              {["kg", "g", "un", "pct", "cx", "L"].map((u) => <option key={u}>{u}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <label className="block text-sm font-medium">Preço (R$) *
            <input className={campo} value={dados.precoVenda} onChange={muda("precoVenda")} inputMode="decimal" placeholder="0,00" />
          </label>
          <label className="block text-sm font-medium">Quantidade *
            <input className={campo} value={dados.quantidade} onChange={muda("quantidade")} inputMode="numeric" />
          </label>
          <label className="block text-sm font-medium">Qtd. mínima *
            <input className={campo} value={dados.quantidadeMinima} onChange={muda("quantidadeMinima")} inputMode="numeric" />
          </label>
        </div>
        {erro && <p role="alert" className="mt-3 text-sm text-comcil-red">{erro}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancelar} className="rounded px-4 py-2 hover:bg-stone-100">Cancelar</button>
          <button disabled={salvando} className="rounded bg-comcil-red px-4 py-2 font-medium text-white hover:bg-red-800 disabled:opacity-60">Salvar produto</button>
        </div>
      </form>
    </div>
  );
}

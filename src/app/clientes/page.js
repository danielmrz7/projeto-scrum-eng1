"use client";
import { useCallback, useEffect, useState } from "react";
import ClienteTable from "@/components/ClienteTable";
import ClienteForm from "@/components/ClienteForm";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null); // null = fechado, {} = novo
  const [aviso, setAviso] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const r = await fetch(`/api/clientes?busca=${encodeURIComponent(busca)}`);
      if (!r.ok) throw new Error();
      setClientes(await r.json());
    } catch {
      setAviso({ erro: true, texto: "Falha de comunicação: não foi possível carregar os clientes." });
    }
  }, [busca]);

  useEffect(() => { const t = setTimeout(carregar, 250); return () => clearTimeout(t); }, [carregar]);

  async function salvar(dados) {
    const novo = !dados.id;
    const r = await fetch(novo ? "/api/clientes" : `/api/clientes/${dados.id}`, {
      method: novo ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return j.erro || "Falha na gravação. A operação foi cancelada.";
    setEditando(null);
    setAviso({ texto: novo ? "Cliente cadastrado com sucesso." : "Cliente atualizado com sucesso." });
    carregar();
    return null;
  }

  async function excluir(c) {
    if (!confirm(`Excluir o cliente "${c.nome}"?`)) return;
    const r = await fetch(`/api/clientes/${c.id}`, { method: "DELETE" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setAviso({ erro: true, texto: j.erro || "Falha ao excluir." });
    setAviso({ texto: j.inativado ? "O cliente possui vendas vinculadas e foi apenas inativado." : "Cliente excluído com sucesso." });
    carregar();
  }

  return (
    <main>
      <header className="border-b-4 border-comcil-gold bg-comcil-red text-white">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <p className="text-sm opacity-90">Comcil · Administração de Estoque</p>
          <h1 className="text-2xl font-bold">Clientes</h1>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou código"
            aria-label="Buscar cliente" className="min-w-0 flex-1 rounded border border-stone-300 bg-white px-3 py-2" />
          <button onClick={() => setEditando({})} className="rounded bg-comcil-ink px-4 py-2 font-medium text-white hover:bg-black">Novo cliente</button>
        </div>
        {aviso && <p role="status" className={`mb-4 rounded px-4 py-2 text-sm ${aviso.erro ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"}`}>{aviso.texto}</p>}
        <ClienteTable clientes={clientes} onEditar={setEditando} onExcluir={excluir} onReativar={(c) => salvar({ ...c, status: "Ativo" })} />
      </section>
      {editando && <ClienteForm inicial={editando} onSalvar={salvar} onCancelar={() => setEditando(null)} />}
    </main>
  );
}

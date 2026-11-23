"use client";
import { useCallback, useEffect, useState } from "react";
import ClienteTable from "@/components/ClienteTable";
import ClienteForm from "@/components/ClienteForm";
import { api } from "@/lib/api";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null); // null = fechado, {} = novo
  const [aviso, setAviso] = useState(null);

  const carregar = useCallback(async () => {
    const { dados, erro } = await api(`/api/clientes?busca=${encodeURIComponent(busca)}`);
    if (erro) return setAviso({ erro: true, texto: "Falha de comunicação: não foi possível carregar os clientes." });
    setClientes(dados);
  }, [busca]);

  useEffect(() => { const t = setTimeout(carregar, 250); return () => clearTimeout(t); }, [carregar]);

  async function salvar(cliente) {
    const novo = !cliente.id;
    const { erro } = await api(novo ? "/api/clientes" : `/api/clientes/${cliente.id}`, { metodo: novo ? "POST" : "PUT", corpo: cliente });
    if (erro) return erro;
    setEditando(null);
    setAviso({ texto: novo ? "Cliente cadastrado com sucesso." : "Cliente atualizado com sucesso." });
    carregar();
    return null;
  }

  async function excluir(c) {
    if (!confirm(`Excluir o cliente "${c.nome}"?`)) return;
    const { dados, erro } = await api(`/api/clientes/${c.id}`, { metodo: "DELETE" });
    if (erro) return setAviso({ erro: true, texto: erro });
    setAviso({ texto: dados.inativado ? "O cliente possui vendas vinculadas e foi apenas inativado." : "Cliente excluído com sucesso." });
    carregar();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Clientes</h1>
      <div className="mb-4 flex flex-wrap gap-3">
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou código"
          aria-label="Buscar cliente" className="min-w-0 flex-1 rounded border border-stone-300 bg-white px-3 py-2" />
        <button onClick={() => setEditando({})} className="rounded bg-comcil-ink px-4 py-2 font-medium text-white hover:bg-black">Novo cliente</button>
      </div>
      {aviso && <p role="status" className={`mb-4 rounded px-4 py-2 text-sm ${aviso.erro ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"}`}>{aviso.texto}</p>}
      <ClienteTable clientes={clientes} onEditar={setEditando} onExcluir={excluir} onReativar={(c) => salvar({ ...c, status: "Ativo" })} />
      {editando && <ClienteForm inicial={editando} onSalvar={salvar} onCancelar={() => setEditando(null)} />}
    </main>
  );
}

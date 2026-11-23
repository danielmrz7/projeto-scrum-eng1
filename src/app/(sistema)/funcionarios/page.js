"use client";
import { useCallback, useEffect, useState } from "react";
import FuncionarioTable from "@/components/FuncionarioTable";
import FuncionarioForm from "@/components/FuncionarioForm";
import { api } from "@/lib/api";

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState(null);

  const carregar = useCallback(async () => {
    const { dados, erro } = await api(`/api/funcionarios?busca=${encodeURIComponent(busca)}`);
    if (erro) return setAviso({ erro: true, texto: erro });
    setFuncionarios(dados);
  }, [busca]);

  useEffect(() => { const t = setTimeout(carregar, 250); return () => clearTimeout(t); }, [carregar]);

  async function salvar(f) {
    const novo = !f.id;
    const { erro } = await api(novo ? "/api/funcionarios" : `/api/funcionarios/${f.id}`, { metodo: novo ? "POST" : "PUT", corpo: f });
    if (erro) return erro;
    setEditando(null);
    setAviso({ texto: novo ? "Funcionário cadastrado com sucesso." : "Funcionário atualizado com sucesso." });
    carregar();
    return null;
  }

  // Reativar/inativar não muda a senha: envia sem o campo senha.
  async function alterarStatus(f, status) {
    const { erro } = await api(`/api/funcionarios/${f.id}`, { metodo: "PUT", corpo: { ...f, status } });
    setAviso(erro ? { erro: true, texto: erro } : { texto: `Funcionário ${status === "Ativo" ? "reativado" : "inativado"}.` });
    carregar();
  }

  async function excluir(f) {
    if (!confirm(`Excluir o funcionário "${f.nome}"?`)) return;
    const { dados, erro } = await api(`/api/funcionarios/${f.id}`, { metodo: "DELETE" });
    if (erro) return setAviso({ erro: true, texto: erro });
    setAviso({ texto: dados.inativado ? "O funcionário possui vendas registradas e foi apenas inativado." : "Funcionário excluído com sucesso." });
    carregar();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Funcionários</h1>
      <div className="mb-4 flex flex-wrap gap-3">
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, e-mail ou código"
          aria-label="Buscar funcionário" className="min-w-0 flex-1 rounded border border-stone-300 bg-white px-3 py-2" />
        <button onClick={() => setEditando({})} className="rounded bg-comcil-ink px-4 py-2 font-medium text-white hover:bg-black">Novo funcionário</button>
      </div>
      {aviso && <p role="status" className={`mb-4 rounded px-4 py-2 text-sm ${aviso.erro ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"}`}>{aviso.texto}</p>}
      <FuncionarioTable funcionarios={funcionarios} onEditar={setEditando} onExcluir={excluir} onStatus={alterarStatus} />
      {editando && <FuncionarioForm inicial={editando} onSalvar={salvar} onCancelar={() => setEditando(null)} />}
    </main>
  );
}

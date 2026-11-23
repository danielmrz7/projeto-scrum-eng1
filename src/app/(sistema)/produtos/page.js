"use client";
import { useCallback, useEffect, useState } from "react";
import ProdutoTable from "@/components/ProdutoTable";
import ProdutoForm from "@/components/ProdutoForm";
import { api } from "@/lib/api";

const filtro = "rounded border border-stone-300 bg-white px-3 py-2";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estoque, setEstoque] = useState("");
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState(null);

  // Permite abrir já filtrado a partir do alerta da tela inicial (/produtos?estoque=baixo).
  useEffect(() => { setEstoque(new URLSearchParams(window.location.search).get("estoque") ?? ""); }, []);

  const carregar = useCallback(async () => {
    const q = new URLSearchParams({ busca, categoria, estoque });
    const { dados, erro } = await api(`/api/produtos?${q}`);
    if (erro) return setAviso({ erro: true, texto: "Falha de comunicação: não foi possível carregar os produtos." });
    setProdutos(dados);
  }, [busca, categoria, estoque]);

  useEffect(() => { const t = setTimeout(carregar, 250); return () => clearTimeout(t); }, [carregar]);

  async function salvar(produto) {
    const novo = !produto.id;
    const { erro } = await api(novo ? "/api/produtos" : `/api/produtos/${produto.id}`, { metodo: novo ? "POST" : "PUT", corpo: produto });
    if (erro) return erro;
    setEditando(null);
    setAviso({ texto: novo ? "Produto cadastrado com sucesso." : "Produto atualizado com sucesso." });
    carregar();
    return null;
  }

  async function excluir(p) {
    if (!confirm(`Excluir o produto "${p.nome}"?`)) return;
    const { dados, erro } = await api(`/api/produtos/${p.id}`, { metodo: "DELETE" });
    if (erro) return setAviso({ erro: true, texto: erro });
    setAviso({ texto: dados.inativado ? "O produto possui histórico de vendas ou entradas e foi apenas inativado." : "Produto excluído com sucesso." });
    carregar();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Produtos</h1>
      <div className="mb-4 flex flex-wrap gap-3">
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou código"
          aria-label="Buscar produto" className={`${filtro} min-w-0 flex-1`} />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Filtrar por categoria" className={filtro}>
          <option value="">Todas as categorias</option>
          <option>Matéria-prima</option>
          <option>Embalado</option>
        </select>
        <select value={estoque} onChange={(e) => setEstoque(e.target.value)} aria-label="Filtrar por estoque" className={filtro}>
          <option value="">Qualquer estoque</option>
          <option value="disponivel">Com estoque</option>
          <option value="baixo">No mínimo ou abaixo</option>
          <option value="zerado">Sem estoque</option>
        </select>
        <button onClick={() => setEditando({})} className="rounded bg-comcil-ink px-4 py-2 font-medium text-white hover:bg-black">Novo produto</button>
      </div>
      {aviso && <p role="status" className={`mb-4 rounded px-4 py-2 text-sm ${aviso.erro ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"}`}>{aviso.texto}</p>}
      <ProdutoTable produtos={produtos} onEditar={setEditando} onExcluir={excluir} onReativar={(p) => salvar({ ...p, status: "Ativo" })} />
      {editando && <ProdutoForm inicial={editando} onSalvar={salvar} onCancelar={() => setEditando(null)} />}
    </main>
  );
}

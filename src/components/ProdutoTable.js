const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function ProdutoTable({ produtos, onEditar, onExcluir, onReativar }) {
  if (!produtos.length)
    return <p className="rounded border border-dashed border-stone-300 p-8 text-center text-stone-600">Nenhum produto encontrado. Use “Novo produto” para cadastrar.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-100 text-stone-700">
          <tr>
            {["Código", "Nome", "Categoria", "Preço", "Estoque", "Mínimo", "Status", "Ações"].map((h) => (
              <th key={h} className={`px-4 py-3 font-semibold ${["Preço", "Estoque", "Mínimo"].includes(h) ? "text-right" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => {
            const baixo = p.quantidade <= p.quantidadeMinima;
            return (
              <tr key={p.id} className="border-t border-stone-100">
                <td className="px-4 py-3 tabular-nums">{p.id}</td>
                <td className="px-4 py-3 font-medium">{p.nome}</td>
                <td className="px-4 py-3">{p.categoria}</td>
                <td className="px-4 py-3 text-right tabular-nums">{moeda.format(p.precoVenda)}</td>
                <td className={`px-4 py-3 text-right tabular-nums ${baixo ? "font-semibold text-comcil-red" : ""}`}>
                  {p.quantidade} {p.unidadeMedida}{baixo && <span className="sr-only"> (estoque baixo)</span>}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{p.quantidadeMinima}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${p.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-700"}`}>{p.status}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button onClick={() => onEditar(p)} className="mr-3 text-blue-800 underline">Editar</button>
                  {p.status === "Inativo" && <button onClick={() => onReativar(p)} className="mr-3 text-green-800 underline">Reativar</button>}
                  <button onClick={() => onExcluir(p)} className="text-comcil-red underline">Excluir</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

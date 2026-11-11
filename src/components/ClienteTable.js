export default function ClienteTable({ clientes, onEditar, onExcluir, onReativar }) {
  if (!clientes.length)
    return <p className="rounded border border-dashed border-stone-300 p-8 text-center text-stone-600">Nenhum cliente encontrado. Use “Novo cliente” para cadastrar o primeiro.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-100 text-stone-700">
          <tr>{["Código", "Nome", "Telefone", "Endereço", "Status", "Ações"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} className="border-t border-stone-100">
              <td className="px-4 py-3 tabular-nums">{c.id}</td>
              <td className="px-4 py-3 font-medium">{c.nome}</td>
              <td className="px-4 py-3">{c.telefone || "—"}</td>
              <td className="px-4 py-3">{c.endereco || "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${c.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-700"}`}>{c.status}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <button onClick={() => onEditar(c)} className="mr-3 text-blue-800 underline">Editar</button>
                {c.status === "Inativo" && <button onClick={() => onReativar(c)} className="mr-3 text-green-800 underline">Reativar</button>}
                <button onClick={() => onExcluir(c)} className="text-comcil-red underline">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

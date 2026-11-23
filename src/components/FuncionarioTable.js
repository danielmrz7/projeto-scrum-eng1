export default function FuncionarioTable({ funcionarios, onEditar, onExcluir, onStatus }) {
  if (!funcionarios.length)
    return <p className="rounded border border-dashed border-stone-300 p-8 text-center text-stone-600">Nenhum funcionário encontrado.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-100 text-stone-700">
          <tr>{["Código", "Nome", "E-mail", "Cargo", "Status", "Ações"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {funcionarios.map((f) => (
            <tr key={f.id} className="border-t border-stone-100">
              <td className="px-4 py-3 tabular-nums">{f.id}</td>
              <td className="px-4 py-3 font-medium">{f.nome}</td>
              <td className="px-4 py-3">{f.email}</td>
              <td className="px-4 py-3">{f.cargo}</td>
              <td className="px-4 py-3">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${f.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-700"}`}>{f.status}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <button onClick={() => onEditar(f)} className="mr-3 text-blue-800 underline">Editar</button>
                {f.status === "Ativo"
                  ? <button onClick={() => onStatus(f, "Inativo")} className="mr-3 text-stone-700 underline">Inativar</button>
                  : <button onClick={() => onStatus(f, "Ativo")} className="mr-3 text-green-800 underline">Reativar</button>}
                <button onClick={() => onExcluir(f)} className="text-comcil-red underline">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

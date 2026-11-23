import Link from "next/link";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function Inicio() {
  const usuario = exigirUsuario();
  const conta = (sql) => db.prepare(sql).get().n;
  const cards = [
    { href: "/clientes", titulo: "Clientes", valor: conta("SELECT COUNT(*) n FROM cliente WHERE status = 'Ativo'"), rotulo: "clientes ativos" },
    { href: "/produtos", titulo: "Produtos", valor: conta("SELECT COUNT(*) n FROM produto WHERE status = 'Ativo'"), rotulo: "produtos ativos" },
  ];
  if (usuario.cargo === "Administrador")
    cards.push({ href: "/funcionarios", titulo: "Funcionários", valor: conta("SELECT COUNT(*) n FROM funcionario WHERE status = 'Ativo'"), rotulo: "funcionários ativos" });
  const baixos = conta("SELECT COUNT(*) n FROM produto WHERE status = 'Ativo' AND quantidade <= quantidade_minima");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Olá, {usuario.nome.split(" ")[0]}</h1>
      <p className="mt-1 text-stone-600">Escolha um módulo para começar.</p>

      {baixos > 0 && (
        <Link href="/produtos?estoque=baixo" className="mt-6 block rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 hover:bg-amber-100">
          <strong>{baixos}</strong> produto(s) com estoque no mínimo ou abaixo dele. Ver produtos →
        </Link>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-lg border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="font-semibold">{c.titulo}</h2>
            <p className="mt-3 text-3xl font-bold tabular-nums text-comcil-red">{c.valor}</p>
            <p className="text-sm text-stone-600">{c.rotulo}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

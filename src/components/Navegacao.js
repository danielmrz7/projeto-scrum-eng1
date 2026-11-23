"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navegacao({ usuario }) {
  const rota = usePathname();
  const router = useRouter();
  const links = [
    ["/", "Início"],
    ["/clientes", "Clientes"],
    ["/produtos", "Produtos"],
    ...(usuario.cargo === "Administrador" ? [["/funcionarios", "Funcionários"]] : []),
  ];

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="border-b-4 border-comcil-gold bg-comcil-red text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="font-bold">Comcil <span className="font-normal opacity-90">· Estoque</span></Link>
        <nav className="flex flex-1 flex-wrap gap-1 text-sm">
          {links.map(([href, rotulo]) => {
            const ativo = href === "/" ? rota === "/" : rota.startsWith(href);
            return (
              <Link key={href} href={href} aria-current={ativo ? "page" : undefined}
                className={`rounded px-3 py-1.5 ${ativo ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}>{rotulo}</Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="opacity-90">{usuario.nome} <span className="opacity-75">({usuario.cargo})</span></span>
          <button onClick={sair} className="rounded border border-white/60 px-3 py-1 hover:bg-white/10">Sair</button>
        </div>
      </div>
    </header>
  );
}

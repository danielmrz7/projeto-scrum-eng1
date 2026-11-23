import { redirect } from "next/navigation";
import { usuarioAtual } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Comcil – Entrar" };

export default function LoginPage() {
  if (usuarioAtual()) redirect("/");
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-t-lg border-b-4 border-comcil-gold bg-comcil-red px-6 py-5 text-white">
          <p className="text-sm opacity-90">Comcil · Administração de Estoque</p>
          <h1 className="text-2xl font-bold">Entrar no sistema</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import { exigirUsuario } from "@/lib/auth";

export const metadata = { title: "Comcil – Funcionários" };

export default function FuncionariosLayout({ children }) {
  if (exigirUsuario().cargo !== "Administrador") redirect("/");
  return children;
}

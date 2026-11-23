import { listar, criar } from "@/services/funcionarioService";
import { protegido } from "@/lib/auth";
export const dynamic = "force-dynamic";

// Gestão de funcionários é restrita a administradores.
export const GET = protegido(async (req) => Response.json(listar(new URL(req.url).searchParams.get("busca") ?? "")), { admin: true });
export const POST = protegido(async (req) => Response.json(criar(await req.json()), { status: 201 }), { admin: true });

import { listar, criar } from "@/services/clienteService";
import { protegido } from "@/lib/auth";
export const dynamic = "force-dynamic";

export const GET = protegido(async (req) => Response.json(listar(new URL(req.url).searchParams.get("busca") ?? "")));
export const POST = protegido(async (req) => Response.json(criar(await req.json()), { status: 201 }));

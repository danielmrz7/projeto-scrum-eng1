import { listar, criar } from "@/services/produtoService";
import { protegido } from "@/lib/auth";
export const dynamic = "force-dynamic";

export const GET = protegido(async (req) => {
  const p = new URL(req.url).searchParams;
  return Response.json(listar({ busca: p.get("busca") ?? "", categoria: p.get("categoria") ?? "", estoque: p.get("estoque") ?? "" }));
});
export const POST = protegido(async (req) => Response.json(criar(await req.json()), { status: 201 }));

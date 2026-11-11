import { listar, criar, paraResposta } from "@/services/clienteService";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try { return Response.json(await listar(new URL(req.url).searchParams.get("busca") ?? "")); }
  catch (e) { return paraResposta(e); }
}
export async function POST(req) {
  try { return Response.json(await criar(await req.json()), { status: 201 }); }
  catch (e) { return paraResposta(e); }
}

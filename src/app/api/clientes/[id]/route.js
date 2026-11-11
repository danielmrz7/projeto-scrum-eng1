import { atualizar, remover, paraResposta } from "@/services/clienteService";
export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  try { return Response.json(await atualizar(Number(params.id), await req.json())); }
  catch (e) { return paraResposta(e); }
}
export async function DELETE(_req, { params }) {
  try { return Response.json(await remover(Number(params.id))); }
  catch (e) { return paraResposta(e); }
}

import { autenticar } from "@/lib/auth";
import { paraResposta } from "@/lib/erros";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try { return Response.json(autenticar(await req.json().catch(() => ({})))); }
  catch (e) { return paraResposta(e); }
}

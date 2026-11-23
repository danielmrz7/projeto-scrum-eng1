import { atualizar, remover } from "@/services/funcionarioService";
import { protegido } from "@/lib/auth";
export const dynamic = "force-dynamic";

export const PUT = protegido(async (req, { params }, usuario) => Response.json(atualizar(Number(params.id), await req.json(), usuario)), { admin: true });
export const DELETE = protegido(async (_req, { params }, usuario) => Response.json(remover(Number(params.id), usuario)), { admin: true });

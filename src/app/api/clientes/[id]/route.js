import { atualizar, remover } from "@/services/clienteService";
import { protegido } from "@/lib/auth";
export const dynamic = "force-dynamic";

export const PUT = protegido(async (req, { params }) => Response.json(atualizar(Number(params.id), await req.json())));
export const DELETE = protegido(async (_req, { params }) => Response.json(remover(Number(params.id))));

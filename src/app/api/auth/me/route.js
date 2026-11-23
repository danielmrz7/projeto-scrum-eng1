import { protegido } from "@/lib/auth";
export const dynamic = "force-dynamic";

export const GET = protegido(async (_req, _ctx, usuario) => Response.json(usuario));

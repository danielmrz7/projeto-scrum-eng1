export class ErroNegocio extends Error {
  constructor(msg, status = 400) { super(msg); this.status = status; }
}

export function paraResposta(e) {
  if (e instanceof ErroNegocio) return Response.json({ erro: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ erro: "Falha na comunicação com a base de dados." }, { status: 500 });
}

export const texto = (v) => String(v ?? "").trim();
export const norm = (s) => texto(s).toLowerCase().replace(/\s+/g, " ");
export const digitos = (s) => String(s ?? "").replace(/\D/g, "");

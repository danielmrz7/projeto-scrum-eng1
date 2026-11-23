// Chamada à API pelo navegador. Retorna { dados } ou { erro }; sessão expirada → volta ao login.
export async function api(url, { metodo = "GET", corpo } = {}) {
  let r;
  try {
    r = await fetch(url, {
      method: metodo,
      headers: corpo ? { "Content-Type": "application/json" } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    return { erro: "Falha de comunicação com o servidor." };
  }
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && !url.startsWith("/api/auth/")) {
    window.location.href = "/login";
    return { erro: j.erro };
  }
  return r.ok ? { dados: j } : { erro: j.erro || "Falha na operação. Tente novamente." };
}

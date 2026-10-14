import { adminLigado, COOKIE_ADMIN, cookieDe, dadosAdmin, sessaoValida } from "@/lib/pagamento/admin";
import { json } from "@/lib/pagamento/http";

// runtime Node.js: o padrão (e obrigatório com cacheComponents)

/** GET /api/admin/dados: licenças (chave mascarada) e pagamentos. */
export async function GET(req: Request) {
  // lê o cookie ANTES de tudo: isso torna a rota sempre dinâmica (nunca
  // pré-renderizada no build, quando ADMIN_SENHA pode estar vazia)
  const sessao = cookieDe(req, COOKIE_ADMIN);
  if (!adminLigado()) return json({ ok: false, motivo: "desligado" }, 404);
  if (!sessaoValida(sessao)) return json({ ok: false, motivo: "nao_autorizado" }, 401);
  try {
    return json({ ok: true, ...(await dadosAdmin()) });
  } catch (e) {
    console.error("[admin/dados]", e instanceof Error ? e.message : e);
    return json({ ok: false, motivo: "indisponivel" }, 503);
  }
}

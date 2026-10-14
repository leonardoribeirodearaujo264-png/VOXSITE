import { adminLigado, autorizado, executarAcao, type AcaoAdmin } from "@/lib/pagamento/admin";
import { json, lerJson } from "@/lib/pagamento/http";

// runtime Node.js: o padrão (e obrigatório com cacheComponents)

const ACOES: AcaoAdmin[] = ["mostrar", "reenviar", "revogar", "reativar", "liberar"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** POST /api/admin/acao {acao, licenca_id}. Só JSON: formulário de outro site não chega aqui. */
export async function POST(req: Request) {
  if (!adminLigado()) return json({ ok: false, motivo: "desligado" }, 404);
  if (!autorizado(req)) return json({ ok: false, motivo: "nao_autorizado" }, 401);
  if (!(req.headers.get("content-type") || "").includes("application/json")) return json({ ok: false }, 415);
  const corpo = await lerJson(req);
  const acao = corpo?.acao as AcaoAdmin;
  const id = String(corpo?.licenca_id ?? "");
  if (!ACOES.includes(acao) || !UUID.test(id)) return json({ ok: false, mensagem: "Pedido inválido." }, 400);
  try {
    return json(await executarAcao(acao, id));
  } catch (e) {
    console.error("[admin/acao]", e instanceof Error ? e.message : e);
    return json({ ok: false, mensagem: "Não deu certo. Tente de novo." }, 500);
  }
}

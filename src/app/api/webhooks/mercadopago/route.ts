import { cfg } from "@/lib/pagamento/config";
import { json, lerJson } from "@/lib/pagamento/http";
import { assinaturaValida } from "@/lib/pagamento/mercadopago";
import { processarPagamento } from "@/lib/pagamento/webhook";

// runtime Node.js: o padrão (e obrigatório com cacheComponents)

/**
 * POST /api/webhooks/mercadopago. Assinatura inválida -> 401 sem processar.
 * Só "payment". O pagamento é sempre consultado na API oficial.
 * Erro interno -> 500 (o Mercado Pago tenta de novo).
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id");
  const ok = assinaturaValida({
    xSignature: req.headers.get("x-signature"),
    xRequestId: req.headers.get("x-request-id"),
    dataId,
    segredo: cfg.mpWebhookSecret,
  });
  if (!ok) return json({ ok: false }, 401);

  const corpo = (await lerJson(req)) ?? {};
  const tipo = url.searchParams.get("type") || url.searchParams.get("topic") || String(corpo.type ?? corpo.topic ?? "");
  if (tipo !== "payment") return json({ ok: true, ignorado: true });
  if (!dataId || !/^\d{1,30}$/.test(dataId)) return json({ ok: true, ignorado: true });

  try {
    const resultado = await processarPagamento(dataId);
    return json({ ok: true, resultado });
  } catch (e) {
    console.error("[webhook mercadopago]", e instanceof Error ? e.message : e);
    return json({ ok: false }, 500);
  }
}

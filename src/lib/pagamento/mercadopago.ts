/** Mercado Pago por fetch (sem SDK): Checkout Pro e consulta de pagamento. */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cfg, ITEM_ID, ITEM_TITULO, MOEDA, PRECO } from "./config";

const API = "https://api.mercadopago.com";

export class MercadoPagoFalhou extends Error {}

export type Pagamento = {
  id: string;
  status: string;
  transaction_amount: number;
  currency_id: string;
  external_reference: string | null;
};

function token(): string {
  const t = cfg.mpToken;
  if (!t) throw new MercadoPagoFalhou("MP_ACCESS_TOKEN não configurado");
  return t;
}

/** Cria a preferência de pagamento único. Preço sempre o da constante. */
export async function criarPreferencia(pedido: { id: string; email: string }): Promise<{ id: string; url: string }> {
  const site = cfg.siteUrl;
  const corpo = {
    items: [{ id: ITEM_ID, title: ITEM_TITULO, quantity: 1, unit_price: PRECO, currency_id: MOEDA }],
    payer: { email: pedido.email },
    external_reference: pedido.id,
    notification_url: `${site}/api/webhooks/mercadopago?source_news=webhooks`,
    back_urls: {
      success: `${site}/compra/sucesso`,
      pending: `${site}/compra/pendente`,
      failure: `${site}/compra/falha`,
    },
    auto_return: "approved",
    statement_descriptor: "VOX VIDEOS",
    payment_methods: { installments: 12 },
  };
  const r = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": pedido.id,
    },
    body: JSON.stringify(corpo),
  });
  if (!r.ok) throw new MercadoPagoFalhou(`preferência: HTTP ${r.status}`);
  const d = (await r.json()) as { id?: string; init_point?: string; sandbox_init_point?: string };
  const url = cfg.mpTeste ? d.sandbox_init_point : d.init_point;
  if (!d.id || !url) throw new MercadoPagoFalhou("preferência sem id ou link");
  return { id: String(d.id), url };
}

export async function buscarPagamento(id: string): Promise<Pagamento> {
  if (!/^\d{1,30}$/.test(id)) throw new MercadoPagoFalhou("id de pagamento inválido");
  const r = await fetch(`${API}/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
  });
  if (!r.ok) throw new MercadoPagoFalhou(`pagamento ${id}: HTTP ${r.status}`);
  const d = (await r.json()) as Record<string, unknown>;
  return {
    id: String(d.id ?? id),
    status: String(d.status ?? ""),
    transaction_amount: Number(d.transaction_amount),
    currency_id: String(d.currency_id ?? ""),
    external_reference: d.external_reference ? String(d.external_reference) : null,
  };
}

/**
 * Assinatura do webhook (x-signature "ts=...,v1=..."):
 * manifesto `id:${data.id};request-id:${x-request-id};ts:${ts};`,
 * HMAC-SHA256 hex com MP_WEBHOOK_SECRET, comparado em tempo constante.
 */
export function assinaturaValida(opts: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  segredo: string;
}): boolean {
  const { xSignature, xRequestId, dataId, segredo } = opts;
  if (!segredo || !xSignature) return false;
  let ts = "";
  let v1 = "";
  for (const parte of xSignature.split(",")) {
    const [k, ...resto] = parte.split("=");
    const v = resto.join("=").trim();
    if (k.trim() === "ts") ts = v;
    if (k.trim() === "v1") v1 = v.toLowerCase();
  }
  if (!ts || !/^[0-9a-f]{64}$/.test(v1)) return false;
  let manifesto = "";
  if (dataId) {
    const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;
    manifesto += `id:${id};`;
  }
  if (xRequestId) manifesto += `request-id:${xRequestId};`;
  manifesto += `ts:${ts};`;
  const esperado = createHmac("sha256", segredo).update(manifesto).digest();
  return timingSafeEqual(esperado, Buffer.from(v1, "hex"));
}

/** Valor certo em centavos (evita 469.999 de ponto flutuante). */
export function valorConfere(p: Pagamento): boolean {
  return Math.round(p.transaction_amount * 100) === Math.round(PRECO * 100) && p.currency_id === MOEDA;
}

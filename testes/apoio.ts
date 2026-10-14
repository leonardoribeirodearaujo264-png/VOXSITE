/**
 * Apoio dos testes: PGlite em memória com o mesmo SQL de produção e um
 * fetch falso para o Mercado Pago e o Resend. Nenhum segredo real: os
 * valores abaixo existem só para os testes.
 */
import { createHmac } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { banco, definirBanco, type Banco, type Executor } from "@/lib/pagamento/banco";

export const SEGREDO_VETORES = "segredo-de-teste-somente-para-vetores";
export const SEGREDO_WEBHOOK_TESTE = "webhook-somente-para-teste";
export const SITE_TESTE = "https://vox.exemplo";

export function ambienteDeTeste() {
  Object.assign(process.env, {
    VOX_SEGREDO_LICENCA: SEGREDO_VETORES,
    MP_ACCESS_TOKEN: "TEST-token-falso",
    MP_WEBHOOK_SECRET: SEGREDO_WEBHOOK_TESTE,
    MP_AMBIENTE: "teste",
    RESEND_API_KEY: "re_falso",
    EMAIL_REMETENTE: "VOX Videos <chave@vox.exemplo>",
    NEXT_PUBLIC_SITE_URL: SITE_TESTE,
    MAQUINAS_POR_LICENCA: "2",
    EXIGIR_PAGAMENTO: "",
    ADMIN_SENHA: "",
  });
}

let pg: PGlite | null = null;

export async function bancoDeTeste(): Promise<PGlite> {
  if (!pg) pg = new PGlite();
  const p = pg;
  const exec = (q: Pick<PGlite, "query">): Executor => ({
    async query(sql, params = []) {
      return (await q.query(sql, params)).rows as never[];
    },
  });
  const b: Banco = {
    ...exec(p),
    transacao: (fn) => p.transaction((tx) => fn(exec(tx))),
  };
  await p.exec(
    `DROP TABLE IF EXISTS licenca_maquinas, licencas, webhook_eventos, limites, pedidos CASCADE`,
  );
  definirBanco(b);
  await banco(); // roda a migração de produção
  return p;
}

export type Chamada = { url: string; metodo: string; headers: Record<string, string>; corpo: unknown };

export type Pagto = {
  id: string;
  status: string;
  transaction_amount: number;
  currency_id: string;
  external_reference: string | null;
};

/** fetch falso: guarda as chamadas e responde como MP e Resend. */
export function fetchFalso() {
  const chamadas: Chamada[] = [];
  const pagamentos = new Map<string, Pagto>();
  let pref = 0;
  let falharEmail = false;
  const f = async (entrada: string | URL | Request, init?: RequestInit) => {
    const url = String(entrada instanceof Request ? entrada.url : entrada);
    const metodo = (init?.method || "GET").toUpperCase();
    const headers = Object.fromEntries(new Headers(init?.headers).entries());
    const corpo = init?.body ? JSON.parse(String(init.body)) : null;
    chamadas.push({ url, metodo, headers, corpo });
    if (url === "https://api.mercadopago.com/checkout/preferences") {
      pref += 1;
      return Response.json({
        id: `pref-${pref}`,
        init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-${pref}`,
        sandbox_init_point: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-${pref}`,
      }, { status: 201 });
    }
    const m = /^https:\/\/api\.mercadopago\.com\/v1\/payments\/(\d+)$/.exec(url);
    if (m) {
      const p = pagamentos.get(m[1]);
      return p ? Response.json(p) : Response.json({ message: "not found" }, { status: 404 });
    }
    if (url === "https://api.resend.com/emails") {
      if (falharEmail) return Response.json({ message: "erro" }, { status: 500 });
      return Response.json({ id: `email-${chamadas.length}` });
    }
    return Response.json({ message: "inesperado" }, { status: 599 });
  };
  return {
    f: f as typeof fetch,
    chamadas,
    pagamentos,
    preferencias: () => chamadas.filter((c) => c.url.endsWith("/checkout/preferences")),
    emails: () => chamadas.filter((c) => c.url === "https://api.resend.com/emails"),
    falharEmail: (v: boolean) => {
      falharEmail = v;
    },
  };
}

export function req(caminho: string, corpo: unknown, opts: { ip?: string; headers?: Record<string, string>; metodo?: string } = {}) {
  return new Request(SITE_TESTE + caminho, {
    method: opts.metodo || "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": opts.ip || "203.0.113.10", ...(opts.headers || {}) },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
}

/** Notificação do MP assinada como o Mercado Pago assina. */
export function notificacao(paymentId: string, opts: { segredo?: string; requestId?: string; ts?: string } = {}) {
  const ts = opts.ts || "1760400000";
  const requestId = opts.requestId || `req-${paymentId}`;
  const manifesto = `id:${paymentId};request-id:${requestId};ts:${ts};`;
  const v1 = createHmac("sha256", opts.segredo ?? SEGREDO_WEBHOOK_TESTE).update(manifesto).digest("hex");
  return new Request(`${SITE_TESTE}/api/webhooks/mercadopago?data.id=${paymentId}&type=payment`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": `ts=${ts},v1=${v1}`, "x-request-id": requestId },
    body: JSON.stringify({ action: "payment.updated", type: "payment", data: { id: paymentId } }),
  });
}

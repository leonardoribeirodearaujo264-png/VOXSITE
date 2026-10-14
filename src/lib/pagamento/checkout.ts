/** POST /api/checkout: cria (ou reusa) o pedido e a preferência do Checkout Pro. */
import { banco } from "./banco";
import { MOEDA, PRECO } from "./config";
import { emailDescartavel, emailValido, MSG, normalizarEmail } from "./http";
import { estourou } from "./limites";
import { licencaAtivaDoEmail } from "./licencas";
import { enviarChave } from "./email";
import { criarPreferencia } from "./mercadopago";

export type ResultadoCheckout = { http: number; corpo: Record<string, unknown> };

const REUSO_MS = 2 * 60 * 60 * 1000;

export async function checkout(entrada: { email: unknown; versao_app?: unknown }, ip: string): Promise<ResultadoCheckout> {
  const email = normalizarEmail(entrada.email);
  if (!emailValido(email)) return { http: 400, corpo: { ok: false, motivo: "email_invalido", mensagem: MSG.emailInvalido } };
  if (emailDescartavel(email)) return { http: 400, corpo: { ok: false, motivo: "email_descartavel", mensagem: MSG.emailDescartavel } };
  const versao = typeof entrada.versao_app === "string" ? entrada.versao_app.slice(0, 40) : null;

  const db = await banco();
  const passou = await estourou(db, [
    { escopo: "checkout:ip", id: ip, porHora: 5, porDia: 20 },
    { escopo: "checkout:email", id: email, porHora: 5, porDia: 20 },
  ]);
  if (passou) return { http: 429, corpo: { ok: false, motivo: "limite", mensagem: MSG.limite } };

  // já comprou: não cobra de novo, reenvia a mesma chave
  const lic = await licencaAtivaDoEmail(db, email);
  if (lic) {
    await enviarChave(lic.email, lic.chave);
    return { http: 200, corpo: { ok: false, motivo: "ja_comprou", mensagem: MSG.jaComprou } };
  }

  // pedido aberto do mesmo e-mail nas últimas 2 h: reusa (evita pagar duas vezes)
  const aberto = await db.query<{ checkout_url: string }>(
    `SELECT checkout_url FROM pedidos
     WHERE email = $1 AND status IN ('criado','pendente') AND checkout_url IS NOT NULL AND criado_em > $2
     ORDER BY criado_em DESC LIMIT 1`,
    [email, new Date(Date.now() - REUSO_MS).toISOString()],
  );
  if (aberto[0]) return { http: 200, corpo: { ok: true, url: aberto[0].checkout_url } };

  const novo = await db.query<{ id: string }>(
    `INSERT INTO pedidos (email, status, valor, moeda, versao_app, ip) VALUES ($1, 'criado', $2, $3, $4, $5) RETURNING id`,
    [email, PRECO, MOEDA, versao, ip],
  );
  const pedidoId = novo[0].id;
  const pref = await criarPreferencia({ id: pedidoId, email });
  await db.query(`UPDATE pedidos SET preference_id = $2, checkout_url = $3, atualizado_em = now() WHERE id = $1`, [
    pedidoId,
    pref.id,
    pref.url,
  ]);
  return { http: 200, corpo: { ok: true, url: pref.url } };
}

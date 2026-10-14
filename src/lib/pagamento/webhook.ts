/**
 * Processa um pagamento do Mercado Pago a partir da consulta OFICIAL
 * (nunca do corpo da notificação). Idempotente por `payment:${id}:${status}`.
 * Usado pelo webhook e pela página /compra/sucesso.
 */
import { banco, type Executor } from "./banco";
import { enviarChave } from "./email";
import { emitirLicenca } from "./licencas";
import { buscarPagamento, valorConfere, type Pagamento } from "./mercadopago";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Pedido = { id: string; email: string; status: string };

export type ResultadoProcessar =
  | "ja_processado"
  | "aprovado"
  | "pendente"
  | "recusado"
  | "cancelado"
  | "estornado"
  | "sem_mudanca"
  | "pedido_inexistente"
  | "valor_divergente";

/** Estados finais que um aviso atrasado de "pendente" não pode desfazer. */
const NAO_REBAIXA = ["aprovado", "estornado"];

async function registrar(tx: Executor, chave: string, paymentId: string, resultado: string): Promise<boolean> {
  const r = await tx.query(
    `INSERT INTO webhook_eventos (chave, payment_id, resultado) VALUES ($1, $2, $3)
     ON CONFLICT (chave) DO NOTHING RETURNING chave`,
    [chave, paymentId, resultado],
  );
  return r.length > 0;
}

/**
 * Manda a chave do pedido aprovado UMA vez: marca email_enviado_em antes
 * (atômico); se o envio falhar, desmarca e a falha sobe (500: o MP repete).
 */
export async function garantirEmailDoPedido(pedidoId: string): Promise<void> {
  const db = await banco();
  const r = await db.query<{ email: string }>(
    `UPDATE pedidos SET email_enviado_em = now()
     WHERE id = $1 AND status = 'aprovado' AND email_enviado_em IS NULL RETURNING email`,
    [pedidoId],
  );
  if (!r[0]) return;
  try {
    const l = await db.query<{ email: string; chave: string }>(
      `SELECT email, chave FROM licencas WHERE email = $1 AND revogada = false`,
      [r[0].email],
    );
    if (l[0]) await enviarChave(l[0].email, l[0].chave);
  } catch (e) {
    await db.query(`UPDATE pedidos SET email_enviado_em = NULL WHERE id = $1`, [pedidoId]);
    throw e;
  }
}

export async function processarPagamento(paymentId: string): Promise<ResultadoProcessar> {
  const db = await banco();
  const pg: Pagamento = await buscarPagamento(paymentId);
  const chaveEvento = `payment:${pg.id}:${pg.status}`;

  const ja = await db.query<{ resultado: string }>(`SELECT resultado FROM webhook_eventos WHERE chave = $1`, [chaveEvento]);
  if (ja[0]) {
    // já processado: só completa o e-mail se uma tentativa anterior falhou nele
    if (pg.status === "approved" && pg.external_reference && UUID.test(pg.external_reference)) {
      await garantirEmailDoPedido(pg.external_reference);
    }
    return "ja_processado";
  }

  const ref = pg.external_reference && UUID.test(pg.external_reference) ? pg.external_reference : null;
  const pedido = ref ? (await db.query<Pedido>(`SELECT id, email, status FROM pedidos WHERE id = $1`, [ref]))[0] : undefined;
  if (!pedido) {
    await registrar(db, chaveEvento, pg.id, "pedido_inexistente");
    return "pedido_inexistente";
  }

  if (pg.status === "approved") {
    if (!valorConfere(pg)) {
      await registrar(db, chaveEvento, pg.id, "valor_divergente");
      console.error(`[pagamento] valor divergente no pagamento ${pg.id}: ${pg.transaction_amount} ${pg.currency_id}`);
      return "valor_divergente";
    }
    const feito = await db.transacao(async (tx) => {
      if (!(await registrar(tx, chaveEvento, pg.id, "aprovado"))) return false;
      await tx.query(
        `UPDATE pedidos SET status = 'aprovado', payment_id = $2, atualizado_em = now() WHERE id = $1`,
        [pedido.id, pg.id],
      );
      await emitirLicenca(tx, pedido.email, "pagamento", pedido.id);
      return true;
    });
    await garantirEmailDoPedido(pedido.id);
    return feito ? "aprovado" : "ja_processado";
  }

  let novo: string | null = null;
  let resultado: ResultadoProcessar = "sem_mudanca";
  switch (pg.status) {
    case "pending":
    case "in_process":
    case "authorized":
      novo = "pendente";
      resultado = "pendente";
      break;
    case "rejected":
      novo = "recusado";
      resultado = "recusado";
      break;
    case "cancelled":
      novo = "cancelado";
      resultado = "cancelado";
      break;
    case "refunded":
    case "charged_back":
      novo = "estornado";
      resultado = "estornado";
      break;
  }

  const feito = await db.transacao(async (tx) => {
    if (!(await registrar(tx, chaveEvento, pg.id, resultado))) return false;
    if (novo === "estornado") {
      await tx.query(`UPDATE pedidos SET status = 'estornado', payment_id = $2, atualizado_em = now() WHERE id = $1`, [
        pedido.id,
        pg.id,
      ]);
      await tx.query(`UPDATE licencas SET revogada = true WHERE pedido_id = $1`, [pedido.id]);
    } else if (novo) {
      await tx.query(
        `UPDATE pedidos SET status = $2, payment_id = COALESCE(payment_id, $3), atualizado_em = now()
         WHERE id = $1 AND status <> ALL($4::text[])`,
        [pedido.id, novo, pg.id, NAO_REBAIXA],
      );
    }
    return true;
  });
  return feito ? resultado : "ja_processado";
}

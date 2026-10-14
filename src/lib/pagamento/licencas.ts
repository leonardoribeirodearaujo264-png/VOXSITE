/** Licenças: emitir, reenviar e validar (contrato do app). */
import { banco, type Executor } from "./banco";
import { conferirChave, gerarChave, normalizarChave } from "./chave";
import { cfg } from "./config";
import { enviarChave } from "./email";

export type LicencaLinha = {
  id: string;
  email: string;
  chave: string;
  pedido_id: string | null;
  maquinas: number;
  revogada: boolean;
  origem: string;
};

/** Mesmo e-mail = mesma chave (permanente, m = MAQUINAS_POR_LICENCA). */
export function chaveDoEmail(email: string): { chave: string; maquinas: number } {
  const maquinas = cfg.maquinasPorLicenca;
  return { chave: gerarChave({ c: email, m: maquinas, v: null }, cfg.segredoLicenca), maquinas };
}

export async function licencaAtivaDoEmail(db: Executor, email: string): Promise<LicencaLinha | null> {
  const r = await db.query<LicencaLinha>(`SELECT * FROM licencas WHERE email = $1 AND revogada = false`, [email]);
  return r[0] ?? null;
}

/**
 * Cria a licença UMA vez. Se o e-mail já tinha licença revogada e pagou de
 * novo, reativa a mesma chave. Devolve a licença do e-mail.
 */
export async function emitirLicenca(
  db: Executor,
  email: string,
  origem: "pagamento" | "gratis" | "admin",
  pedidoId: string | null,
): Promise<LicencaLinha> {
  const { chave, maquinas } = chaveDoEmail(email);
  await db.query(
    `INSERT INTO licencas (email, chave, pedido_id, maquinas, origem)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE
       SET revogada = false, pedido_id = EXCLUDED.pedido_id
       WHERE licencas.revogada = true AND EXCLUDED.pedido_id IS NOT NULL`,
    [email, chave, pedidoId, maquinas, origem],
  );
  const r = await db.query<LicencaLinha>(`SELECT * FROM licencas WHERE email = $1`, [email]);
  return r[0];
}

/** Reenvia a MESMA chave guardada. false = não há licença ativa. */
export async function reenviarChave(db: Executor, email: string): Promise<boolean> {
  const l = await licencaAtivaDoEmail(db, email);
  if (!l) return false;
  await enviarChave(l.email, l.chave);
  return true;
}

export const MENSAGENS_VALIDAR = {
  revogada: "Essa chave foi revogada.",
  limite_maquinas: "Essa chave já está em uso no número máximo de computadores.",
  inexistente: "Essa chave não foi encontrada entre as compras do VOX. Confira se copiou a chave inteira.",
  chave_invalida: "Essa chave não é válida. Confira se copiou a chave inteira.",
} as const;

export type ResultadoValidar =
  | { ok: true; status: "ativa"; maquinas: number; usadas: number }
  | { ok: false; motivo: keyof typeof MENSAGENS_VALIDAR; mensagem: string };

function recusa(motivo: keyof typeof MENSAGENS_VALIDAR): ResultadoValidar {
  return { ok: false, motivo, mensagem: MENSAGENS_VALIDAR[motivo] };
}

/** Confere a assinatura, a existência, a revogação e o limite de máquinas. */
export async function validarLicenca(chaveBruta: unknown, maquina: string, versaoApp: string | null): Promise<ResultadoValidar> {
  const chave = normalizarChave(chaveBruta);
  if (!conferirChave(chave, cfg.segredoLicenca)) return recusa("chave_invalida");
  const db = await banco();
  return db.transacao(async (tx) => {
    // FOR UPDATE: duas máquinas ao mesmo tempo não passam do limite
    const r = await tx.query<LicencaLinha>(`SELECT * FROM licencas WHERE chave = $1 FOR UPDATE`, [chave]);
    const l = r[0];
    if (!l) return recusa("inexistente");
    if (l.revogada) return recusa("revogada");
    const ja = await tx.query(
      `UPDATE licenca_maquinas SET ultima_vez = now(), versao_app = $3
       WHERE licenca_id = $1 AND maquina = $2 RETURNING maquina`,
      [l.id, maquina, versaoApp],
    );
    const contagem = await tx.query<{ n: number }>(`SELECT count(*)::int AS n FROM licenca_maquinas WHERE licenca_id = $1`, [l.id]);
    let usadas = Number(contagem[0]?.n ?? 0);
    if (!ja.length) {
      if (usadas >= l.maquinas) return recusa("limite_maquinas");
      await tx.query(
        `INSERT INTO licenca_maquinas (licenca_id, maquina, versao_app) VALUES ($1, $2, $3)
         ON CONFLICT (licenca_id, maquina) DO UPDATE SET ultima_vez = now()`,
        [l.id, maquina, versaoApp],
      );
      usadas += 1;
    }
    return { ok: true, status: "ativa", maquinas: l.maquinas, usadas };
  });
}

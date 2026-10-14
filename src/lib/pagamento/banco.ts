/**
 * Banco Postgres. Produção: Neon (@neondatabase/serverless, DATABASE_URL).
 * Testes: PGlite em memória, com o MESMO SQL (definirBanco).
 * Sempre consulta parametrizada. A migração é idempotente e roda na
 * primeira chamada de cada processo.
 */

export type Linha = Record<string, unknown>;

export interface Executor {
  query<T extends Linha = Linha>(sql: string, params?: unknown[]): Promise<T[]>;
}

export interface Banco extends Executor {
  transacao<T>(fn: (tx: Executor) => Promise<T>): Promise<T>;
}

export class BancoIndisponivel extends Error {
  constructor() {
    super("DATABASE_URL não configurado");
  }
}

export const MIGRACAO = `
CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'criado'
    CHECK (status IN ('criado','pendente','aprovado','recusado','cancelado','estornado')),
  preference_id text,
  checkout_url text,
  payment_id text UNIQUE,
  valor numeric(10,2) NOT NULL,
  moeda text NOT NULL,
  versao_app text,
  ip text,
  email_enviado_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pedidos_email_idx ON pedidos (email, criado_em DESC);

CREATE TABLE IF NOT EXISTS licencas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  chave text NOT NULL UNIQUE,
  pedido_id uuid UNIQUE REFERENCES pedidos(id),
  maquinas integer NOT NULL,
  revogada boolean NOT NULL DEFAULT false,
  origem text NOT NULL CHECK (origem IN ('pagamento','gratis','admin')),
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS licenca_maquinas (
  licenca_id uuid NOT NULL REFERENCES licencas(id) ON DELETE CASCADE,
  maquina text NOT NULL,
  primeira_vez timestamptz NOT NULL DEFAULT now(),
  ultima_vez timestamptz NOT NULL DEFAULT now(),
  versao_app text,
  UNIQUE (licenca_id, maquina)
);

CREATE TABLE IF NOT EXISTS webhook_eventos (
  chave text PRIMARY KEY,
  payment_id text NOT NULL,
  recebido_em timestamptz NOT NULL DEFAULT now(),
  resultado text
);

CREATE TABLE IF NOT EXISTS limites (
  chave text NOT NULL,
  janela_inicio timestamptz NOT NULL,
  contagem integer NOT NULL DEFAULT 0,
  PRIMARY KEY (chave, janela_inicio)
);
`;

let atual: Banco | null = null;
let migrado: Promise<void> | null = null;

/** Para os testes: troca o banco (PGlite) e força a migração de novo. */
export function definirBanco(b: Banco | null) {
  atual = b;
  migrado = null;
}

async function criarNeon(url: string): Promise<Banco> {
  const { Pool } = await import("@neondatabase/serverless");
  const pool = new Pool({ connectionString: url });
  return {
    async query<T extends Linha>(sql: string, params: unknown[] = []) {
      const r = await pool.query(sql, params);
      return r.rows as T[];
    },
    async transacao<T>(fn: (tx: Executor) => Promise<T>) {
      const cliente = await pool.connect();
      try {
        await cliente.query("BEGIN");
        const tx: Executor = {
          async query<R extends Linha>(sql: string, params: unknown[] = []) {
            const r = await cliente.query(sql, params);
            return r.rows as R[];
          },
        };
        const v = await fn(tx);
        await cliente.query("COMMIT");
        return v;
      } catch (e) {
        await cliente.query("ROLLBACK").catch(() => {});
        throw e;
      } finally {
        cliente.release();
      }
    },
  };
}

/** O banco pronto (migrado). Sem DATABASE_URL: BancoIndisponivel. */
export async function banco(): Promise<Banco> {
  if (!atual) {
    const url = (process.env.DATABASE_URL ?? "").trim();
    if (!url) throw new BancoIndisponivel();
    atual = await criarNeon(url);
  }
  const b = atual;
  if (!migrado) {
    migrado = (async () => {
      // uma instrução por vez: o driver HTTP/WS não aceita várias com parâmetros
      for (const sql of MIGRACAO.split(";").map((s) => s.trim()).filter(Boolean)) {
        await b.query(sql);
      }
    })().catch((e) => {
      migrado = null;
      throw e;
    });
  }
  await migrado;
  return b;
}

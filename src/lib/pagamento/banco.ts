/**
 * Banco Postgres. Produção: Supabase (ou qualquer Postgres) pelo `pg`, com
 * DATABASE_URL ou POSTGRES_URL (o nome que a integração Supabase da Vercel cria).
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
    super("DATABASE_URL/POSTGRES_URL não configurado");
  }
}

// ATENÇÃO: a migração é separada por ";" (uma instrução por vez). Nada de
// ";" dentro de comentário ou texto aqui.
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

-- Supabase publica o esquema public numa API com a chave PÚBLICA (anon).
-- RLS ligado e NENHUMA política: essa API não lê nem grava nada aqui, só o
-- servidor do site (dono das tabelas, conexão direta) acessa os dados.
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE licencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenca_maquinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE limites ENABLE ROW LEVEL SECURITY;
`;

let atual: Banco | null = null;
let migrado: Promise<void> | null = null;

/** Para os testes: troca o banco (PGlite) e força a migração de novo. */
export function definirBanco(b: Banco | null) {
  atual = b;
  migrado = null;
}

/** Supabase manda `sslmode=require` na URL; o `pg` novo trata isso como
 *  verificação completa do certificado e recusa a cadeia do pooler. A
 *  conexão continua cifrada (TLS); só a verificação da cadeia fica a cargo
 *  do provedor, como na documentação do Supabase para o node-postgres. */
function semSslmode(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("sslmode");
    u.searchParams.delete("supa");
    return u.toString();
  } catch {
    return url;
  }
}

async function criarPostgres(url: string): Promise<Banco> {
  const { Pool } = await import("pg");
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  // função serverless: poucas conexões por instância (o pooler do Supabase
  // segura o resto)
  const pool = new Pool({
    connectionString: semSslmode(url),
    ssl: local ? undefined : { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 10_000,
  });
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

/** O banco pronto (migrado). Sem DATABASE_URL/POSTGRES_URL: BancoIndisponivel. */
export async function banco(): Promise<Banco> {
  if (!atual) {
    const url = (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
    if (!url) throw new BancoIndisponivel();
    atual = await criarPostgres(url);
  }
  const b = atual;
  if (!migrado) {
    migrado = (async () => {
      // uma instrução por vez (pooler em modo transação)
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

/**
 * Admin: senha em ADMIN_SENHA (sem ela, admin desligado). Sessão em cookie
 * httpOnly assinado com HMAC da própria senha, SameSite=Strict, 12 h.
 * Tudo comparado em tempo constante.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { banco } from "./banco";
import { cfg } from "./config";
import { enviarChave } from "./email";

export const COOKIE_ADMIN = "vox_admin";
export const DURACAO_S = 12 * 60 * 60;

function iguais(a: string, b: string): boolean {
  // hash dos dois lados: mesmo tamanho, comparação em tempo constante
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

function assinar(exp: number, senha: string): string {
  return createHmac("sha256", senha).update(`vox-admin:${exp}`).digest("hex");
}

export function adminLigado(): boolean {
  return cfg.adminSenha.length > 0;
}

export function senhaConfere(tentativa: unknown): boolean {
  const senha = cfg.adminSenha;
  if (!senha || typeof tentativa !== "string" || tentativa.length > 500) return false;
  return iguais(tentativa, senha);
}

export function criarSessao(agora = Date.now()): string {
  const exp = Math.floor(agora / 1000) + DURACAO_S;
  return `${exp}.${assinar(exp, cfg.adminSenha)}`;
}

export function sessaoValida(valor: string | null | undefined, agora = Date.now()): boolean {
  const senha = cfg.adminSenha;
  if (!senha || !valor) return false;
  const m = /^(\d{1,12})\.([0-9a-f]{64})$/.exec(valor);
  if (!m) return false;
  const exp = Number(m[1]);
  if (exp * 1000 < agora) return false;
  return iguais(m[2], assinar(exp, senha));
}

export function cookieDe(req: Request, nome: string): string | null {
  const bruto = req.headers.get("cookie") || "";
  for (const parte of bruto.split(";")) {
    const i = parte.indexOf("=");
    if (i > 0 && parte.slice(0, i).trim() === nome) return decodeURIComponent(parte.slice(i + 1).trim());
  }
  return null;
}

export function autorizado(req: Request): boolean {
  return adminLigado() && sessaoValida(cookieDe(req, COOKIE_ADMIN));
}

export function cabecalhoCookie(valor: string, maxAge: number): string {
  const seguro = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_ADMIN}=${valor}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${seguro}`;
}

export function mascarar(chave: string): string {
  return chave.length <= 12 ? "••••" : `${chave.slice(0, 8)}••••${chave.slice(-4)}`;
}

export async function dadosAdmin() {
  const db = await banco();
  const licencas = await db.query<{
    id: string;
    email: string;
    chave: string;
    maquinas: number;
    usadas: number;
    revogada: boolean;
    origem: string;
    criado_em: string;
  }>(
    `SELECT l.id, l.email, l.chave, l.maquinas, l.revogada, l.origem, l.criado_em,
            (SELECT count(*)::int FROM licenca_maquinas m WHERE m.licenca_id = l.id) AS usadas
     FROM licencas l ORDER BY l.criado_em DESC LIMIT 500`,
  );
  const pedidos = await db.query(
    `SELECT id, email, status, payment_id, valor, moeda, criado_em FROM pedidos ORDER BY criado_em DESC LIMIT 500`,
  );
  return {
    licencas: licencas.map(({ chave, ...l }) => ({ ...l, chave_mascarada: mascarar(chave) })),
    pedidos,
  };
}

export type AcaoAdmin = "mostrar" | "reenviar" | "revogar" | "reativar" | "liberar";

export async function executarAcao(acao: AcaoAdmin, licencaId: string): Promise<Record<string, unknown>> {
  const db = await banco();
  const r = await db.query<{ id: string; email: string; chave: string }>(`SELECT id, email, chave FROM licencas WHERE id = $1`, [
    licencaId,
  ]);
  const l = r[0];
  if (!l) return { ok: false, mensagem: "Licença não encontrada." };
  switch (acao) {
    case "mostrar":
      return { ok: true, chave: l.chave };
    case "reenviar":
      await enviarChave(l.email, l.chave);
      return { ok: true, mensagem: `Chave reenviada para ${l.email}.` };
    case "revogar":
      await db.query(`UPDATE licencas SET revogada = true WHERE id = $1`, [l.id]);
      return { ok: true, mensagem: "Licença revogada." };
    case "reativar":
      await db.query(`UPDATE licencas SET revogada = false WHERE id = $1`, [l.id]);
      return { ok: true, mensagem: "Licença reativada." };
    case "liberar":
      await db.query(`DELETE FROM licenca_maquinas WHERE licenca_id = $1`, [l.id]);
      return { ok: true, mensagem: "Máquinas liberadas." };
  }
}

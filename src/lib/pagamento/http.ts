/** Utilidades das rotas: resposta JSON sem cache, IP, corpo e e-mail. */

export const SEM_CACHE = { "Cache-Control": "no-store, max-age=0" } as const;

export function json(corpo: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return Response.json(corpo, { status, headers: { ...SEM_CACHE, ...extra } });
}

/** IP de quem chamou (Vercel põe o original no começo do x-forwarded-for). */
export function ipDe(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  const ip = (xff ? xff.split(",")[0] : req.headers.get("x-real-ip") || "").trim();
  return ip.slice(0, 64) || "desconhecido";
}

/** Lê o JSON do corpo (até 16 KB). Corpo ruim -> null. */
export async function lerJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const texto = await req.text();
    if (texto.length > 16_384) return null;
    const d = JSON.parse(texto || "{}");
    return d && typeof d === "object" && !Array.isArray(d) ? d : null;
  } catch {
    return null;
  }
}

const EMAIL = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function normalizarEmail(v: unknown): string {
  return String(v ?? "").trim().toLowerCase();
}

export function emailValido(email: string): boolean {
  if (!email || email.length > 254) return false;
  const [local, dominio] = email.split("@");
  if (!local || !dominio || local.length > 64 || email.split("@").length !== 2) return false;
  if (!dominio.includes(".") || /\.\./.test(email)) return false;
  return EMAIL.test(email);
}

/** Domínios de e-mail descartável conhecidos (lista curta e conservadora). */
export const DESCARTAVEIS = new Set([
  "10minutemail.com", "10minutemail.net", "20minutemail.com", "33mail.com", "anonbox.net",
  "burnermail.io", "discard.email", "dispostable.com", "emailondeck.com", "fakeinbox.com",
  "fakemail.net", "getairmail.com", "getnada.com", "guerrillamail.biz", "guerrillamail.com",
  "guerrillamail.de", "guerrillamail.info", "guerrillamail.net", "guerrillamail.org",
  "guerrillamailblock.com", "harakirimail.com", "inboxbear.com", "mail.tm", "mailcatch.com",
  "maildrop.cc", "mailinator.com", "mailinator.net", "mailnesia.com", "mailpoof.com",
  "mintemail.com", "moakt.com", "mohmal.com", "mytemp.email", "nada.email", "sharklasers.com",
  "spam4.me", "spambox.us", "spamgourmet.com", "temp-mail.io", "temp-mail.org", "tempail.com",
  "tempmail.com", "tempmail.dev", "tempmail.net", "tempmailo.com", "tempr.email",
  "throwawaymail.com", "trashmail.com", "trashmail.de", "trashmail.net", "yopmail.com",
  "yopmail.fr", "yopmail.net", "emailfake.com", "fakemailgenerator.com", "dropmail.me",
  "1secmail.com", "1secmail.net", "1secmail.org", "linshiyouxiang.net", "tmpmail.org",
  "tmpmail.net", "minuteinbox.com", "luxusmail.org", "mailsac.com", "inboxkitten.com",
]);

export function emailDescartavel(email: string): boolean {
  const dominio = email.split("@")[1] ?? "";
  const partes = dominio.split(".");
  // confere o domínio e os "pais" (sub.mailinator.com cai em mailinator.com)
  for (let i = 0; i < partes.length - 1; i++) {
    if (DESCARTAVEIS.has(partes.slice(i).join("."))) return true;
  }
  return false;
}

export const MSG = {
  emailInvalido: "E-mail inválido. Confira e tente de novo.",
  emailDescartavel: "Use um e-mail que você acessa sempre: a chave chega nele.",
  limite: "Muitos pedidos, tente daqui a pouco.",
  jaComprou: "Você já comprou: reenviamos sua chave para o seu e-mail.",
  indisponivel: "O pagamento está indisponível agora. Tente de novo em alguns minutos.",
} as const;

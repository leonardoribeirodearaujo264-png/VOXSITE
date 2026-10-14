/**
 * Chave de licença do VOX, igual à conferência offline do app:
 *   "VOX-" + b32(dados) + "-" + b32(HMAC_SHA256(segredo, dados)[:10])
 * dados = JSON compacto com chaves ordenadas {"c","m","v"} em UTF-8
 * (o mesmo que Python json.dumps(..., separators=(",",":"),
 * ensure_ascii=False, sort_keys=True)). b32 = base32 RFC 4648 maiúsculo,
 * sem "=". O segredo só existe em VOX_SEGREDO_LICENCA.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export type DadosLicenca = { c: string; m: number; v: string | null };

export function base32(bytes: Uint8Array): string {
  let saida = "";
  let buffer = 0;
  let bits = 0;
  for (const b of bytes) {
    buffer = (buffer << 8) | b;
    bits += 8;
    while (bits >= 5) {
      saida += ALFABETO[(buffer >>> (bits - 5)) & 31];
      bits -= 5;
    }
    buffer &= (1 << bits) - 1;
  }
  if (bits > 0) saida += ALFABETO[(buffer << (5 - bits)) & 31];
  return saida;
}

export function deBase32(texto: string): Uint8Array | null {
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of texto) {
    const v = ALFABETO.indexOf(ch);
    if (v < 0) return null;
    buffer = (buffer << 5) | v;
    bits += 5;
    if (bits >= 8) {
      bytes.push((buffer >>> (bits - 8)) & 255);
      bits -= 8;
    }
    buffer &= (1 << bits) - 1;
  }
  return Uint8Array.from(bytes);
}

/** JSON compacto com as chaves em ordem (c, m, v). */
export function serializar(d: DadosLicenca): string {
  return JSON.stringify({ c: d.c, m: d.m, v: d.v });
}

function assinatura(segredo: string, dados: Uint8Array): Buffer {
  return createHmac("sha256", Buffer.from(segredo, "utf8")).update(dados).digest().subarray(0, 10);
}

export function gerarChave(d: DadosLicenca, segredo: string): string {
  if (!segredo) throw new Error("VOX_SEGREDO_LICENCA não configurado");
  const dados = Buffer.from(serializar(d), "utf8");
  return `VOX-${base32(dados)}-${base32(assinatura(segredo, dados))}`;
}

/** trim, maiúsculas e sem espaços (o app faz o mesmo antes de mandar). */
export function normalizarChave(chave: unknown): string {
  return String(chave ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/** Confere a assinatura em tempo constante. Devolve os dados ou null. */
export function conferirChave(chave: unknown, segredo: string): DadosLicenca | null {
  if (!segredo) throw new Error("VOX_SEGREDO_LICENCA não configurado");
  const k = normalizarChave(chave);
  if (k.length > 600) return null;
  const m = /^VOX-([A-Z2-7]+)-([A-Z2-7]+)$/.exec(k);
  if (!m) return null;
  const dados = deBase32(m[1]);
  const assin = deBase32(m[2]);
  if (!dados || !assin || assin.length !== 10) return null;
  const esperado = assinatura(segredo, dados);
  if (!timingSafeEqual(esperado, Buffer.from(assin))) return null;
  try {
    const d = JSON.parse(Buffer.from(dados).toString("utf8"));
    if (typeof d?.c !== "string" || typeof d?.m !== "number") return null;
    return { c: d.c, m: d.m, v: typeof d.v === "string" ? d.v : null };
  } catch {
    return null;
  }
}

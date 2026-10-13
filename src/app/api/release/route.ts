import { buscarRelease } from "@/lib/release";
import { RELEASES } from "@/lib/site";

/** GET /api/release: a última versão, lida no servidor com cache de 10 min.
 *  Nunca devolve erro: se o GitHub falhar, `ok: false` e o link da página
 *  de releases, para quem chamar ainda ter para onde mandar a pessoa. */
export async function GET() {
  const r = await buscarRelease();
  if (r.ok) {
    return Response.json({ ok: true, ...r.release, fallbackUrl: RELEASES.ultima });
  }
  return Response.json({ ok: false, motivo: r.motivo, fallbackUrl: RELEASES.ultima });
}

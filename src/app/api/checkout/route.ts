import { checkout } from "@/lib/pagamento/checkout";
import { ipDe, json, lerJson, MSG } from "@/lib/pagamento/http";

// runtime Node.js: o padrão (e obrigatório com cacheComponents)

/** POST /api/checkout {email, versao_app?} -> {ok:true, url} | {ok:false, motivo, mensagem}. */
export async function POST(req: Request) {
  const corpo = await lerJson(req);
  if (!corpo) return json({ ok: false, motivo: "email_invalido", mensagem: MSG.emailInvalido }, 400);
  try {
    const r = await checkout({ email: corpo.email, versao_app: corpo.versao_app }, ipDe(req));
    return json(r.corpo, r.http);
  } catch (e) {
    console.error("[checkout]", e instanceof Error ? e.message : e);
    return json({ ok: false, motivo: "indisponivel", mensagem: MSG.indisponivel }, 503);
  }
}

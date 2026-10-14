import { banco } from "@/lib/pagamento/banco";
import { cfg } from "@/lib/pagamento/config";
import { enviarChave } from "@/lib/pagamento/email";
import { emailDescartavel, emailValido, ipDe, json, lerJson, MSG, normalizarEmail } from "@/lib/pagamento/http";
import { estourou } from "@/lib/pagamento/limites";
import { emitirLicenca } from "@/lib/pagamento/licencas";

// runtime Node.js: o padrão (e obrigatório com cacheComponents)

/**
 * POST /api/licenca {email}: licença grátis. Só funciona com
 * EXIGIR_PAGAMENTO=false (o padrão é exigir pagamento).
 */
export async function POST(req: Request) {
  if (cfg.exigirPagamento) {
    return json({ ok: false, motivo: "pagamento_necessario", url: "/comprar" }, 402);
  }
  const corpo = await lerJson(req);
  const email = normalizarEmail(corpo?.email);
  if (!emailValido(email) || emailDescartavel(email)) {
    return json({ ok: false, motivo: "email_invalido", mensagem: MSG.emailInvalido }, 400);
  }
  try {
    const db = await banco();
    const passou = await estourou(db, [
      { escopo: "gratis:ip", id: ipDe(req), porHora: 5, porDia: 20 },
      { escopo: "gratis:email", id: email, porHora: 3, porDia: 10 },
    ]);
    if (passou) return json({ ok: false, motivo: "limite", mensagem: MSG.limite }, 429);
    const l = await emitirLicenca(db, email, "gratis", null);
    if (!l.revogada) await enviarChave(l.email, l.chave);
    return json({ ok: true, mensagem: "Enviamos a chave para o seu e-mail." });
  } catch (e) {
    console.error("[licenca]", e instanceof Error ? e.message : e);
    return json({ ok: false, motivo: "indisponivel", mensagem: MSG.indisponivel }, 503);
  }
}

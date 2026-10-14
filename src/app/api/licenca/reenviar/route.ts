import { banco } from "@/lib/pagamento/banco";
import { emailValido, ipDe, json, lerJson, MSG, normalizarEmail } from "@/lib/pagamento/http";
import { estourou } from "@/lib/pagamento/limites";
import { reenviarChave } from "@/lib/pagamento/licencas";

// runtime Node.js: o padrão (e obrigatório com cacheComponents)

/**
 * POST /api/licenca/reenviar {email}. Resposta SEMPRE genérica (não diz se
 * o e-mail comprou). Se comprou, reenvia a MESMA chave por e-mail.
 * 400 e-mail inválido, 429 limite.
 */
export async function POST(req: Request) {
  const corpo = await lerJson(req);
  const email = normalizarEmail(corpo?.email);
  if (!emailValido(email)) return json({ ok: false, mensagem: MSG.emailInvalido }, 400);
  try {
    const db = await banco();
    const passou = await estourou(db, [
      { escopo: "reenviar:ip", id: ipDe(req), porHora: 5, porDia: 20 },
      { escopo: "reenviar:email", id: email, porHora: 3, porDia: 10 },
    ]);
    if (passou) return json({ ok: false, mensagem: MSG.limite }, 429);
    try {
      await reenviarChave(db, email);
    } catch (e) {
      // falha no envio não muda a resposta: ela não pode revelar se o e-mail comprou
      console.error("[licenca/reenviar] envio", e instanceof Error ? e.message : e);
    }
  } catch (e) {
    console.error("[licenca/reenviar]", e instanceof Error ? e.message : e);
    return json({ ok: false, mensagem: "Não conseguimos falar com o servidor agora." }, 503);
  }
  return json({ ok: true, mensagem: "Se esse e-mail comprou o VOX, enviamos a chave. Olhe também o spam." });
}

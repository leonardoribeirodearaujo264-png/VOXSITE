import { BancoIndisponivel, banco } from "@/lib/pagamento/banco";
import { ipDe, json, lerJson } from "@/lib/pagamento/http";
import { estourou } from "@/lib/pagamento/limites";
import { MENSAGENS_VALIDAR, validarLicenca } from "@/lib/pagamento/licencas";

// runtime Node.js: o padrão (e obrigatório com cacheComponents)

/**
 * POST /api/licenca/validar {chave, maquina, versao_app}, usado pelo app.
 * 200 {ok:true, status:"ativa", maquinas, usadas} | 200 {ok:false, motivo, mensagem}.
 * Falha nossa -> 5xx (o app trata como sem internet e nunca desativa).
 */
export async function POST(req: Request) {
  const corpo = await lerJson(req);
  const maquina = typeof corpo?.maquina === "string" ? corpo.maquina.trim().slice(0, 200) : "";
  if (!corpo || typeof corpo.chave !== "string" || !maquina) {
    return json({ ok: false, motivo: "chave_invalida", mensagem: MENSAGENS_VALIDAR.chave_invalida }, 400);
  }
  const versao = typeof corpo.versao_app === "string" ? corpo.versao_app.slice(0, 40) : null;
  try {
    const db = await banco();
    if (await estourou(db, [{ escopo: "validar:ip", id: ipDe(req), porHora: 60, porDia: 500 }])) {
      return json({ erro: "muitos_pedidos" }, 429);
    }
    return json(await validarLicenca(corpo.chave, maquina, versao));
  } catch (e) {
    console.error("[licenca/validar]", e instanceof Error ? e.message : e);
    return json({ erro: "indisponivel" }, e instanceof BancoIndisponivel ? 503 : 500);
  }
}

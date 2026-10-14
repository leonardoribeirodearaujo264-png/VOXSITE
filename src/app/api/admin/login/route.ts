import { adminLigado, cabecalhoCookie, criarSessao, DURACAO_S, senhaConfere } from "@/lib/pagamento/admin";
import { banco } from "@/lib/pagamento/banco";
import { ipDe, json, lerJson } from "@/lib/pagamento/http";
import { estourou } from "@/lib/pagamento/limites";

// runtime Node.js: o padrão (e obrigatório com cacheComponents)

/** POST /api/admin/login {senha}: abre a sessão (cookie httpOnly, 12 h). */
export async function POST(req: Request) {
  if (!adminLigado()) return json({ ok: false, mensagem: "Admin desligado." }, 404);
  try {
    const db = await banco();
    if (await estourou(db, [{ escopo: "admin:ip", id: ipDe(req), porHora: 10, porDia: 30 }])) {
      return json({ ok: false, mensagem: "Muitas tentativas. Tente mais tarde." }, 429);
    }
  } catch {
    // sem banco não há limite, mas a senha continua conferida
  }
  const corpo = await lerJson(req);
  if (!senhaConfere(corpo?.senha)) return json({ ok: false, mensagem: "Senha incorreta." }, 401);
  return json({ ok: true }, 200, { "Set-Cookie": cabecalhoCookie(criarSessao(), DURACAO_S) });
}

/** DELETE /api/admin/login: sai. */
export async function DELETE() {
  return json({ ok: true }, 200, { "Set-Cookie": cabecalhoCookie("", 0) });
}

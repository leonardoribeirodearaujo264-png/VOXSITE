import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { conferirChave, gerarChave } from "@/lib/pagamento/chave";
import { POST as checkoutPOST } from "@/app/api/checkout/route";
import { POST as webhookPOST } from "@/app/api/webhooks/mercadopago/route";
import { POST as validarPOST } from "@/app/api/licenca/validar/route";
import { POST as reenviarPOST } from "@/app/api/licenca/reenviar/route";
import { POST as gratisPOST } from "@/app/api/licenca/route";
import { POST as loginPOST } from "@/app/api/admin/login/route";
import { GET as dadosGET } from "@/app/api/admin/dados/route";
import { POST as acaoPOST } from "@/app/api/admin/acao/route";
import { ambienteDeTeste, bancoDeTeste, fetchFalso, notificacao, req, SEGREDO_VETORES } from "./apoio";

type CorpoPreferencia = {
  items: { unit_price: number }[];
  external_reference: string;
  payer: { email: string };
  notification_url: string;
  back_urls: Record<string, string>;
  auto_return: string;
  statement_descriptor: string;
  payment_methods: { installments: number };
};
type CorpoEmail = { to: string[]; subject: string; html: string; text: string };

let pg: PGlite;
let ff: ReturnType<typeof fetchFalso>;

beforeEach(async () => {
  ambienteDeTeste();
  pg = await bancoDeTeste();
  ff = fetchFalso();
  vi.stubGlobal("fetch", ff.f);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function comprar(email: string, ip = "203.0.113.10") {
  const r = await checkoutPOST(req("/api/checkout", { email }, { ip }));
  return { status: r.status, corpo: await r.json(), r };
}

async function pedidoDe(email: string) {
  return (await pg.query<{ id: string; status: string; payment_id: string | null }>(
    `SELECT id, status, payment_id FROM pedidos WHERE email = $1 ORDER BY criado_em DESC LIMIT 1`,
    [email],
  )).rows[0];
}

async function aprovar(email: string, paymentId = "1001", valor = 470, moeda = "BRL", status = "approved") {
  const p = await pedidoDe(email);
  ff.pagamentos.set(paymentId, { id: paymentId, status, transaction_amount: valor, currency_id: moeda, external_reference: p.id });
  const r = await webhookPOST(notificacao(paymentId));
  return { status: r.status, corpo: await r.json() };
}

async function licencas() {
  return (await pg.query<{ email: string; chave: string; revogada: boolean }>(`SELECT email, chave, revogada FROM licencas`)).rows;
}

describe("chave de licença", () => {
  const vetores: [string, number, string | null, string][] = [
    ["cliente@exemplo.com", 1, null, "VOX-PMRGGIR2EJRWY2LFNZ2GKQDFPBSW24DMN4XGG33NEIWCE3JCHIYSYITWEI5G45LMNR6Q-JD7DLVBQPJHYJY3W"],
    ["joao.silva@gmail.com", 2, null, "VOX-PMRGGIR2EJVG6YLPFZZWS3DWMFAGO3LBNFWC4Y3PNURCYITNEI5DELBCOYRDU3TVNRWH2-GKE2VANLNOVV7LA2"],
    ["ana@x.com.br", 1, "2027-01-31", "VOX-PMRGGIR2EJQW4YKAPAXGG33NFZRHEIRMEJWSEORRFQRHMIR2EIZDAMRXFUYDCLJTGERH2-PYSLMJXWQAMVSFK6"],
    ["maría.ñ@exemplo.com", 2, null, "VOX-PMRGGIR2EJWWC4WDVVQS5Q5RIBSXQZLNOBWG6LTDN5WSELBCNURDUMRMEJ3CEOTOOVWGY7I-U32QMECDWBUZZY5O"],
  ];
  it.each(vetores)("gera a chave igual à do app: %s", (c, m, v, esperado) => {
    expect(gerarChave({ c, m, v }, SEGREDO_VETORES)).toBe(esperado);
    expect(conferirChave(esperado, SEGREDO_VETORES)).toEqual({ c, m, v });
  });
  it("normaliza (minúsculas, espaços) e recusa assinatura errada", () => {
    const k = vetores[0][3];
    expect(conferirChave(`  ${k.toLowerCase().slice(0, 20)} ${k.toLowerCase().slice(20)} `, SEGREDO_VETORES)).not.toBeNull();
    expect(conferirChave(k, "outro-segredo")).toBeNull();
    expect(conferirChave(k.slice(0, -1) + (k.endsWith("A") ? "B" : "A"), SEGREDO_VETORES)).toBeNull();
    expect(conferirChave("VOX-ABC", SEGREDO_VETORES)).toBeNull();
  });
});

describe("checkout", () => {
  it("cria a preferência com preço fixo 470 BRL, idempotency key e pagamento único", async () => {
    const { status, corpo } = await comprar("  Pessoa@Exemplo.com ");
    expect(status).toBe(200);
    expect(corpo.ok).toBe(true);
    expect(corpo.url).toContain("sandbox.mercadopago.com.br");
    const [p] = ff.preferencias();
    const pedido = await pedidoDe("pessoa@exemplo.com");
    expect(p.headers["x-idempotency-key"]).toBe(pedido.id);
    expect(p.headers.authorization).toBe("Bearer TEST-token-falso");
    const b = p.corpo as CorpoPreferencia;
    expect(b.items).toEqual([{ id: "vox-licenca", title: "VOX Videos — licença vitalícia", quantity: 1, unit_price: 470, currency_id: "BRL" }]);
    expect(b.external_reference).toBe(pedido.id);
    expect(b.payer.email).toBe("pessoa@exemplo.com");
    expect(b.notification_url).toMatch(/^https:\/\/vox\.exemplo\/api\/webhooks\/mercadopago/);
    expect(b.back_urls.success).toBe("https://vox.exemplo/compra/sucesso");
    expect(b.auto_return).toBe("approved");
    expect(b.statement_descriptor).toBe("VOX VIDEOS");
    expect(b.payment_methods.installments).toBe(12);
    expect(b).not.toHaveProperty("preapproval_plan_id");
    expect(pedido.status).toBe("criado");
  });

  it("ignora preço vindo do navegador", async () => {
    await checkoutPOST(req("/api/checkout", { email: "a@exemplo.com", unit_price: 1, valor: 1 }));
    expect((ff.preferencias()[0].corpo as CorpoPreferencia).items[0].unit_price).toBe(470);
  });

  it("produção usa o init_point", async () => {
    process.env.MP_AMBIENTE = "producao";
    const { corpo } = await comprar("b@exemplo.com");
    expect(corpo.url).toContain("www.mercadopago.com.br");
  });

  it("recusa e-mail inválido e descartável", async () => {
    for (const email of ["", "sem-arroba", "a@b", "a@@b.com", "x".repeat(250) + "@a.com"]) {
      const { status, corpo } = await comprar(email);
      expect(status).toBe(400);
      expect(corpo.motivo).toBe("email_invalido");
    }
    const d = await comprar("alguem@mailinator.com");
    expect(d.status).toBe(400);
    expect(d.corpo.motivo).toBe("email_descartavel");
    expect(ff.preferencias()).toHaveLength(0);
  });

  it("reusa o pedido aberto do mesmo e-mail (não duplica pagamento)", async () => {
    const a = await comprar("c@exemplo.com");
    const b = await comprar("c@exemplo.com");
    expect(b.corpo.url).toBe(a.corpo.url);
    expect(ff.preferencias()).toHaveLength(1);
  });

  it("limita por e-mail e por IP", async () => {
    for (let i = 0; i < 5; i++) expect((await comprar("d@exemplo.com", `198.51.100.${i}`)).status).toBe(200);
    const sexto = await comprar("d@exemplo.com", "198.51.100.99");
    expect(sexto.status).toBe(429);
    expect(sexto.corpo.motivo).toBe("limite");
    for (let i = 0; i < 5; i++) expect((await comprar(`ip${i}@exemplo.com`, "192.0.2.7")).status).toBe(200);
    expect((await comprar("ip9@exemplo.com", "192.0.2.7")).status).toBe(429);
  });

  it("já comprou: reenvia a chave e não cria pagamento", async () => {
    await comprar("e@exemplo.com");
    await aprovar("e@exemplo.com");
    const antes = ff.preferencias().length;
    const emailsAntes = ff.emails().length;
    const { status, corpo } = await comprar("e@exemplo.com");
    expect(status).toBe(200);
    expect(corpo).toMatchObject({ ok: false, motivo: "ja_comprou" });
    expect(JSON.stringify(corpo)).not.toContain("VOX-");
    expect(ff.preferencias()).toHaveLength(antes);
    expect(ff.emails()).toHaveLength(emailsAntes + 1);
  });

  it("sem configuração responde 503 sem quebrar", async () => {
    process.env.MP_ACCESS_TOKEN = "";
    const { status, corpo } = await comprar("f@exemplo.com");
    expect(status).toBe(503);
    expect(corpo.motivo).toBe("indisponivel");
  });
});

describe("webhook do Mercado Pago", () => {
  it("assinatura inválida -> 401 e nada processado", async () => {
    await comprar("g@exemplo.com");
    const p = await pedidoDe("g@exemplo.com");
    ff.pagamentos.set("2001", { id: "2001", status: "approved", transaction_amount: 470, currency_id: "BRL", external_reference: p.id });
    const r1 = await webhookPOST(notificacao("2001", { segredo: "segredo-errado" }));
    expect(r1.status).toBe(401);
    const semAssinatura = new Request("https://vox.exemplo/api/webhooks/mercadopago?data.id=2001&type=payment", { method: "POST", body: "{}" });
    expect((await webhookPOST(semAssinatura)).status).toBe(401);
    expect(ff.chamadas.filter((c) => c.url.includes("/v1/payments/"))).toHaveLength(0);
    expect(await licencas()).toHaveLength(0);
  });

  it("aprovado -> 1 licença e 1 e-mail com a chave", async () => {
    await comprar("h@exemplo.com");
    const r = await aprovar("h@exemplo.com", "3001");
    expect(r.status).toBe(200);
    expect(r.corpo.resultado).toBe("aprovado");
    const ls = await licencas();
    expect(ls).toHaveLength(1);
    expect(ls[0].chave).toBe(gerarChave({ c: "h@exemplo.com", m: 2, v: null }, SEGREDO_VETORES));
    const emails = ff.emails();
    expect(emails).toHaveLength(1);
    const e = emails[0].corpo as CorpoEmail;
    expect(e.to).toEqual(["h@exemplo.com"]);
    expect(e.subject).toBe("Sua chave do VOX Videos");
    expect(e.html).toContain(ls[0].chave);
    expect(e.text).toContain(ls[0].chave);
    expect(e.text).toContain("releases/latest");
    expect(e.text).toContain("/tutoriais");
    const p = await pedidoDe("h@exemplo.com");
    expect(p).toMatchObject({ status: "aprovado", payment_id: "3001" });
  });

  it("a mesma notificação 3x -> 1 licença e 1 e-mail", async () => {
    await comprar("i@exemplo.com");
    await aprovar("i@exemplo.com", "4001");
    const r2 = await webhookPOST(notificacao("4001", { requestId: "outra-1" }));
    const r3 = await webhookPOST(notificacao("4001", { requestId: "outra-2" }));
    expect(r2.status).toBe(200);
    expect(r3.status).toBe(200);
    expect((await r3.json()).resultado).toBe("ja_processado");
    expect(await licencas()).toHaveLength(1);
    expect(ff.emails()).toHaveLength(1);
  });

  it("3 notificações ao mesmo tempo -> 1 licença e 1 e-mail", async () => {
    await comprar("j@exemplo.com");
    const p = await pedidoDe("j@exemplo.com");
    ff.pagamentos.set("4501", { id: "4501", status: "approved", transaction_amount: 470, currency_id: "BRL", external_reference: p.id });
    const rs = await Promise.all([1, 2, 3].map((n) => webhookPOST(notificacao("4501", { requestId: `par-${n}` }))));
    expect(rs.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(await licencas()).toHaveLength(1);
    expect(ff.emails()).toHaveLength(1);
  });

  it("falha no e-mail -> 500 e o reenvio do MP completa o e-mail uma vez", async () => {
    await comprar("k@exemplo.com");
    ff.falharEmail(true);
    expect((await aprovar("k@exemplo.com", "4601")).status).toBe(500);
    ff.falharEmail(false);
    expect((await webhookPOST(notificacao("4601"))).status).toBe(200);
    expect((await webhookPOST(notificacao("4601"))).status).toBe(200);
    expect(ff.emails().filter((e) => e.corpo && (e.corpo as CorpoEmail).to[0] === "k@exemplo.com")).toHaveLength(2); // 1 falhou + 1 entregue
    expect(await licencas()).toHaveLength(1);
  });

  it("valor diferente de 470 ou moeda diferente -> não libera", async () => {
    await comprar("l@exemplo.com");
    const r = await aprovar("l@exemplo.com", "5001", 1);
    expect(r.corpo.resultado).toBe("valor_divergente");
    await comprar("m@exemplo.com");
    const r2 = await aprovar("m@exemplo.com", "5002", 470, "USD");
    expect(r2.corpo.resultado).toBe("valor_divergente");
    expect(await licencas()).toHaveLength(0);
    expect(ff.emails()).toHaveLength(0);
    expect((await pedidoDe("l@exemplo.com")).status).toBe("criado");
  });

  it("pagamento de pedido que não existe -> não libera", async () => {
    ff.pagamentos.set("5100", { id: "5100", status: "approved", transaction_amount: 470, currency_id: "BRL", external_reference: "00000000-0000-4000-8000-000000000000" });
    const r = await webhookPOST(notificacao("5100"));
    expect((await r.json()).resultado).toBe("pedido_inexistente");
    expect(await licencas()).toHaveLength(0);
  });

  it("recusado e pendente atualizam o pedido sem licença", async () => {
    await comprar("n@exemplo.com");
    await aprovar("n@exemplo.com", "6001", 470, "BRL", "pending");
    expect((await pedidoDe("n@exemplo.com")).status).toBe("pendente");
    await aprovar("n@exemplo.com", "6002", 470, "BRL", "rejected");
    expect((await pedidoDe("n@exemplo.com")).status).toBe("recusado");
    expect(await licencas()).toHaveLength(0);
    // aviso atrasado de "pendente" não rebaixa um pedido aprovado
    await aprovar("n@exemplo.com", "6003");
    await aprovar("n@exemplo.com", "6004", 470, "BRL", "pending");
    expect((await pedidoDe("n@exemplo.com")).status).toBe("aprovado");
  });

  it("estorno e chargeback revogam a licença", async () => {
    await comprar("o@exemplo.com");
    await aprovar("o@exemplo.com", "7001");
    await aprovar("o@exemplo.com", "7001", 470, "BRL", "refunded");
    expect((await pedidoDe("o@exemplo.com")).status).toBe("estornado");
    expect((await licencas())[0].revogada).toBe(true);
    await comprar("p@exemplo.com");
    await aprovar("p@exemplo.com", "7002");
    await aprovar("p@exemplo.com", "7002", 470, "BRL", "charged_back");
    expect((await licencas()).find((l) => l.email === "p@exemplo.com")!.revogada).toBe(true);
  });

  it("tipo que não é payment é ignorado", async () => {
    const r = new Request("https://vox.exemplo/api/webhooks/mercadopago?data.id=1&type=merchant_order", {
      method: "POST",
      headers: notificacao("1").headers,
      body: "{}",
    });
    const resp = await webhookPOST(r);
    expect(resp.status).toBe(200);
    expect((await resp.json()).ignorado).toBe(true);
  });
});

describe("validar licença", () => {
  async function validar(chave: string, maquina: string) {
    const r = await validarPOST(req("/api/licenca/validar", { chave, maquina, versao_app: "1.2.3" }));
    return { status: r.status, corpo: await r.json() };
  }

  it("ativa, 2ª máquina ok, 3ª -> limite_maquinas, revogada, chave falsa e inexistente", async () => {
    await comprar("q@exemplo.com");
    await aprovar("q@exemplo.com", "8001");
    const chave = (await licencas())[0].chave;

    const a = await validar(chave, "maq-1");
    expect(a).toEqual({ status: 200, corpo: { ok: true, status: "ativa", maquinas: 2, usadas: 1 } });
    expect((await validar(chave.toLowerCase(), "maq-1")).corpo.usadas).toBe(1); // mesma máquina não conta 2x
    expect((await validar(chave, "maq-2")).corpo).toMatchObject({ ok: true, usadas: 2 });
    const c = await validar(chave, "maq-3");
    expect(c.status).toBe(200);
    expect(c.corpo).toMatchObject({ ok: false, motivo: "limite_maquinas" });
    expect(typeof c.corpo.mensagem).toBe("string");

    await pg.query(`UPDATE licencas SET revogada = true`);
    expect((await validar(chave, "maq-1")).corpo).toMatchObject({ ok: false, motivo: "revogada" });

    expect((await validar(chave.slice(0, -2) + "AA", "maq-1")).corpo).toMatchObject({ ok: false, motivo: "chave_invalida" });
    const deFora = gerarChave({ c: "nunca@comprou.com", m: 2, v: null }, SEGREDO_VETORES);
    expect((await validar(deFora, "maq-1")).corpo).toMatchObject({ ok: false, motivo: "inexistente" });
  });

  it("sem banco -> 5xx (o app trata como sem internet)", async () => {
    const { definirBanco } = await import("@/lib/pagamento/banco");
    definirBanco(null);
    const antes = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "";
    const chave = gerarChave({ c: "x@exemplo.com", m: 2, v: null }, SEGREDO_VETORES);
    const r = await validar(chave, "maq-1");
    expect(r.status).toBeGreaterThanOrEqual(500);
    process.env.DATABASE_URL = antes;
  });
});

describe("reenviar chave", () => {
  async function reenviar(email: string, ip = "203.0.113.50") {
    const r = await reenviarPOST(req("/api/licenca/reenviar", { email }, { ip }));
    return { status: r.status, corpo: await r.json() };
  }

  it("resposta genérica: igual para quem comprou e quem não comprou; reenvia a MESMA chave", async () => {
    await comprar("r@exemplo.com");
    await aprovar("r@exemplo.com", "9001");
    const chave = (await licencas())[0].chave;
    const sim = await reenviar("R@Exemplo.com");
    const nao = await reenviar("ninguem@exemplo.com");
    expect(sim.status).toBe(200);
    expect(nao.status).toBe(200);
    expect(sim.corpo).toEqual(nao.corpo);
    expect(JSON.stringify(sim.corpo)).not.toContain("VOX-");
    const ultimo = ff.emails().at(-1)!.corpo as CorpoEmail;
    expect(ultimo.to).toEqual(["r@exemplo.com"]);
    expect(ultimo.text).toContain(chave);
    expect(ff.emails()).toHaveLength(2); // compra + reenvio; nada para quem não comprou
  });

  it("400 para e-mail inválido e 429 no limite", async () => {
    expect((await reenviar("invalido")).status).toBe(400);
    for (let i = 0; i < 3; i++) expect((await reenviar("s@exemplo.com", `198.51.100.${i}`)).status).toBe(200);
    expect((await reenviar("s@exemplo.com", "198.51.100.200")).status).toBe(429);
  });
});

describe("licença grátis", () => {
  it("com EXIGIR_PAGAMENTO padrão (true) manda para /comprar", async () => {
    const r = await gratisPOST(req("/api/licenca", { email: "t@exemplo.com" }));
    expect(await r.json()).toEqual({ ok: false, motivo: "pagamento_necessario", url: "/comprar" });
    expect(await licencas()).toHaveLength(0);
  });

  it("com EXIGIR_PAGAMENTO=false cria e manda por e-mail, sem devolver a chave", async () => {
    process.env.EXIGIR_PAGAMENTO = "false";
    const r = await gratisPOST(req("/api/licenca", { email: "u@exemplo.com" }));
    const corpo = await r.json();
    expect(corpo.ok).toBe(true);
    expect(JSON.stringify(corpo)).not.toContain("VOX-");
    expect(ff.emails()).toHaveLength(1);
  });
});

describe("admin", () => {
  it("sem ADMIN_SENHA o admin fica desligado", async () => {
    expect((await loginPOST(req("/api/admin/login", { senha: "" }))).status).toBe(404);
    expect((await dadosGET(req("/api/admin/dados", undefined, { metodo: "GET" }))).status).toBe(404);
  });

  it("com senha: bloqueia sem cookie, entra com a senha e mascara a chave", async () => {
    process.env.ADMIN_SENHA = "senha-somente-de-teste";
    expect((await dadosGET(req("/api/admin/dados", undefined, { metodo: "GET" }))).status).toBe(401);
    expect((await loginPOST(req("/api/admin/login", { senha: "errada" }))).status).toBe(401);
    const forjado = { cookie: `vox_admin=9999999999.${"0".repeat(64)}` };
    expect((await dadosGET(req("/api/admin/dados", undefined, { metodo: "GET", headers: forjado }))).status).toBe(401);

    const login = await loginPOST(req("/api/admin/login", { senha: "senha-somente-de-teste" }));
    expect(login.status).toBe(200);
    const setCookie = login.headers.get("set-cookie")!;
    expect(setCookie).toMatch(/HttpOnly/);
    expect(setCookie).toMatch(/SameSite=Strict/);
    expect(setCookie).toMatch(/Max-Age=43200/);
    const cookie = setCookie.split(";")[0];

    await comprar("v@exemplo.com");
    await aprovar("v@exemplo.com", "9901");
    const dados = await (await dadosGET(req("/api/admin/dados", undefined, { metodo: "GET", headers: { cookie } }))).json();
    expect(dados.licencas).toHaveLength(1);
    expect(JSON.stringify(dados)).not.toContain((await licencas())[0].chave);
    expect(dados.pedidos[0]).toMatchObject({ status: "aprovado", payment_id: "9901" });

    const id = dados.licencas[0].id;
    const acao = (a: string) => acaoPOST(req("/api/admin/acao", { acao: a, licenca_id: id }, { headers: { cookie } })).then((r) => r.json());
    expect((await acao("mostrar")).chave).toBe((await licencas())[0].chave);
    await acao("revogar");
    expect((await licencas())[0].revogada).toBe(true);
    await acao("reativar");
    expect((await licencas())[0].revogada).toBe(false);

    // muda a senha: a sessão antiga deixa de valer
    process.env.ADMIN_SENHA = "outra-senha-de-teste";
    expect((await dadosGET(req("/api/admin/dados", undefined, { metodo: "GET", headers: { cookie } }))).status).toBe(401);
  });
});

describe("respostas das APIs", () => {
  it("nunca entram em cache", async () => {
    const r = await checkoutPOST(req("/api/checkout", { email: "w@exemplo.com" }));
    expect(r.headers.get("cache-control")).toContain("no-store");
    const r2 = await validarPOST(req("/api/licenca/validar", { chave: "x", maquina: "m" }));
    expect(r2.headers.get("cache-control")).toContain("no-store");
  });
});

describe("banco no Supabase", () => {
  it("todas as tabelas ficam com RLS ligado (a API pública do Supabase não lê nada)", async () => {
    const pg = await bancoDeTeste();
    const r = await pg.query<{ relname: string; relrowsecurity: boolean }>(
      `SELECT relname, relrowsecurity FROM pg_class
        WHERE relname IN ('pedidos','licencas','licenca_maquinas','webhook_eventos','limites')`,
    );
    expect(r.rows).toHaveLength(5);
    for (const t of r.rows) expect(t.relrowsecurity, t.relname).toBe(true);
  });
});

describe("endereço do site no Mercado Pago", () => {
  it("no preview da Vercel usa o endereço fixo da branch; fora dele, o NEXT_PUBLIC_SITE_URL", async () => {
    const { cfg } = await import("@/lib/pagamento/config");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://site-oficial.example");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_BRANCH_URL", "voxsite-git-pagamento-x.vercel.app");
    expect(cfg.siteUrl).toBe("https://voxsite-git-pagamento-x.vercel.app");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(cfg.siteUrl).toBe("https://site-oficial.example");
    vi.unstubAllEnvs();
  });
});

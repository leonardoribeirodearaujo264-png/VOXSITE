/**
 * Configuração do pagamento. Tudo vem de variável de ambiente, lida na hora
 * (nunca no import), para o build passar com as variáveis vazias. Nenhum
 * segredo aqui: só os nomes.
 */
import { SITE } from "@/lib/site";

/** Preço fixo no servidor. O navegador nunca manda valor. */
export const PRECO = 470.0;
export const MOEDA = "BRL";
export const PRECO_TEXTO = "R$ 470,00";
export const ITEM_ID = "vox-licenca";
export const ITEM_TITULO = "VOX Videos — licença vitalícia";

function env(nome: string): string {
  return (process.env[nome] ?? "").trim();
}

export const cfg = {
  get mpToken() {
    return env("MP_ACCESS_TOKEN");
  },
  get mpWebhookSecret() {
    return env("MP_WEBHOOK_SECRET");
  },
  /** "teste" usa o sandbox_init_point. Qualquer outro valor = produção. */
  get mpTeste() {
    return env("MP_AMBIENTE").toLowerCase() === "teste";
  },
  get segredoLicenca() {
    return env("VOX_SEGREDO_LICENCA");
  },
  get resendKey() {
    return env("RESEND_API_KEY");
  },
  get remetente() {
    return env("EMAIL_REMETENTE");
  },
  get adminSenha() {
    return env("ADMIN_SENHA");
  },
  get databaseUrl() {
    return env("DATABASE_URL");
  },
  /** Endereço usado no webhook e nas páginas de volta do Mercado Pago. No
   *  preview da Vercel, o endereço FIXO da branch (VERCEL_BRANCH_URL, que a
   *  Vercel define sozinha): o NEXT_PUBLIC_SITE_URL do site oficial vale para
   *  preview e produção juntos e mandaria o Mercado Pago para o site oficial. */
  get siteUrl() {
    const branch = env("VERCEL_BRANCH_URL");
    if (env("VERCEL_ENV") === "preview" && branch) {
      return ("https://" + branch.replace(/^https?:\/\//, "")).replace(/\/+$/, "");
    }
    return (env("NEXT_PUBLIC_SITE_URL") || SITE.url).replace(/\/+$/, "");
  },
  /** Padrão TRUE: licença grátis só com EXIGIR_PAGAMENTO=false. */
  get exigirPagamento() {
    return env("EXIGIR_PAGAMENTO").toLowerCase() !== "false";
  },
  get maquinasPorLicenca() {
    const n = Number.parseInt(env("MAQUINAS_POR_LICENCA"), 10);
    return Number.isFinite(n) && n >= 1 && n <= 50 ? n : 2;
  },
};

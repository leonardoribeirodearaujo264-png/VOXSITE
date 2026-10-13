/** Dados fixos do site. Nada de segredo aqui: este arquivo vai para o navegador. */

export const SITE = {
  nome: "VOX Videos",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://vox-site.vercel.app").replace(/\/$/, ""),
  descricao:
    "Editor de vídeo para Windows com IA. Você pede em português e o VOX corta silêncios, legenda, coloca títulos e cards e exporta o vídeo pronto para Reels e TikTok.",
} as const;

/** Repositório público onde a esteira do app publica os instaladores. */
export const RELEASES = {
  dono: "leonardoribeirodearaujo264-png",
  repo: "vox-videos-releases",
  get pagina() {
    return `https://github.com/${this.dono}/${this.repo}/releases`;
  },
  get ultima() {
    return `https://github.com/${this.dono}/${this.repo}/releases/latest`;
  },
} as const;

/** Botão "Comprar licença": só existe com a variável preenchida. */
export const LINK_COMPRA = (process.env.NEXT_PUBLIC_LINK_COMPRA || "").trim();

export const NAV = [
  { href: "/#como-funciona", rotulo: "Como funciona" },
  { href: "/#funcoes", rotulo: "Funções" },
  { href: "/tutoriais", rotulo: "Tutoriais" },
  { href: "/download", rotulo: "Download" },
] as const;

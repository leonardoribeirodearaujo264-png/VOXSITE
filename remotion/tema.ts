import { loadFont as carregarInter } from "@remotion/google-fonts/Inter";
import { loadFont as carregarMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as carregarMontserrat } from "@remotion/google-fonts/Montserrat";

/** Cores do app (D:\VOX-VIDEOS\frontend\src\tokens.css). Uma cor de destaque. */
export const C = {
  fundo: "#0B0B0F",
  painel: "#121218",
  painel2: "#17171F",
  painel3: "#1E1E28",
  borda: "#262633",
  bordaForte: "#33334A",
  texto: "#ECECF4",
  texto2: "#B4B4C6",
  mudo: "#8A8AA0",
  acento: "#2EE6A6",
  acentoEscuro: "#15B482",
  acentoTinta: "#0B2A20",
  perigo: "#F06A6A",
  aviso: "#F2C14E",
  // trilhas da timeline do app
  audio: "#7C5CD6",
  audioClaro: "#9B82E6",
  legenda: "#0F5E46",
  elemento: "#0E4A6B",
  // estilo "jurídico premium" do app (presets/legendas/08)
  dourado: "#D4AF37",
} as const;

const inter = carregarInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
const mono = carregarMono("normal", { weights: ["400", "500"], subsets: ["latin"] });
const montserrat = carregarMontserrat("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });

export const F = {
  ui: `${inter.fontFamily}, "Segoe UI", sans-serif`,
  mono: `${mono.fontFamily}, ui-monospace, monospace`,
  legenda: `${montserrat.fontFamily}, ${inter.fontFamily}, sans-serif`,
} as const;

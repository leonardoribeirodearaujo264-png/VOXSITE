import type { CSSProperties, ReactNode } from "react";
import {
  AudioLines,
  Captions,
  Check,
  Download,
  Film,
  Image as IconeImagem,
  LayoutGrid,
  Loader2,
  Play,
  Scissors,
  Settings,
  Sparkles,
  Star,
  Type,
  Undo2,
  Redo2,
  Home,
  ImagePlus,
  Pencil,
  Volume2,
  Lock,
  Eye,
  RefreshCw,
} from "lucide-react";
import { C, F } from "../tema";
import { VideoVertical, type Edicao, type Variante } from "./Cena";

/* Peças da interface do VOX recriadas a partir do frontend real
   (App.Cabecalho, Trilho, GavetaIA, VersaoIA, Timeline, GaleriaModelos,
   ModalExportar). Medidas em px "do app"; quem usa escala o conjunto. */

export const caixa = (extra?: CSSProperties): CSSProperties => ({
  background: C.painel,
  border: `1px solid ${C.borda}`,
  borderRadius: 14,
  ...extra,
});

export function Pilula({ children, cor = C.acento, cheia = false, style }: { children: ReactNode; cor?: string; cheia?: boolean; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        border: `1px solid ${cheia ? cor : cor + "66"}`,
        background: cheia ? cor : "transparent",
        color: cheia ? C.fundo : cor,
        fontFamily: F.ui,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------- barra de cima */
export function BarraTopo({ projeto = "Revisão do benefício", exportarAceso = false }: { projeto?: string; exportarAceso?: boolean }) {
  return (
    <div style={{ height: 48, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", background: C.painel2, borderBottom: `1px solid ${C.borda}`, fontFamily: F.ui }}>
      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", color: C.texto }}>
        VOX <span style={{ color: C.acento }}>VIDEOS</span>
      </span>
      <span style={{ width: 1, height: 20, background: C.borda }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: C.texto }}>{projeto}</span>
      <Pencil size={12} color={C.mudo} />
      <Pilula>tudo salvo</Pilula>
      <div style={{ flex: 1 }} />
      <Undo2 size={16} color={C.mudo} />
      <Redo2 size={16} color={C.mudo} />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.acento}88`, color: C.acento, fontSize: 13, fontWeight: 600 }}>
        <Star size={14} /> Editar com IA
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 8,
          background: C.acento,
          color: C.fundo,
          fontSize: 13,
          fontWeight: 700,
          boxShadow: exportarAceso ? `0 0 0 4px ${C.acento}40, 0 0 30px ${C.acento}80` : undefined,
        }}
      >
        <Download size={14} /> Exportar
      </span>
      <span style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.borda}` }}>
        <Settings size={15} color={C.texto2} />
      </span>
    </div>
  );
}

/* --------------------------------------------------- trilho da esquerda */
const BIBLIOTECAS = [
  [IconeImagem, "Mídia"],
  [Play, "Motion"],
  [LayoutGrid, "Cards"],
  [Type, "Texto"],
  [Captions, "Legendas"],
  [Volume2, "Áudio"],
  [ImagePlus, "Fundo"],
  [LayoutGrid, "Modelos"],
] as const;

export function Trilho({ ativo = "IA" }: { ativo?: string }) {
  const item = (Icone: typeof Film, nome: string) => (
    <div key={nome} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 0", borderRadius: 8, background: ativo === nome ? C.painel3 : "transparent", color: ativo === nome ? C.acento : C.mudo }}>
      <Icone size={16} />
      <span style={{ fontSize: 10.5, fontFamily: F.ui }}>{nome}</span>
    </div>
  );
  return (
    <div style={{ width: 60, padding: "8px 4px", display: "flex", flexDirection: "column", gap: 2, background: C.painel2, borderRight: `1px solid ${C.borda}` }}>
      {BIBLIOTECAS.map(([I, n]) => item(I, n))}
      <div style={{ flex: 1 }} />
      {item(Star, "IA")}
      {item(Home, "Projetos")}
    </div>
  );
}

/* ------------------------------------------------- gaveta Editar com IA */
export type Passo = { texto: string; estado: "feito" | "agora" | "espera" };

export function PainelIA({
  pedido,
  digitando,
  passos = [],
  entrega,
  custo = "estimativa: US$ 0,20 a 0,60",
  largura = 420,
  altura,
  style,
}: {
  pedido?: string;
  digitando?: string;
  passos?: Passo[];
  entrega?: string;
  custo?: string;
  largura?: number;
  altura?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ width: largura, height: altura, display: "flex", flexDirection: "column", background: C.painel, borderLeft: `1px solid ${C.borda}`, fontFamily: F.ui, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${C.borda}` }}>
        <Star size={18} color={C.acento} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.texto }}>Editar com IA</div>
          <div style={{ fontSize: 12, color: C.mudo }}>powered by Claude</div>
        </div>
        <Pilula>{passos.some((p) => p.estado === "agora") ? "editando" : "pronto"}</Pilula>
      </div>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        {pedido && (
          <div style={{ alignSelf: "flex-end", maxWidth: "88%", padding: "11px 14px", borderRadius: "14px 14px 4px 14px", background: C.acentoTinta, border: `1px solid ${C.acento}33`, color: C.texto, fontSize: 14.5, lineHeight: 1.45 }}>
            {pedido}
          </div>
        )}
        {passos.length > 0 && (
          <div style={{ ...caixa({ padding: "12px 14px", background: C.painel2 }) }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: C.mudo, marginBottom: 10 }}>PLANO</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {passos.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: p.estado === "espera" ? C.mudo : C.texto }}>
                  <span
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 22,
                      height: 22,
                      flexShrink: 0,
                      borderRadius: 999,
                      background: p.estado === "feito" ? C.acento : "transparent",
                      border: `1.5px solid ${p.estado === "espera" ? C.bordaForte : C.acento}`,
                      color: C.fundo,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {p.estado === "feito" ? <Check size={13} strokeWidth={3} /> : p.estado === "agora" ? <Loader2 size={13} color={C.acento} /> : <span style={{ color: C.mudo }}>{i + 1}</span>}
                  </span>
                  <span style={{ fontWeight: p.estado === "agora" ? 600 : 400 }}>{p.texto}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {entrega && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.acento}55`, background: `${C.acento}12`, color: C.acento, fontSize: 14, fontWeight: 600 }}>
            <Check size={16} strokeWidth={2.6} /> {entrega}
          </div>
        )}
      </div>
      <div style={{ padding: "10px 16px 16px", borderTop: `1px solid ${C.borda}` }}>
        <div style={{ fontSize: 12, color: C.mudo, marginBottom: 8 }}>{custo}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, minHeight: 46, padding: "11px 12px", borderRadius: 10, border: `1px solid ${digitando ? C.acento : C.bordaForte}`, background: C.fundo, fontSize: 14, color: digitando ? C.texto : C.mudo, lineHeight: 1.4 }}>
            {digitando ?? "o que você quer no vídeo?"}
            {digitando !== undefined && <span style={{ display: "inline-block", width: 2, height: 16, marginLeft: 2, verticalAlign: "-3px", background: C.acento }} />}
          </div>
          <span style={{ display: "grid", placeItems: "center", width: 46, borderRadius: 10, background: C.acento }}>
            <Sparkles size={18} color={C.fundo} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------- barra de versões */
export function BarraVersoes({ versoes, atual, comBotoes = true }: { versoes: string[]; atual: string; comBotoes?: boolean }) {
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: `1px solid ${C.borda}`, background: C.painel, fontFamily: F.ui }}>
      <span style={{ fontSize: 13, color: C.mudo, marginRight: 6 }}>Versões da IA</span>
      {versoes.map((v) => (
        <span
          key={v}
          style={{
            padding: "4px 10px",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 700,
            background: v === atual ? C.acentoEscuro : "transparent",
            color: v === atual ? "#fff" : C.texto2,
          }}
        >
          {v}
        </span>
      ))}
      <div style={{ flex: 1 }} />
      {comBotoes && (
        <>
          <span style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${C.bordaForte}`, fontSize: 12.5, color: C.texto }}>Salvar como meu estilo</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 7, border: `1px solid ${C.bordaForte}`, fontSize: 12.5, color: C.texto }}>
            <Pencil size={12} /> Ajustar à mão
          </span>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ timeline */
/** Trechos do vídeo: [início, fim] em segundos; `cortes` são os silêncios. */
export function Timeline({
  duracao = 34,
  trechos = [[0, 6], [7.2, 15.5], [16.4, 25], [25.8, 34]],
  cortes = [],
  cursor = 9.5,
  elementos = [{ t0: 1, t1: 4.5, nome: "@ no topo" }, { t0: 10, t1: 15, nome: "título" }, { t0: 22, t1: 27.5, nome: "card da notícia" }],
  legendas = ["Hoje eu vou", "explicar", "em um minuto", "um direito", "que pouca gente", "conhece.", "Fica comigo", "até o final."],
  modoMao = false,
  audioSolto = false,
  altura = 250,
  largura = 1100,
}: {
  duracao?: number;
  trechos?: number[][];
  cortes?: number[][];
  cursor?: number;
  elementos?: { t0: number; t1: number; nome: string }[];
  legendas?: string[];
  modoMao?: boolean;
  audioSolto?: boolean;
  altura?: number;
  largura?: number;
}) {
  const esquerda = 64;
  const util = largura - esquerda - 12;
  const x = (t: number) => esquerda + (t / duracao) * util;
  const linha = (y: number, rotulo: string, Icone: typeof Film, filho: ReactNode, alt = 46) => (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, height: alt }}>
      <div style={{ position: "absolute", left: 12, top: alt / 2 - 8, display: "flex", alignItems: "center", gap: 5, color: C.mudo, fontSize: 12, fontFamily: F.ui }}>
        <Icone size={13} /> {rotulo}
      </div>
      {filho}
    </div>
  );
  const ondas = (t0: number, t1: number, semente: number) => {
    const n = Math.max(6, Math.round((x(t1) - x(t0)) / 5));
    return Array.from({ length: n }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + semente) * Math.cos(i * 0.43 + semente * 2)));
  };
  return (
    <div style={{ position: "relative", width: largura, height: altura, background: C.painel, borderTop: `1px solid ${C.borda}`, fontFamily: F.ui, overflow: "hidden" }}>
      {/* barra de ferramentas */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", borderBottom: `1px solid ${C.borda}` }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: C.texto2 }}>TIMELINE</span>
        <Scissors size={14} color={C.texto2} style={{ marginLeft: 8 }} />
        {modoMao && (
          <>
            <span style={{ padding: "3px 9px", borderRadius: 6, border: `1px solid ${audioSolto ? C.acento : C.bordaForte}`, color: audioSolto ? C.acento : C.texto2, fontSize: 12 }}>
              {audioSolto ? "Vincular áudio" : "Desvincular áudio"}
            </span>
            <span style={{ padding: "3px 9px", borderRadius: 6, border: `1px solid ${C.bordaForte}`, color: C.texto2, fontSize: 12 }}>Cortar áudio</span>
          </>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.mudo }}>cursor em {cursor.toFixed(2).replace(".", ",")} s</span>
      </div>
      {/* régua */}
      <div style={{ position: "absolute", top: 40, left: 0, right: 0, height: 22 }}>
        {Array.from({ length: Math.floor(duracao / 2) + 1 }, (_, i) => (
          <span key={i} style={{ position: "absolute", left: x(i * 2) + 3, top: 4, fontFamily: F.mono, fontSize: 10, color: C.mudo }}>
            00:{String(i * 2).padStart(2, "0")}
          </span>
        ))}
      </div>
      {linha(
        66,
        "V1",
        Film,
        <>
          {trechos.map(([a, b], i) => (
            <div key={i} style={{ position: "absolute", left: x(a) + 1, width: x(b) - x(a) - 2, top: 2, bottom: 2, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.bordaForte}`, background: "linear-gradient(90deg,#3B342D,#2A2520)" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 44px)" }} />
              {Array.from({ length: Math.max(1, Math.floor((x(b) - x(a)) / 44)) }, (_, k) => (
                <div key={k} style={{ position: "absolute", left: k * 44 + 14, bottom: 4, width: 16, height: 22, borderRadius: "8px 8px 2px 2px", background: "#1F2433" }}>
                  <div style={{ position: "absolute", left: 3, top: -9, width: 10, height: 11, borderRadius: 999, background: "#C99273" }} />
                </div>
              ))}
            </div>
          ))}
          {cortes.map(([a, b], i) => (
            <div key={i} style={{ position: "absolute", left: x(a), width: Math.max(4, x(b) - x(a)), top: -2, bottom: -2, borderRadius: 4, background: `${C.perigo}26`, border: `1.5px dashed ${C.perigo}` }} />
          ))}
        </>,
      )}
      {linha(
        116,
        "A1",
        AudioLines,
        <>
          {trechos.map(([a, b], i) => (
            <div key={i} style={{ position: "absolute", left: x(a) + 1, width: x(b) - x(a) - 2, top: 4, bottom: 4, borderRadius: 6, background: `${C.audio}55`, border: `1px solid ${audioSolto ? C.acento : C.audio}`, display: "flex", alignItems: "center", gap: 2, padding: "0 4px", overflow: "hidden" }}>
              {ondas(a, b, i + 1).map((h, k) => (
                <span key={k} style={{ flex: "0 0 3px", height: `${h * 80}%`, borderRadius: 2, background: C.audioClaro }} />
              ))}
              {modoMao && i === 1 && (
                <>
                  <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 36, background: "linear-gradient(90deg, rgba(11,11,15,.85), transparent)", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
                  <span style={{ position: "absolute", right: 8, top: 4, padding: "1px 6px", borderRadius: 5, background: C.fundo, color: C.texto, fontSize: 10.5, fontFamily: F.mono }}>vol 120%</span>
                </>
              )}
            </div>
          ))}
        </>,
        40,
      )}
      {linha(
        160,
        "EL",
        Star,
        <>
          {elementos.map((e, i) => (
            <div key={i} style={{ position: "absolute", left: x(e.t0), width: x(e.t1) - x(e.t0), top: 8, bottom: 8, borderRadius: 6, background: C.elemento, border: `1px solid #1A7AB0`, color: "#D6EEFF", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", padding: "0 8px", whiteSpace: "nowrap", overflow: "hidden" }}>
              {e.nome}
            </div>
          ))}
        </>,
        40,
      )}
      {linha(
        202,
        "CC",
        Captions,
        <>
          {legendas.map((l, i) => {
            const t0 = (i / legendas.length) * duracao;
            const t1 = ((i + 1) / legendas.length) * duracao;
            return (
              <div key={i} style={{ position: "absolute", left: x(t0) + 1, width: x(t1) - x(t0) - 2, top: 6, bottom: 6, borderRadius: 5, background: C.legenda, border: `1px solid ${C.acentoEscuro}`, color: "#D9FFF1", fontSize: 11.5, display: "flex", alignItems: "center", padding: "0 6px", whiteSpace: "nowrap", overflow: "hidden" }}>
                {l}
              </div>
            );
          })}
        </>,
        40,
      )}
      {/* cursor */}
      <div style={{ position: "absolute", left: x(cursor), top: 40, bottom: 0, width: 2, background: C.acento }}>
        <div style={{ position: "absolute", top: 0, left: -6, width: 14, height: 14, transform: "rotate(45deg)", background: C.acento, borderRadius: 2 }} />
      </div>
      {modoMao && (
        <div style={{ position: "absolute", right: 12, top: 168, display: "flex", gap: 8, color: C.mudo }}>
          <Eye size={13} /> <Lock size={13} />
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- celular */
export function Celular({ largura = 300, variante = "advogada", edicao, cru, brilho = true, style }: { largura?: number; variante?: Variante; edicao?: Edicao; cru?: boolean; brilho?: boolean; style?: CSSProperties }) {
  const r = largura * 0.12;
  return (
    <div
      style={{
        width: largura,
        padding: largura * 0.03,
        borderRadius: r + largura * 0.03,
        background: "linear-gradient(160deg,#2A2A34,#121218)",
        border: "1px solid #3A3A48",
        boxShadow: brilho ? `0 40px 90px -30px rgba(0,0,0,.9), 0 0 80px -20px ${C.acento}40` : "0 30px 80px -30px rgba(0,0,0,.9)",
        ...style,
      }}
    >
      <div style={{ borderRadius: r, overflow: "hidden" }}>
        <VideoVertical variante={variante} edicao={edicao} cru={cru} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------ cartão de modelo */
export function CartaoModelo({ nome, descricao, cor, kicker, selecionado = false, largura = 200 }: { nome: string; descricao: string; cor: string; kicker: string; selecionado?: boolean; largura?: number }) {
  return (
    <div style={{ width: largura, borderRadius: 12, overflow: "hidden", background: C.painel2, border: `1.5px solid ${selecionado ? C.acento : C.borda}`, fontFamily: F.ui, boxShadow: selecionado ? `0 0 0 4px ${C.acento}26` : undefined }}>
      <div style={{ position: "relative", aspectRatio: "9 / 12", background: `linear-gradient(170deg, ${cor}33, #101016)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "14px 10px" }}>
        <div style={{ fontFamily: F.legenda, fontWeight: 900, fontSize: largura * 0.085, color: "#fff", letterSpacing: "0.02em", textAlign: "center" }}>{kicker}</div>
        <div style={{ width: largura * 0.32, height: largura * 0.32, borderRadius: 999, background: "#2A2A34", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", bottom: -largura * 0.2, transform: "translateX(-50%)", width: largura * 0.56, height: largura * 0.24, borderRadius: `${largura * 0.2}px ${largura * 0.2}px 0 0`, background: "#2A2A34" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, fontFamily: F.legenda, fontWeight: 800, fontSize: largura * 0.07, color: "#fff", textAlign: "center", lineHeight: 1.1 }}>
          seu <span style={{ color: cor }}>texto</span> aqui
        </div>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.texto }}>{nome}</div>
        <div style={{ marginTop: 3, fontSize: 11.5, color: C.mudo, lineHeight: 1.35 }}>{descricao}</div>
      </div>
    </div>
  );
}

export const MODELOS = [
  { nome: "Jurídico Premium", descricao: "Sóbrio, legenda dourada", cor: C.dourado, kicker: "DIREITO" },
  { nome: "Explicativo", descricao: "Passos numerados", cor: "#4FC3F7", kicker: "PASSO 1" },
  { nome: "Notícia Urgente", descricao: "Manchete com fonte", cor: "#F06A6A", kicker: "URGENTE" },
  { nome: "Minimalista", descricao: "Só o essencial", cor: "#ECECF4", kicker: "simples" },
  { nome: "Reels Dinâmico", descricao: "Ritmo rápido", cor: C.acento, kicker: "OLHA ISSO" },
  { nome: "Editorial", descricao: "Serifa elegante", cor: "#C9A27E", kicker: "Edição" },
];

/* -------------------------------------------------- janela de exportar */
export function ModalExportar({ formato = "9:16", progresso, pronto = false, largura = 460 }: { formato?: string; progresso?: number; pronto?: boolean; largura?: number }) {
  const formatos = [
    ["Vertical", "9:16"],
    ["YouTube", "16:9"],
    ["Quadrado", "1:1"],
  ];
  return (
    <div style={{ width: largura, ...caixa({ padding: 22, background: C.painel2, boxShadow: "0 40px 100px -30px rgba(0,0,0,.9)" }), fontFamily: F.ui }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.texto }}>Exportar vídeo</div>
      <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: C.mudo }}>FORMATO DE SAÍDA</div>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {formatos.map(([n, f]) => (
          <div key={f} style={{ padding: "10px 6px", borderRadius: 10, textAlign: "center", border: `1.5px solid ${f === formato ? C.acento : C.borda}`, background: f === formato ? `${C.acento}14` : C.painel }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: f === formato ? C.acento : C.texto }}>{n}</div>
            <div style={{ fontSize: 12, color: C.mudo }}>{f}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 13.5, color: C.texto2 }}>
        <span>Resolução</span>
        <span style={{ fontFamily: F.mono, color: C.texto }}>{formato === "9:16" ? "1080 × 1920" : formato === "16:9" ? "1920 × 1080" : "1080 × 1080"}</span>
      </div>
      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 13.5, color: C.texto2 }}>
        <span>Qualidade</span>
        <span style={{ color: C.texto }}>Alta</span>
      </div>
      <div style={{ marginTop: 18 }}>
        {pronto ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: `${C.acento}14`, border: `1px solid ${C.acento}66` }}>
            <span style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 999, background: C.acento }}>
              <Check size={16} color={C.fundo} strokeWidth={3} />
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>MP4 pronto</div>
              <div style={{ fontSize: 12, color: C.mudo, fontFamily: F.mono }}>revisao-do-beneficio.mp4</div>
            </div>
          </div>
        ) : progresso !== undefined ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.texto2, marginBottom: 8 }}>
              <span>Gerando o vídeo</span>
              <span style={{ fontFamily: F.mono }}>{Math.round(progresso * 100)}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: C.borda, overflow: "hidden" }}>
              <div style={{ width: `${progresso * 100}%`, height: "100%", background: C.acento, borderRadius: 99 }} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "12px", borderRadius: 10, background: C.acento, color: C.fundo, fontSize: 14, fontWeight: 800 }}>
            <Download size={16} /> Gerar vídeo
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------- aviso de atualização */
export function AvisoAtualizacao({ versao = "1.2.3", largura = 420 }: { versao?: string; largura?: number }) {
  return (
    <div style={{ width: largura, ...caixa({ padding: 18, background: C.painel2 }), fontFamily: F.ui, display: "flex", gap: 14, alignItems: "center" }}>
      <span style={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 12, background: `${C.acento}1F`, color: C.acento }}>
        <RefreshCw size={20} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.texto }}>Versão {versao} disponível</div>
        <div style={{ fontSize: 12.5, color: C.mudo, marginTop: 2 }}>Seus projetos ficam como estão.</div>
      </div>
      <span style={{ padding: "8px 14px", borderRadius: 9, background: C.acento, color: C.fundo, fontSize: 13, fontWeight: 800 }}>Atualizar</span>
    </div>
  );
}

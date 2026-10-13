import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Html5Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, Clock3, Type, AtSign } from "lucide-react";
import { C, F } from "../tema";
import { BarraVersoes, Celular, ModalExportar, PainelIA, Timeline, type Passo } from "../ui/App";
import type { Edicao } from "../ui/Cena";
import { IconeVoxSvg } from "../ui/Logo";
import { PEDIDO, PLANO } from "./Quadros";

/* Hero do site: 52 s a 30 qps. Sem narração; o texto da legenda conta a
   história e fica sempre na tela. Os mesmos atores (celular, painel,
   timeline, exportar) andam pela cena conforme o quadro. */

export const HERO_QPS = 30;
export const HERO_DURACAO = 1560;
export type Formato = "16x9" | "9x16";

export const CENAS = [
  { ini: 0, aba: 0, legenda: "Você gravou o vídeo. Agora vem a parte chata." },
  { ini: 150, aba: 0, legenda: "Cortar pausa. Escrever legenda. Colocar o seu @." },
  { ini: 300, aba: 1, legenda: "No VOX, você só escreve o que quer." },
  { ini: 510, aba: 2, legenda: "Ele mostra o plano e faz cada passo na sua frente." },
  { ini: 780, aba: 3, legenda: "Pronto: legenda jurídico premium e o seu @ no topo." },
  { ini: 1050, aba: 4, legenda: "Quer mudar algo? É só pedir. Toda versão fica guardada." },
  { ini: 1230, aba: 5, legenda: "Um clique, e o MP4 sai pronto para postar." },
  { ini: 1410, aba: -1, legenda: "Você pede. O VOX edita." },
] as const;
const ABAS = ["Gravou", "Pediu", "Plano", "Pronto", "Ajuste", "Exportou"];
const PEDIDO_2 = "coloca um título no começo";
const FALAS: Edicao["legenda"][] = [
  { antes: "hoje eu vou", destaque: "explicar", depois: "" },
  { antes: "um direito que", destaque: "pouca gente", depois: "conhece" },
  { antes: "e que pode", destaque: "mudar", depois: "o seu caso" },
];

/* ------------------------------------------------------------ apoio */
const suave = Easing.inOut(Easing.cubic);
type Chave = { f: number } & Record<string, number>;
/** Interpola cada propriedade entre quadros-chave. */
function anda(frame: number, chaves: Chave[]): Record<string, number> {
  const fs = chaves.map((c) => c.f);
  const out: Record<string, number> = {};
  for (const k of Object.keys(chaves[0])) {
    if (k === "f") continue;
    out[k] = interpolate(frame, fs, chaves.map((c) => c[k]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: suave });
  }
  return out;
}
const janela = (frame: number, a: number, b: number, d = 15) =>
  interpolate(frame, [a, a + d, b - d, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

function Ator({ x, y, o = 1, z = 1, children, style }: { x: number; y: number; o?: number; z?: number; children: ReactNode; style?: CSSProperties }) {
  if (o <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: o, ...style }}>
      <div style={{ zoom: z }}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------- posições */
function posicoes(fmt: Formato) {
  if (fmt === "16x9") {
    return {
      celular: [
        { f: 0, x: 960, y: 1300, w: 420 },
        { f: 24, x: 960, y: 520, w: 420 },
        { f: 150, x: 960, y: 520, w: 420 },
        { f: 176, x: 560, y: 520, w: 400 },
        { f: 780, x: 560, y: 520, w: 400 },
        { f: 806, x: 960, y: 520, w: 450 },
        { f: 1050, x: 960, y: 520, w: 450 },
        { f: 1076, x: 560, y: 520, w: 400 },
        { f: 1230, x: 560, y: 520, w: 400 },
        { f: 1256, x: 520, y: 520, w: 360 },
      ],
      painel: { x: 1290, y: 520, z: 1.6 },
      timeline: { x: 1340, y: 560, z: 1.12 },
      tarefas: { x: 1340, y: 300 },
      modal: { x: 1250, y: 520, z: 1.55 },
      legenda: { y: 1000, fonte: 40 },
      abas: { y: 62, fonte: 22 },
    };
  }
  return {
    celular: [
      { f: 0, x: 540, y: 2400, w: 560 },
      { f: 24, x: 540, y: 760, w: 560 },
      { f: 150, x: 540, y: 760, w: 560 },
      { f: 176, x: 540, y: 640, w: 440 },
      { f: 300, x: 540, y: 640, w: 440 },
      { f: 326, x: 540, y: 480, w: 300 },
      { f: 780, x: 540, y: 480, w: 300 },
      { f: 806, x: 540, y: 800, w: 620 },
      { f: 1050, x: 540, y: 800, w: 620 },
      { f: 1076, x: 540, y: 480, w: 300 },
    ],
    painel: { x: 540, y: 1270, z: 1.5 },
    timeline: { x: 540, y: 1430, z: 1.25 },
    tarefas: { x: 540, y: 1190 },
    modal: { x: 540, y: 1210, z: 1.6 },
    legenda: { y: 1760, fonte: 48 },
    abas: { y: 110, fonte: 24 },
  };
}

/* ------------------------------------------------------------ cena */
export function Hero({ formato = "16x9", som = true }: { formato?: Formato; som?: boolean }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const P = posicoes(formato);
  const cel = anda(frame, P.celular as Chave[]);

  // pessoa falando: boca e respiração
  const falando = frame < 1400;
  const pessoa = {
    abertura: falando ? Math.max(0, Math.sin(frame * 0.55) * Math.sin(frame * 0.17 + 1)) * 0.9 : 0,
    piscar: frame % 110 > 104,
    mover: [0, Math.sin(frame / 22) * 4] as [number, number],
  };

  // a edição entra no celular conforme o plano avança
  const legendaP = spring({ frame: frame - 600, fps, config: { damping: 200 } });
  const arrobaP = spring({ frame: frame - 660, fps, config: { damping: 14 } });
  const tituloP = spring({ frame: frame - 1170, fps, config: { damping: 16 } });
  const editado = frame >= 560;
  const fala = FALAS[Math.floor(Math.max(0, frame - 600) / 42) % FALAS.length];
  const edicao: Edicao | undefined = editado
    ? {
        legenda: frame >= 600 ? fala : undefined,
        arroba: frame >= 660 ? "@seu.perfil" : undefined,
        titulo: frame >= 1170 ? { kicker: "DIREITO EM 1 MINUTO", texto: "Revisão do benefício" } : undefined,
      }
    : undefined;
  const corte = interpolate(frame, [556, 560, 572], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // painel do Editar com IA
  const painelO = Math.max(janela(frame, 300, 790), janela(frame, 1050, 1240));
  const n1 = Math.round(interpolate(frame, [330, 450], [0, PEDIDO.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const n2 = Math.round(interpolate(frame, [1080, 1130], [0, PEDIDO_2.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const segundaRodada = frame >= 1050;
  const passos: Passo[] =
    frame < 510 || segundaRodada
      ? []
      : PLANO.map((texto, i) => {
          const feito = 560 + i * 60;
          return { texto, estado: frame >= feito ? "feito" : frame >= feito - 50 ? "agora" : "espera" };
        });
  const pedidoMostrado = segundaRodada ? (frame >= 1140 ? PEDIDO_2 : undefined) : frame >= 465 ? PEDIDO : undefined;
  const digitando = segundaRodada
    ? frame < 1140
      ? PEDIDO_2.slice(0, n2)
      : undefined
    : frame >= 320 && frame < 465
      ? PEDIDO.slice(0, n1)
      : undefined;
  const entrega = segundaRodada ? (frame >= 1180 ? "Versão v2 pronta" : undefined) : frame >= 770 ? "Versão v1 pronta" : undefined;
  const versoes = frame >= 1180 ? ["v1", "v2"] : ["v1"];

  // timeline e tarefas chatas (cena 2)
  const tlO = janela(frame, 160, 300);
  const pisca = 0.55 + 0.45 * Math.sin(frame / 4);

  // exportar
  const exO = janela(frame, 1236, 1410);
  const progresso = interpolate(frame, [1270, 1350], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // cena atual (legenda e aba)
  const idx = CENAS.reduce((acc, c, i) => (frame >= c.ini ? i : acc), 0);
  const cena = CENAS[idx];
  const fimO = interpolate(frame, [1400, 1420], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.fundo, fontFamily: F.ui, overflow: "hidden" }}>
      {som && <Html5Audio src={staticFile("audio/trilha-hero.mp3")} volume={0.55} />}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 50% at 50% 48%, ${C.acento}22, ${C.acento}06 50%, transparent 72%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, black 25%, transparent 80%)",
        }}
      />

      {/* abas de passos */}
      <Abas atual={cena.aba} y={P.abas.y} fonte={P.abas.fonte} o={1 - fimO} frame={frame} />

      {/* timeline com as pausas e a lista do que daria trabalho */}
      <Ator x={P.timeline.x} y={P.timeline.y} o={tlO} z={P.timeline.z}>
        <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.bordaForte}`, boxShadow: "0 30px 80px -30px rgba(0,0,0,.9)" }}>
          <Timeline
            largura={formato === "16x9" ? 700 : 760}
            duracao={20}
            trechos={[[0, 4.2], [5.4, 11], [11.9, 20]]}
            cortes={pisca > 0.5 ? [[4.2, 5.4], [11, 11.9]] : []}
            elementos={[]}
            legendas={[]}
            cursor={interpolate(frame, [150, 300], [1, 15])}
          />
        </div>
      </Ator>
      <Ator x={P.tarefas.x} y={P.tarefas.y} o={tlO}>
        <div style={{ display: "flex", gap: 14 }}>
          {[
            [Clock3, "cortar pausa"],
            [Type, "legendar"],
            [AtSign, "colocar o @"],
          ].map(([I, t], i) => {
            const Ic = I as typeof Clock3;
            const p = spring({ frame: frame - 176 - i * 18, fps, config: { damping: 18 } });
            return (
              <span key={t as string} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 999, background: C.painel2, border: `1px solid ${C.perigo}66`, color: C.texto, fontSize: 26, fontWeight: 600, whiteSpace: "nowrap", opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
                <Ic size={24} color={C.perigo} /> {t as string}
              </span>
            );
          })}
        </div>
      </Ator>

      {/* celular */}
      <Ator x={cel.x} y={cel.y} o={1 - interpolate(frame, [1395, 1412], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <Celular largura={cel.w} edicao={edicao} cru={!editado} pessoa={pessoa} entrada={{ legenda: legendaP, arroba: arrobaP, titulo: tituloP, zoom: editado ? 1 : 0 }}>
          <AbsoluteFill style={{ background: "#fff", opacity: corte }} />
        </Celular>
      </Ator>

      {/* painel Editar com IA */}
      <Ator x={P.painel.x} y={P.painel.y} o={painelO} z={P.painel.z}>
        <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.bordaForte}`, boxShadow: "0 40px 100px -30px rgba(0,0,0,.9)" }}>
          <BarraVersoes versoes={versoes} atual={versoes[versoes.length - 1]} comBotoes={false} />
          <PainelIA pedido={pedidoMostrado} digitando={digitando} passos={passos} entrega={entrega} altura={formato === "16x9" ? 440 : 420} largura={430} />
        </div>
      </Ator>

      {/* exportar */}
      <Ator x={P.modal.x} y={P.modal.y} o={exO} z={P.modal.z}>
        <ModalExportar progresso={frame < 1355 ? progresso : undefined} pronto={frame >= 1355} />
      </Ator>

      {/* assinatura */}
      <Assinatura frame={frame} formato={formato} />

      {/* legenda: sempre na tela */}
      <Legenda texto={cena.legenda} desde={cena.ini} frame={frame} y={P.legenda.y} fonte={P.legenda.fonte} largura={width} altura={height} />
    </AbsoluteFill>
  );
}

function Abas({ atual, y, fonte, o, frame }: { atual: number; y: number; fonte: number; o: number; frame: number }) {
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, opacity: o }}>
      {ABAS.map((a, i) => {
        const ativo = i === atual;
        const feito = i < atual;
        return (
          <span
            key={a}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: `${fonte * 0.4}px ${fonte * 0.8}px`,
              borderRadius: 999,
              fontSize: fonte,
              fontWeight: 600,
              color: ativo ? C.fundo : feito ? C.acento : C.mudo,
              background: ativo ? C.acento : "rgba(23,23,31,.8)",
              border: `1px solid ${ativo ? C.acento : feito ? `${C.acento}55` : C.borda}`,
              transform: ativo ? `scale(${1 + 0.03 * Math.sin(frame / 8)})` : undefined,
            }}
          >
            {feito && <Check size={fonte * 0.8} strokeWidth={3} />}
            {a}
          </span>
        );
      })}
    </div>
  );
}

/** Legenda do vídeo: palavras entram uma a uma e ficam até a próxima cena. */
function Legenda({ texto, desde, frame, y, fonte, largura }: { texto: string; desde: number; frame: number; y: number; fonte: number; largura: number; altura: number }) {
  const palavras = texto.split(" ");
  return (
    <div style={{ position: "absolute", top: y, left: 0, width: largura, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <div
        style={{
          maxWidth: largura * 0.86,
          padding: `${fonte * 0.42}px ${fonte * 0.8}px`,
          borderRadius: fonte * 0.5,
          background: "rgba(8,8,11,.82)",
          border: `1px solid ${C.borda}`,
          textAlign: "center",
          fontFamily: F.ui,
          fontWeight: 700,
          fontSize: fonte,
          lineHeight: 1.25,
          color: C.texto,
        }}
      >
        {palavras.map((p, i) => {
          const t = frame - desde - i * 2.2;
          const o = interpolate(t, [0, 6], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const destaque = /@|VOX|edita\.|pedir\.|MP4|plano|escreve/.test(p);
          return (
            <span key={`${desde}-${i}`} style={{ opacity: o, color: destaque ? C.acento : undefined }}>
              {p}
              {i < palavras.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Assinatura({ frame, formato }: { frame: number; formato: Formato }) {
  const { fps } = useVideoConfig();
  if (frame < 1405) return null;
  const a = spring({ frame: frame - 1415, fps, config: { damping: 200 } });
  const b = spring({ frame: frame - 1450, fps, config: { damping: 200 } });
  const c = spring({ frame: frame - 1485, fps, config: { damping: 200 } });
  const grande = formato === "16x9" ? 132 : 128;
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, paddingBottom: formato === "16x9" ? 80 : 160 }}>
      <div style={{ opacity: a, transform: `scale(${0.8 + 0.2 * a})` }}>
        <IconeVoxSvg tamanho={formato === "16x9" ? 120 : 150} />
      </div>
      <div style={{ fontSize: grande, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: C.texto, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>Você pede.</div>
      <div style={{ fontSize: grande, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: C.acento, opacity: b, transform: `translateY(${(1 - b) * 30}px)`, textAlign: "center" }}>O VOX edita.</div>
      <div style={{ marginTop: 18, fontSize: formato === "16x9" ? 30 : 34, color: C.texto2, opacity: c }}>Editor de vídeo com IA para Windows</div>
    </AbsoluteFill>
  );
}

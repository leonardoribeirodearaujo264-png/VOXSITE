import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { ArrowRight, Check, FileVideo, MousePointer2, Upload, Wand2 } from "lucide-react";
import { C, F } from "../tema";
import type { Edicao } from "../ui/Cena";
import {
  AvisoAtualizacao,
  BarraVersoes,
  CartaoModelo,
  Celular,
  MODELOS,
  ModalExportar,
  PainelIA,
  Pilula,
  Timeline,
  type Passo,
} from "../ui/App";

/* Dados de exemplo, coerentes entre todas as cenas. */
export const PEDIDO = "corta os silêncios, legenda jurídico premium e meu @ no topo";
export const PLANO: string[] = ["Cortar pausas e o cumprimento", "Legenda jurídico premium", "Colocar o @ no topo", "Conferir os quadros e entregar"];
export const plano = (feitos: number, agora = true): Passo[] =>
  PLANO.map((texto, i) => ({ texto, estado: i < feitos ? "feito" : i === feitos && agora ? "agora" : "espera" }));

export const EDICAO: Edicao = {
  arroba: "@seu.perfil",
  legenda: { antes: "um direito que", destaque: "pouca gente", depois: "conhece" },
  titulo: { kicker: "DIREITO EM 1 MINUTO", texto: "Revisão do benefício" },
};
export const EDICAO_NOTICIA: Edicao = {
  arroba: "@seu.perfil",
  legenda: { antes: "saiu hoje e", destaque: "muda", depois: "o seu caso" },
  card: { veiculo: "VEÍCULO DA NOTÍCIA", titulo: "A manchete que você pediu aparece aqui, com a fonte", data: "hoje" },
};

/* ------------------------------------------------------------ palco */
export function Palco({ children, style, brilho = "50% 45%" }: { children: ReactNode; style?: CSSProperties; brilho?: string }) {
  return (
    <AbsoluteFill style={{ background: C.fundo, fontFamily: F.ui, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at ${brilho}, ${C.acento}24, ${C.acento}08 45%, transparent 70%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, black 25%, transparent 80%)",
        }}
      />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}

function Chip({ children, style, forte = false }: { children: ReactNode; style?: CSSProperties; forte?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 18px",
        borderRadius: 999,
        background: forte ? C.acento : "rgba(23,23,31,.92)",
        border: `1px solid ${forte ? C.acento : C.bordaForte}`,
        color: forte ? C.fundo : C.texto,
        fontFamily: F.ui,
        fontSize: 28,
        fontWeight: 600,
        whiteSpace: "nowrap",
        boxShadow: "0 18px 40px -16px rgba(0,0,0,.8)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const Z = ({ z, children, style }: { z: number; children: ReactNode; style?: CSSProperties }) => <div style={{ zoom: z, ...style }}>{children}</div>;

/* ------------------------------------------------------------- hero */
export function Hero169() {
  return (
    <Palco brilho="38% 50%">
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 70 }}>
        <Celular largura={540} edicao={EDICAO} />
        <Z z={1.9}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.bordaForte}`, boxShadow: "0 40px 100px -30px rgba(0,0,0,.9)" }}>
            <BarraVersoes versoes={["v1"]} atual="v1" comBotoes={false} />
            <PainelIA pedido={PEDIDO} passos={plano(4, false)} entrega="Versão v1 pronta" altura={490} largura={430} />
          </div>
        </Z>
        <Chip forte style={{ left: 20, bottom: -10, fontSize: 32 }}>
          <Check size={22} strokeWidth={3} /> Pronto para postar
        </Chip>
      </div>
    </Palco>
  );
}

export function Hero916() {
  return (
    <Palco brilho="50% 35%">
      <div style={{ position: "relative", width: 1080, height: 1920 }}>
        <div style={{ position: "absolute", left: 175, top: 110 }}>
          <Celular largura={730} edicao={EDICAO} />
        </div>
        <Z z={2.05} style={{ position: "absolute", left: 50, top: 760 }}>
          <div style={{ width: 476, padding: "14px 16px", borderRadius: 16, background: "rgba(18,18,24,.96)", border: `1px solid ${C.bordaForte}`, boxShadow: "0 30px 80px -20px rgba(0,0,0,.9)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.mudo }}>
              <Wand2 size={14} color={C.acento} /> Editar com IA
            </div>
            <div style={{ marginTop: 8, fontSize: 16, lineHeight: 1.4, color: C.texto }}>{PEDIDO}</div>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PLANO.map((p) => (
                <Pilula key={p} style={{ fontSize: 11.5 }}>
                  <Check size={11} strokeWidth={3} /> {p}
                </Pilula>
              ))}
            </div>
          </div>
        </Z>
      </div>
    </Palco>
  );
}

/* ------------------------------------------------------------ passos */
export function PassoImportar() {
  return (
    <Palco>
      <div style={{ position: "relative" }}>
        <div style={{ width: 940, height: 620, borderRadius: 32, border: `3px dashed ${C.acento}`, background: `${C.acento}0D`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <span style={{ display: "grid", placeItems: "center", width: 120, height: 120, borderRadius: 999, background: C.acento }}>
            <Upload size={58} color={C.fundo} strokeWidth={2.4} />
          </span>
          <div style={{ fontSize: 56, fontWeight: 800, color: C.texto }}>Solte o vídeo aqui</div>
          <div style={{ fontSize: 30, color: C.texto2 }}>do celular, do iPhone ou da câmera</div>
        </div>
        <div style={{ position: "absolute", right: -40, top: 400, display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", borderRadius: 18, background: C.painel2, border: `1px solid ${C.bordaForte}`, transform: "rotate(-4deg)", boxShadow: "0 30px 70px -20px rgba(0,0,0,.9)" }}>
          <FileVideo size={40} color={C.acento} />
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.texto }}>gravação.mov</div>
            <div style={{ fontSize: 24, color: C.mudo }}>2 min 14 s · iPhone</div>
          </div>
          <MousePointer2 size={44} color="#fff" fill="#fff" style={{ position: "absolute", right: -24, bottom: -30 }} />
        </div>
      </div>
    </Palco>
  );
}

export function PassoPedir() {
  return (
    <Palco>
      <Z z={1.75}>
        <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.bordaForte}`, boxShadow: "0 40px 100px -30px rgba(0,0,0,.9)" }}>
          <PainelIA passos={plano(1)} pedido={PEDIDO} digitando="e um título no começo" altura={440} largura={520} custo="estimativa: US$ 0,20 a 0,60 · teto US$ 2" />
        </div>
      </Z>
    </Palco>
  );
}

export function PassoConferir() {
  return (
    <Palco brilho="35% 50%">
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Z z={1.5}>
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.bordaForte}` }}>
              <BarraVersoes versoes={["v1", "v2", "v3"]} atual="v2" comBotoes={false} />
            </div>
          </Z>
          <Celular largura={330} edicao={EDICAO} />
        </div>
        <Z z={1.45}>
          <ModalExportar pronto />
        </Z>
      </div>
    </Palco>
  );
}

/* ------------------------------------------------------------ funções */
export function FuncCortes() {
  return (
    <Palco>
      <div style={{ position: "relative" }}>
        <Z z={1.22}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.bordaForte}` }}>
            <Timeline largura={760} duracao={20} trechos={[[0, 4.2], [5.4, 11], [11.9, 20]]} cortes={[[4.2, 5.4], [11, 11.9]]} elementos={[]} cursor={8} legendas={["Hoje eu vou", "explicar", "em um minuto", "um direito", "que pouca gente", "conhece."]} />
          </div>
        </Z>
        <Chip forte style={{ left: 20, top: -96 }}>
          <Check size={28} strokeWidth={3} /> Pausas cortadas
        </Chip>
      </div>
    </Palco>
  );
}

export function FuncLegenda() {
  return (
    <Palco>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 50 }}>
        <Celular largura={300} edicao={{ legenda: EDICAO.legenda }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.16em", color: C.mudo }}>CORREÇÃO AUTOMÁTICA</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 44, fontWeight: 800 }}>
            <span style={{ color: C.perigo, textDecoration: "line-through" }}>previdensia</span>
            <ArrowRight size={32} color={C.mudo} />
            <span style={{ color: C.acento }}>previdência</span>
          </div>
          <div style={{ fontSize: 28, color: C.texto2, maxWidth: 420, lineHeight: 1.35 }}>Sai da sua fala, palavra por palavra.</div>
        </div>
      </div>
    </Palco>
  );
}

export function FuncElementos() {
  return (
    <Palco>
      <div style={{ position: "relative" }}>
        <Celular largura={350} edicao={EDICAO} />
        <Chip style={{ left: -200, top: 40 }}>seu @</Chip>
        <Chip style={{ right: -210, top: 150 }}>título</Chip>
        <Chip style={{ left: -250, top: 470 }}>legenda</Chip>
      </div>
    </Palco>
  );
}

export function FuncNoticia() {
  return (
    <Palco>
      <div style={{ position: "relative" }}>
        <Celular largura={350} edicao={EDICAO_NOTICIA} />
        <Chip forte style={{ right: -250, top: 130 }}>
          <Check size={28} strokeWidth={3} /> com a fonte
        </Chip>
        <Chip style={{ left: -250, top: 460 }}>notícia real</Chip>
      </div>
    </Palco>
  );
}

export function FuncPlano() {
  return (
    <Palco>
      <Z z={1.6}>
        <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.bordaForte}` }}>
          <PainelIA pedido={PEDIDO} passos={plano(2)} altura={430} largura={520} />
        </div>
      </Z>
    </Palco>
  );
}

export function FuncVersoes() {
  return (
    <Palco>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <Z z={1.7}>
          <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.bordaForte}` }}>
            <BarraVersoes versoes={["v1", "v2", "v3"]} atual="v3" />
          </div>
        </Z>
        <div style={{ display: "flex", gap: 34, alignItems: "flex-end" }}>
          {(["v1", "v2", "v3"] as const).map((v, i) => (
            <div key={v} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: i === 2 ? 1 : 0.6 }}>
              <Celular
                largura={i === 2 ? 230 : 190}
                brilho={i === 2}
                edicao={i === 0 ? { legenda: EDICAO.legenda } : i === 1 ? { legenda: EDICAO.legenda, arroba: "@seu.perfil" } : EDICAO}
              />
              <span style={{ fontSize: 24, fontWeight: 800, color: i === 2 ? C.acento : C.texto2 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </Palco>
  );
}

export function FuncEstilo() {
  const ref: Edicao = { legenda: { antes: "copiei o", destaque: "estilo", depois: "inteiro" } };
  return (
    <Palco>
      <div style={{ display: "flex", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ padding: 10, borderRadius: 18, background: "#fff", transform: "rotate(-5deg)", boxShadow: "0 30px 70px -20px rgba(0,0,0,.9)" }}>
            <div style={{ width: 230, filter: "hue-rotate(250deg) saturate(1.4)" }}>
              <Celular largura={230} variante="criadora" edicao={ref} brilho={false} />
            </div>
          </div>
          <span style={{ fontSize: 20, color: C.mudo }}>print de outro Reels</span>
        </div>
        <ArrowRight size={56} color={C.acento} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Celular largura={290} edicao={{ ...ref, arroba: "@seu.perfil" }} />
          <span style={{ padding: "10px 18px", borderRadius: 12, border: `1.5px solid ${C.acento}`, color: C.acento, fontSize: 20, fontWeight: 700 }}>Salvar como meu estilo</span>
        </div>
      </div>
    </Palco>
  );
}

export function FuncModelos() {
  return (
    <Palco>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 196px)", gap: 18 }}>
        {MODELOS.map((m, i) => (
          <CartaoModelo key={m.nome} {...m} largura={196} selecionado={i === 0} />
        ))}
      </div>
    </Palco>
  );
}

export function FuncMao() {
  return (
    <Palco>
      <div style={{ position: "relative" }}>
        <Z z={1.22}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.bordaForte}` }}>
            <Timeline largura={760} duracao={20} trechos={[[0, 6], [6.6, 13], [13.5, 20]]} elementos={[{ t0: 1, t1: 5, nome: "@ no topo" }, { t0: 8, t1: 12.5, nome: "título" }]} modoMao audioSolto cursor={9.2} legendas={["Hoje eu vou", "explicar", "em um minuto", "um direito", "que pouca gente", "conhece."]} />
          </div>
        </Z>
        <Chip style={{ left: 20, top: -96 }}>volume e fade no áudio</Chip>
        <Chip style={{ right: 20, bottom: -96 }}>legenda editável</Chip>
      </div>
    </Palco>
  );
}

export function FuncExportar() {
  return (
    <Palco>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <Z z={1.3}>
          <ModalExportar progresso={0.72} />
        </Z>
        <Celular largura={250} edicao={EDICAO} />
      </div>
    </Palco>
  );
}

export function FuncAtualizacao() {
  return (
    <Palco>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: F.mono, fontSize: 40, color: C.mudo }}>
          <span>1.2.2</span>
          <ArrowRight size={40} color={C.acento} />
          <span style={{ color: C.acento }}>1.2.3</span>
        </div>
        <Z z={2.1}>
          <AvisoAtualizacao />
        </Z>
      </div>
    </Palco>
  );
}

/* ------------------------------------------------------ antes e depois */
export function AntesDepois() {
  const rotulo = (t: string, cor: string) => <div style={{ fontFamily: F.mono, fontSize: 26, fontWeight: 500, letterSpacing: "0.2em", color: cor }}>{t}</div>;
  return (
    <Palco>
      <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Celular largura={420} cru brilho={false} />
          {rotulo("ANTES", C.mudo)}
        </div>
        <ArrowRight size={64} color={C.acento} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Celular largura={420} edicao={EDICAO} />
          {rotulo("DEPOIS", C.acento)}
        </div>
      </div>
    </Palco>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { C, F } from "../tema";

/** Quadro de um vídeo vertical gravado falando: escritório e personagem
 *  ilustrados (nunca rosto de pessoa real). Tudo em SVG, escala com o
 *  contêiner. Os elementos da edição vêm por cima, em unidades cqw. */
export type Variante = "advogada" | "advogado" | "criadora";

const PELE: Record<Variante, [string, string]> = {
  advogada: ["#C99273", "#A9765B"],
  advogado: ["#B98563", "#94664B"],
  criadora: ["#E0B497", "#C4967A"],
};
const ROUPA: Record<Variante, [string, string]> = {
  advogada: ["#1F2433", "#151925"],
  advogado: ["#23262E", "#17191F"],
  criadora: ["#2E6B5C", "#22524A"],
};

export function Personagem({ variante = "advogada", cru = false }: { variante?: Variante; cru?: boolean }) {
  const [pele, peleSombra] = PELE[variante];
  const [roupa, roupaSombra] = ROUPA[variante];
  const id = `p-${variante}-${cru ? "c" : "e"}`;
  return (
    <svg viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id={`${id}-parede`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={variante === "criadora" ? "#3A3F4A" : "#3B342D"} />
          <stop offset="1" stopColor={variante === "criadora" ? "#20232B" : "#1E1A16"} />
        </linearGradient>
        <linearGradient id={`${id}-janela`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1D6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F6D9A8" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id={`${id}-luz`} cx="0.72" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#FFE6BD" stopOpacity="0.28" />
          <stop offset="1" stopColor="#FFE6BD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-roupa`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={roupaSombra} />
          <stop offset="0.55" stopColor={roupa} />
          <stop offset="1" stopColor={roupaSombra} />
        </linearGradient>
        <radialGradient id={`${id}-rosto`} cx="0.62" cy="0.35" r="0.8">
          <stop offset="0" stopColor={pele} />
          <stop offset="1" stopColor={peleSombra} />
        </radialGradient>
      </defs>

      {/* parede, janela e luz */}
      <rect width="1080" height="1920" fill={`url(#${id}-parede)`} />
      <g opacity={variante === "criadora" ? 0.6 : 1}>
        <rect x="700" y="170" width="330" height="900" rx="6" fill={`url(#${id}-janela)`} />
        <rect x="860" y="170" width="10" height="900" fill="#2A241E" opacity="0.6" />
        <rect x="700" y="610" width="330" height="10" fill="#2A241E" opacity="0.6" />
      </g>
      <rect width="1080" height="1920" fill={`url(#${id}-luz)`} />

      {/* estante com livros (escritório) ou quadro e planta (criadora) */}
      {variante === "criadora" ? (
        <g>
          <rect x="70" y="330" width="300" height="380" rx="10" fill="#2F7A68" opacity="0.55" />
          <circle cx="220" cy="520" r="90" fill="#F2C14E" opacity="0.35" />
          <path d="M150 1500 C 120 1300 200 1200 260 1180 C 250 1300 300 1380 290 1500 Z" fill="#2E5B3E" />
          <path d="M260 1500 C 300 1320 380 1260 430 1250 C 400 1360 380 1440 360 1500 Z" fill="#3A7350" />
        </g>
      ) : (
        <g>
          <rect x="0" y="260" width="330" height="1150" fill="#2A2019" />
          {[420, 700, 980, 1260].map((y) => (
            <rect key={y} x="0" y={y} width="330" height="14" fill="#1A140F" />
          ))}
          {[
            [16, 300, "#6B4F3A"], [52, 320, "#3F5A4F"], [84, 290, "#7A3E3A"], [120, 310, "#C9B48A"], [150, 300, "#2F4660"], [186, 330, "#5B4A6E"], [220, 300, "#8A6B45"],
            [20, 590, "#2F4660"], [58, 600, "#C9B48A"], [92, 580, "#6B4F3A"], [130, 610, "#3F5A4F"], [168, 590, "#7A3E3A"], [204, 605, "#5B4A6E"],
            [24, 870, "#8A6B45"], [62, 880, "#2F4660"], [96, 860, "#7A3E3A"], [136, 875, "#C9B48A"], [176, 865, "#3F5A4F"],
          ].map(([x, y, cor], i) => (
            <rect key={i} x={x as number} y={y as number} width="30" height={(i % 3 === 0 ? 120 : 110) as number} rx="3" fill={cor as string} opacity="0.85" />
          ))}
        </g>
      )}

      <g transform="translate(0 70)">
      {/* cabelo de trás */}
      {variante !== "advogado" && (
        <path
          d="M372 1040 C 340 780 450 700 545 700 C 650 700 745 770 718 1040 C 732 1180 742 1290 712 1380 L 378 1380 C 350 1290 360 1170 372 1040 Z"
          fill={variante === "criadora" ? "#5A3A26" : "#2A1C15"}
        />
      )}

      </g>
      {/* corpo */}
      <path d="M120 1920 C 135 1560 290 1390 540 1360 C 790 1390 945 1560 960 1920 Z" fill={`url(#${id}-roupa)`} />
      <rect x="492" y="1200" width="96" height="190" rx="40" fill={peleSombra} />
      {variante === "criadora" ? (
        <path d="M430 1372 C 470 1430 610 1430 650 1372 L 600 1360 C 570 1395 510 1395 480 1360 Z" fill={peleSombra} opacity="0.7" />
      ) : (
        <>
          <path d="M490 1372 L 540 1500 L 590 1372 Z" fill="#ECE7DF" />
          {variante === "advogado" && <path d="M528 1395 L 552 1395 L 566 1640 L 540 1680 L 514 1640 Z" fill="#7A2E33" />}
          <path d="M455 1370 L 540 1610 L 400 1460 Z" fill={roupaSombra} opacity="0.9" />
          <path d="M625 1370 L 540 1610 L 680 1460 Z" fill={roupaSombra} opacity="0.9" />
        </>
      )}

      <g transform="translate(0 70)">
      {/* cabeça */}
      <ellipse cx="540" cy="1000" rx="148" ry="182" fill={`url(#${id}-rosto)`} />
      {/* traços simples de ilustração: olhos fechados sorrindo e boca */}
      <path d="M470 1000 Q 490 986 510 1000" stroke="#3A2418" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M570 1000 Q 590 986 610 1000" stroke="#3A2418" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M505 1085 Q 540 1112 575 1085" stroke="#7A3A30" strokeWidth="9" fill="none" strokeLinecap="round" />
      <ellipse cx="470" cy="1050" rx="26" ry="14" fill="#E07A6A" opacity="0.22" />
      <ellipse cx="610" cy="1050" rx="26" ry="14" fill="#E07A6A" opacity="0.22" />
      <ellipse cx="392" cy="1010" rx="22" ry="40" fill={peleSombra} />
      <ellipse cx="688" cy="1010" rx="22" ry="40" fill={peleSombra} />

      {/* cabelo da frente */}
      {variante === "advogado" ? (
        <path d="M394 965 C 380 840 450 790 545 790 C 640 790 705 840 690 965 C 670 900 620 870 545 872 C 470 870 415 900 394 965 Z" fill="#1F1814" />
      ) : (
        <path
          d="M392 1000 C 380 850 450 790 548 790 C 650 790 708 860 690 1000 C 660 900 600 870 520 885 C 470 895 420 930 392 1000 Z"
          fill={variante === "criadora" ? "#5A3A26" : "#2A1C15"}
        />
      )}

      </g>

      {/* mesa */}
      <rect x="0" y="1760" width="1080" height="160" fill="#16110D" />
      <rect x="0" y="1760" width="1080" height="6" fill="#3A2E24" />

      {cru && <rect width="1080" height="1920" fill="#3A3A2A" opacity="0.18" />}
    </svg>
  );
}

/** O vídeo como a pessoa recebe do VOX: personagem + legenda, @, título e card. */
export type Edicao = {
  legenda?: { antes: string; destaque?: string; depois?: string };
  arroba?: string;
  titulo?: { kicker: string; texto: string };
  card?: { veiculo: string; titulo: string; data: string };
};

export function VideoVertical({
  variante = "advogada",
  edicao,
  cru = false,
  style,
  children,
}: {
  variante?: Variante;
  edicao?: Edicao;
  cru?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "9 / 16", overflow: "hidden", containerType: "inline-size", background: "#000", ...style }}>
      <div style={{ position: "absolute", inset: 0, transform: edicao && !cru ? "scale(1.06)" : undefined }}>
        <Personagem variante={variante} cru={cru} />
      </div>
      {edicao?.arroba && (
        <div
          style={{
            position: "absolute",
            top: "6cqw",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "1.6cqw 4cqw",
            borderRadius: 999,
            background: "rgba(0,0,0,.45)",
            border: "1px solid rgba(255,255,255,.25)",
            color: "#fff",
            fontFamily: F.ui,
            fontWeight: 600,
            fontSize: "4.2cqw",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {edicao.arroba}
        </div>
      )}
      {edicao?.titulo && (
        <div
          style={{
            position: "absolute",
            top: "18cqw",
            left: "7cqw",
            right: "7cqw",
            padding: "3.4cqw 4.4cqw",
            borderRadius: "3cqw",
            background: "rgba(12,12,16,.78)",
            border: `1px solid ${C.dourado}55`,
            boxShadow: "0 2cqw 6cqw rgba(0,0,0,.35)",
          }}
        >
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: "3cqw", letterSpacing: "0.22em", color: C.dourado }}>
            {edicao.titulo.kicker}
          </div>
          <div style={{ marginTop: "1.2cqw", fontFamily: F.legenda, fontWeight: 800, fontSize: "7.4cqw", lineHeight: 1.05, color: "#fff" }}>
            {edicao.titulo.texto}
          </div>
        </div>
      )}
      {edicao?.card && (
        <div
          style={{
            position: "absolute",
            top: "18cqw",
            left: "8cqw",
            right: "8cqw",
            padding: "3.6cqw 4.4cqw",
            borderRadius: "3cqw",
            background: "rgba(16,16,22,.86)",
            border: "1px solid rgba(255,255,255,.14)",
            borderLeft: `1.2cqw solid ${C.dourado}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 700, fontSize: "2.8cqw", letterSpacing: "0.12em", color: "#fff" }}>
            <span>● {edicao.card.veiculo}</span>
            <span style={{ color: "rgba(255,255,255,.6)", fontWeight: 500 }}>{edicao.card.data}</span>
          </div>
          <div style={{ marginTop: "2cqw", fontFamily: F.ui, fontWeight: 600, fontSize: "5.6cqw", lineHeight: 1.18, color: "#fff" }}>
            {edicao.card.titulo}
          </div>
          <div style={{ marginTop: "2cqw", fontFamily: F.ui, fontSize: "2.6cqw", color: "rgba(255,255,255,.55)" }}>fonte visível no vídeo</div>
        </div>
      )}
      {edicao?.legenda && (
        <div
          style={{
            position: "absolute",
            left: "6cqw",
            right: "6cqw",
            bottom: "22cqw",
            textAlign: "center",
            fontFamily: F.legenda,
            fontWeight: 800,
            fontSize: "7.6cqw",
            lineHeight: 1.12,
            color: "#fff",
            textShadow: "0 0.5cqw 2cqw rgba(0,0,0,.65)",
          }}
        >
          {edicao.legenda.antes} {edicao.legenda.destaque && <span style={{ color: C.dourado }}>{edicao.legenda.destaque}</span>}{" "}
          {edicao.legenda.depois}
        </div>
      )}
      {children}
    </div>
  );
}

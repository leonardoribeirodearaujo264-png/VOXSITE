import type { CSSProperties, ReactNode } from "react";
import { C, F } from "../tema";

/** Quadro de um vídeo vertical gravado falando: escritório e personagem
 *  ilustrados (nunca rosto de pessoa real). Tudo em SVG, escala com o
 *  contêiner. Os elementos da edição vêm por cima, em unidades cqw. */
export type Variante = "advogada" | "advogado" | "criadora";

const PELE: Record<Variante, [string, string]> = {
  advogada: ["#C89478", "#9C6E56"],
  advogado: ["#B98563", "#94664B"],
  criadora: ["#E0B497", "#C4967A"],
};
const ROUPA: Record<Variante, [string, string]> = {
  advogada: ["#1F2433", "#151925"],
  advogado: ["#23262E", "#17191F"],
  criadora: ["#2E6B5C", "#22524A"],
};

export function Personagem({
  variante = "advogada",
  cru = false,
  abertura = 0,
  piscar = false,
  inclinar = 0,
  mover = [0, 0],
}: {
  variante?: Variante;
  cru?: boolean;
  /** boca, de 0 (fechada) a 1 (aberta), para animar a fala */
  abertura?: number;
  piscar?: boolean;
  inclinar?: number;
  mover?: [number, number];
}) {
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
        <linearGradient id={`${id}-cabelo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={variante === "criadora" ? "#6B4630" : "#3A2A20"} />
          <stop offset="1" stopColor={variante === "criadora" ? "#3E2618" : "#1A120D"} />
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

      {/* ---- pessoa: proporções adultas, traços sóbrios ---- */}
      <g transform={`translate(${mover[0]} ${mover[1] + 40})`}>
        {/* cabelo de trás */}
        {variante !== "advogado" && (
          <path
            d="M432 930 C 420 800 480 742 545 742 C 615 742 668 800 660 930 C 668 1030 678 1150 694 1292 C 655 1312 612 1302 590 1282 L 495 1282 C 470 1302 428 1312 388 1292 C 406 1150 420 1030 432 930 Z"
            fill={`url(#${id}-cabelo)`}
          />
        )}
      </g>

      {/* corpo */}
      <path
        d="M200 1920 C 205 1650 232 1452 332 1386 C 402 1346 456 1306 486 1272 L 594 1272 C 624 1306 678 1346 748 1386 C 848 1452 875 1650 880 1920 Z"
        fill={`url(#${id}-roupa)`}
      />
      <path d="M494 1130 L 494 1262 C 518 1296 562 1296 586 1262 L 586 1130 Z" fill={peleSombra} />
      <ellipse cx="540" cy="1160" rx="50" ry="24" fill="#000" opacity="0.2" />
      {variante === "criadora" ? (
        <path d="M470 1270 C 495 1320 585 1320 610 1270 L 640 1300 C 600 1350 480 1350 440 1300 Z" fill={roupaSombra} />
      ) : (
        <>
          <path d="M476 1266 L 540 1336 L 604 1266 L 562 1426 L 518 1426 Z" fill="#E9E4DB" />
          {variante === "advogado" ? (
            <>
              <path d="M470 1264 L 540 1334 L 512 1352 L 462 1290 Z" fill="#F4F1EC" />
              <path d="M610 1264 L 540 1334 L 568 1352 L 618 1290 Z" fill="#F4F1EC" />
              <path d="M528 1338 L 552 1338 L 562 1360 L 572 1560 L 540 1600 L 508 1560 L 518 1360 Z" fill="#5B2A30" />
            </>
          ) : (
            <path d="M500 1290 Q 540 1330 580 1290" stroke="#CFC8BC" strokeWidth="4" fill="none" />
          )}
          <path d="M486 1270 L 540 1424 L 504 1580 L 418 1372 C 438 1330 462 1296 486 1270 Z" fill={roupaSombra} />
          <path d="M594 1270 L 540 1424 L 576 1580 L 662 1372 C 642 1330 618 1296 594 1270 Z" fill={roupaSombra} />
          <circle cx="540" cy="1690" r="9" fill="#0E1018" />
        </>
      )}

      <g transform={`translate(${mover[0]} ${mover[1] + 40}) rotate(${inclinar} 540 1110)`}>
        {/* orelhas e rosto */}
        <ellipse cx="441" cy="948" rx="13" ry="27" fill={peleSombra} />
        <ellipse cx="639" cy="948" rx="13" ry="27" fill={peleSombra} />
        <path
          d="M440 925 C 440 830 486 790 540 790 C 594 790 640 830 640 925 C 640 1010 612 1075 575 1105 C 556 1120 524 1120 505 1105 C 468 1075 440 1010 440 925 Z"
          fill={`url(#${id}-rosto)`}
        />
        <path d="M445 960 C 452 1030 478 1080 505 1105 C 470 1085 446 1030 445 960 Z" fill="#000" opacity="0.12" />
        {/* sobrancelhas, olhos, nariz e boca: discretos */}
        <path d="M477 893 Q 498 884 521 890" stroke="#2A1C15" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M559 890 Q 582 884 603 893" stroke="#2A1C15" strokeWidth="7" fill="none" strokeLinecap="round" />
        <ellipse cx="499" cy="922" rx="12" ry={piscar ? 1.5 : 6.5} fill="#23170F" />
        <ellipse cx="581" cy="922" rx="12" ry={piscar ? 1.5 : 6.5} fill="#23170F" />
        <path d="M544 936 Q 537 984 529 994 Q 541 1001 553 995" stroke={peleSombra} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d={`M516 1040 Q 540 1033 564 1040 Q 540 ${1050 + abertura * 22} 516 1040 Z`} fill="#94564A" />
        {/* cabelo da frente */}
        {variante === "advogado" ? (
          <path d="M440 905 C 436 818 488 776 545 776 C 604 776 648 818 642 905 C 630 855 600 836 545 836 C 492 836 455 852 440 905 Z" fill={`url(#${id}-cabelo)`} />
        ) : (
          <>
            <path d="M440 930 C 432 830 486 772 548 772 C 616 772 660 826 652 930 C 640 868 612 840 568 832 C 546 870 500 902 440 930 Z" fill={`url(#${id}-cabelo)`} />
            <path d="M440 930 C 424 1050 430 1180 446 1296 L 474 1296 C 460 1180 456 1050 464 948 Z" fill={`url(#${id}-cabelo)`} />
          </>
        )}
      </g>

      {/* mesa */}
      <rect x="0" y="1760" width="1080" height="160" fill="#16110D" />
      <rect x="0" y="1760" width="1080" height="6" fill="#3A2E24" />

      {cru && <rect width="1080" height="1920" fill="#3A3A2A" opacity="0.18" />}
    </svg>
  );
}

export type PessoaAnim = { abertura?: number; piscar?: boolean; inclinar?: number; mover?: [number, number] };
export type Entrada = { titulo?: number; arroba?: number; legenda?: number; card?: number; zoom?: number };

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
  pessoa,
  entrada,
}: {
  variante?: Variante;
  edicao?: Edicao;
  cru?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
  /** animação da pessoa (fala, piscar, respirar) */
  pessoa?: PessoaAnim;
  /** entrada de cada elemento, de 0 a 1 (padrão: 1, já na tela) */
  entrada?: Entrada;
}) {
  const e = { titulo: 1, arroba: 1, legenda: 1, card: 1, zoom: 1, ...entrada };
  const surge = (p: number, dy = 6): CSSProperties => ({
    opacity: Math.min(1, Math.max(0, p)),
    translate: `0 ${(1 - Math.min(1, Math.max(0, p))) * dy}cqw`,
  });
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "9 / 16", overflow: "hidden", containerType: "inline-size", background: "#000", ...style }}>
      <div style={{ position: "absolute", inset: 0, transform: edicao && !cru ? `scale(${1 + 0.06 * e.zoom})` : undefined }}>
        <Personagem variante={variante} cru={cru} {...pessoa} />
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
            ...surge(e.arroba, -4),
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
            ...surge(e.titulo, -5),
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
            ...surge(e.card, -5),
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
            ...surge(e.legenda, 4),
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

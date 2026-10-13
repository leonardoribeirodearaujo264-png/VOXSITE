"use client";

import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from "react";
import type { PlayerRef } from "@remotion/player";
import { Volume2, VolumeX } from "lucide-react";
import capaDesktop from "@/assets/visuais/hero-16x9.webp";
import capaCelular from "@/assets/visuais/hero-9x16.webp";

const ALT =
  "Vídeo: a pessoa grava, escreve o pedido ao VOX, vê o plano em passos, recebe a versão com legenda e @, pede um ajuste e exporta o MP4.";
const VIDEO_CELULAR = "/videos/hero-9x16-video-leve.mp4";

/** Hero em vídeo. Primeiro a capa (leve, é o que pinta a tela); depois que a
 *  página carrega: no desktop, o Player do Remotion com a composição real; no
 *  celular, o MP4 leve renderizado da versão 9:16. Autoplay sem som e em loop;
 *  a legenda está dentro do vídeo, então ele se entende sem som. */
export function HeroVideo() {
  const desktop = useMidia("(min-width: 768px)");
  const semMovimento = useMidia("(prefers-reduced-motion: reduce)") === true;
  const [liberado, setLiberado] = useState(false);
  const [mudo, setMudo] = useState(true);
  const [tocando, setTocando] = useState(false);
  const [Player, setPlayer] = useState<null | { P: ComponentType<Record<string, unknown>>; Hero: ComponentType<Record<string, unknown>>; duracao: number; qps: number }>(null);
  const playerRef = useRef<PlayerRef>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // espera a página terminar de carregar antes de buscar o vídeo
  useEffect(() => {
    const liberar = () => {
      const ocioso = (window as Window & { requestIdleCallback?: (f: () => void) => void }).requestIdleCallback;
      if (ocioso) ocioso(() => setLiberado(true));
      else setTimeout(() => setLiberado(true), 300);
    };
    if (document.readyState === "complete") liberar();
    else window.addEventListener("load", liberar, { once: true });
  }, []);

  // desktop: carrega o Player e a composição só agora
  useEffect(() => {
    if (!liberado || !desktop || Player) return;
    let vivo = true;
    Promise.all([import("@remotion/player"), import("../../remotion/cenas/Hero")]).then(([p, h]) => {
      if (vivo) setPlayer({ P: p.Player as unknown as ComponentType<Record<string, unknown>>, Hero: h.Hero as ComponentType<Record<string, unknown>>, duracao: h.HERO_DURACAO, qps: h.HERO_QPS });
    });
    return () => {
      vivo = false;
    };
  }, [liberado, desktop, Player]);

  // eventos do Player
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    const play = () => setTocando(true);
    const pause = () => setTocando(false);
    p.addEventListener("play", play);
    p.addEventListener("pause", pause);
    return () => {
      p.removeEventListener("play", play);
      p.removeEventListener("pause", pause);
    };
  }, [Player]);

  const alternarSom = () => {
    const novo = !mudo;
    setMudo(novo);
    const p = playerRef.current;
    if (p) {
      if (novo) p.mute();
      else p.unmute();
      if (!p.isPlaying()) p.play();
    }
    const v = videoRef.current;
    if (v) {
      v.muted = novo;
      if (v.paused) void v.play();
    }
  };

  const { props: d } = getImageProps({ src: capaDesktop, alt: ALT, sizes: "(min-width: 1200px) 1120px, 100vw", priority: true });
  const {
    props: { srcSet: srcCelular, ...m },
  } = getImageProps({ src: capaCelular, alt: ALT, sizes: "100vw", priority: true });
  // a capa é o maior elemento da primeira tela: pede cedo, cada formato na sua largura
  preload(d.src, { as: "image", imageSrcSet: d.srcSet, imageSizes: d.sizes, fetchPriority: "high", media: "(min-width: 768px)" });
  preload(m.src, { as: "image", imageSrcSet: srcCelular, imageSizes: "100vw", fetchPriority: "high", media: "(max-width: 767px)" });
  const posterCelular = getImageProps({ src: capaCelular, alt: "", width: 828, quality: 70 }).props.src;

  return (
    <figure className="relative">
      <div className="relative overflow-hidden rounded-r4 border border-borda/80 bg-fundo">
        {/* capa: aparece na hora e fica por baixo até o vídeo tocar */}
        <picture>
          <source media="(min-width: 768px)" srcSet={d.srcSet} sizes={d.sizes} />
          <source media="(max-width: 767px)" srcSet={srcCelular} sizes="100vw" />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt vem em `m` */}
          <img {...m} className={`block h-auto w-full transition-opacity duration-700 ${tocando ? "opacity-0" : "opacity-100"}`} />
        </picture>

        {desktop && Player && (
          <div className="absolute inset-0" aria-hidden="true">
            <Player.P
              ref={playerRef}
              component={Player.Hero}
              inputProps={{ formato: "16x9", som: true }}
              durationInFrames={Player.duracao}
              fps={Player.qps}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{ width: "100%", height: "100%" }}
              autoPlay={!semMovimento}
              initiallyMuted
              loop
              controls={false}
              clickToPlay={false}
              doubleClickToFullscreen={false}
              spaceKeyToPlayOrPause={false}
            />
          </div>
        )}

        {desktop === false && liberado && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_CELULAR}
            poster={posterCelular}
            muted
            loop
            playsInline
            autoPlay={!semMovimento}
            preload="auto"
            aria-hidden="true"
            onPlaying={() => setTocando(true)}
            onPause={() => setTocando(false)}
          />
        )}

        {(Player || (desktop === false && liberado)) && (
          <button
            type="button"
            onClick={alternarSom}
            aria-pressed={!mudo}
            className="absolute right-3 top-14 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2.5 text-[14px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/85 md:bottom-5 md:right-5 md:top-auto"
          >
            {mudo ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
            {mudo ? "Ativar som" : "Tirar som"}
          </button>
        )}
      </div>
      <figcaption className="sr-only">{ALT}</figcaption>
    </figure>
  );
}

/** true/false conforme a media query; null no servidor. */
function useMidia(consulta: string): boolean | null {
  return useSyncExternalStore(
    (avisar) => {
      const m = window.matchMedia(consulta);
      m.addEventListener("change", avisar);
      return () => m.removeEventListener("change", avisar);
    },
    () => window.matchMedia(consulta).matches,
    () => null,
  );
}

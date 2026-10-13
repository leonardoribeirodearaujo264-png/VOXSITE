"use client";

import { useEffect, useRef, useState } from "react";
import { formatarTamanho, type ResultadoRelease } from "@/lib/release-formato";
import { RELEASES } from "@/lib/site";

/** O botão em si. Com a release lida, o link é o .exe direto: o navegador
 *  começa a baixar sem sair da página, e aqui aparece "Seu download começou"
 *  com o passo a passo. Sem a release, leva à página de releases. */
export function BotaoDownloadVisual({
  resultado,
  origem,
  grande = false,
}: {
  resultado: ResultadoRelease;
  origem: string;
  grande?: boolean;
}) {
  const [aviso, setAviso] = useState(false);
  const ok = resultado.ok;
  const href = ok ? resultado.release.instalador.url : RELEASES.ultima;
  const detalhe = ok
    ? `Versão ${resultado.release.versao} · ${formatarTamanho(resultado.release.instalador.bytes)}`
    : "Última versão no GitHub";
  return (
    <>
      <a
        href={href}
        data-origem={origem}
        data-fonte={ok ? "api" : "fallback"}
        onClick={() => {
          if (ok) setAviso(true);
        }}
        className={`group inline-flex items-center gap-3.5 rounded-r3 bg-acento text-fundo shadow-[0_10px_40px_-10px_rgb(46_230_166/0.6)] transition-[background-color,transform] hover:bg-[#5fedbd] active:scale-[0.98] ${
          grande ? "h-[72px] pl-6 pr-8" : "h-[60px] pl-5 pr-6"
        }`}
      >
        <IconeWindows className={grande ? "h-6 w-6" : "h-5 w-5"} />
        <span className="flex flex-col items-start leading-tight">
          <span className={`font-bold ${grande ? "text-[18px]" : "text-[16px]"}`}>Baixar para Windows</span>
          <span className="text-[12.5px] font-medium text-fundo/75">{detalhe}</span>
        </span>
      </a>
      {aviso && ok && <AvisoDownload nome={resultado.release.instalador.nome} href={href} aoFechar={() => setAviso(false)} />}
    </>
  );
}

function AvisoDownload({ nome, href, aoFechar }: { nome: string; href: string; aoFechar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  const passos = [
    <>Abra o arquivo <strong className="text-texto">{nome}</strong> quando terminar de baixar (fica na pasta Downloads).</>,
    <>Se aparecer “O Windows protegeu o computador”, clique em <strong className="text-texto">Mais informações</strong> e depois em <strong className="text-texto">Executar assim mesmo</strong>.</>,
    <>Escolha a pasta e vá em <strong className="text-texto">Avançar</strong> até <strong className="text-texto">Concluir</strong>.</>,
    <>Na primeira abertura, o VOX pergunta onde guardar os projetos e prepara os títulos e animações. Leva alguns minutos, uma vez só.</>,
  ];
  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      aria-labelledby="aviso-download-titulo"
      className="m-auto w-[min(92vw,520px)] rounded-r4 border border-borda-forte bg-painel p-0 text-left text-texto shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8" data-aviso-download>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-acento">Download iniciado</p>
            <h2 id="aviso-download-titulo" className="mt-2 text-[26px] font-extrabold leading-tight tracking-tight">
              Seu download começou
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Fechar"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-r2 border border-borda text-texto-2 hover:text-texto"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ol className="mt-6 space-y-4">
          {passos.map((p, i) => (
            <li key={i} className="flex gap-3.5 text-[15px] leading-relaxed text-texto-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-acento-tinta font-mono text-[13px] text-acento">
                {i + 1}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[14px] text-mudo">
          Não começou?{" "}
          <a href={href} className="font-semibold text-acento underline underline-offset-4">
            Baixar de novo
          </a>
        </p>
      </div>
    </dialog>
  );
}

export function IconeWindows({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M3 5.1 10.4 4v7.2H3zM11.4 3.9 21 2.5v8.7h-9.6zM3 12.2h7.4v7.2L3 18.3zM11.4 12.2H21v8.7l-9.6-1.4z" />
    </svg>
  );
}

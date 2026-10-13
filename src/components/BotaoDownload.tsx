import { buscarRelease, formatarData, formatarTamanho, type ResultadoRelease } from "@/lib/release";
import { RELEASES } from "@/lib/site";

/** Botão de download. Busca a última release no servidor (cache de 10 min).
 *  Se a API do GitHub falhar, o botão leva para a página de releases:
 *  nunca fica sem destino. */
export async function BotaoDownload({ origem, grande = false }: { origem: string; grande?: boolean }) {
  const r = await buscarRelease();
  return <BotaoDownloadVisual resultado={r} origem={origem} grande={grande} />;
}

export function BotaoDownloadVisual({
  resultado,
  origem,
  grande = false,
}: {
  resultado: ResultadoRelease;
  origem: string;
  grande?: boolean;
}) {
  const ok = resultado.ok;
  const href = ok ? resultado.release.instalador.url : RELEASES.ultima;
  const detalhe = ok
    ? `Versão ${resultado.release.versao} · ${formatarTamanho(resultado.release.instalador.bytes)}`
    : "Última versão no GitHub";
  return (
    <a
      href={href}
      data-origem={origem}
      data-fonte={ok ? "api" : "fallback"}
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
  );
}

export function IconeWindows({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M3 5.1 10.4 4v7.2H3zM11.4 3.9 21 2.5v8.7h-9.6zM3 12.2h7.4v7.2L3 18.3zM11.4 12.2H21v8.7l-9.6-1.4z" />
    </svg>
  );
}

/** Versão + data em uma linha, para textos. */
export function linhaVersao(r: ResultadoRelease): string | null {
  if (!r.ok) return null;
  return `Versão ${r.release.versao}, publicada em ${formatarData(r.release.data)}`;
}

import { RELEASES } from "@/lib/site";

/** Botão de download. Nesta etapa leva à última release do GitHub;
 *  a Etapa 2 troca por versão, tamanho e link direto do instalador. */
export function BotaoDownload({ origem }: { origem: string }) {
  return (
    <a
      href={RELEASES.ultima}
      data-origem={origem}
      className="group inline-flex h-14 items-center gap-3 rounded-r3 bg-acento pl-5 pr-6 text-fundo shadow-[0_10px_40px_-10px_rgb(46_230_166/0.6)] transition-[background-color,transform] hover:bg-[#5fedbd] active:scale-[0.98]"
    >
      <IconeWindows />
      <span className="text-[16px] font-bold">Baixar para Windows</span>
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

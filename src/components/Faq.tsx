import type { ReactNode } from "react";
import { AbrirPorEndereco } from "./AbrirPorEndereco";

export type Pergunta = { p: string; r: ReactNode; id?: string };

/** Perguntas com <details>: funciona sem JavaScript e com teclado. */
export function Faq({ itens }: { itens: Pergunta[] }) {
  return (
    <div className="revelar mt-12 divide-y divide-borda rounded-r3 border border-borda bg-painel/60">
      {itens.map((item) => (
        <details key={item.p} id={item.id} className="scroll-mt-24 px-5 sm:px-7">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-[16px] font-semibold sm:text-[17px]">
            <span>{item.p}</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="seta-faq h-5 w-5 shrink-0 text-acento transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <div className="pb-6 text-[15px] leading-relaxed text-texto-2 [&_a]:text-acento [&_a]:underline [&_p+p]:mt-3">
            {item.r}
          </div>
        </details>
      ))}
      <AbrirPorEndereco />
    </div>
  );
}

import type { ReactNode } from "react";

/** Moldura das páginas de volta do Mercado Pago (/compra/...). */
export function Resultado({ titulo, children, tom = "neutro" }: { titulo: string; children: ReactNode; tom?: "ok" | "neutro" | "erro" }) {
  const cor = tom === "ok" ? "bg-acento" : tom === "erro" ? "bg-perigo" : "bg-aviso";
  return (
    <section className="relative overflow-hidden" aria-labelledby="resultado-titulo">
      <div aria-hidden="true" className="grade-fundo pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <span aria-hidden="true" className={`mx-auto block h-3 w-3 rounded-full ${cor}`} />
        <h1 id="resultado-titulo" className="mt-6 text-balance text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[48px]">
          {titulo}
        </h1>
        <div className="mx-auto mt-6 max-w-xl space-y-4 text-[17px] leading-relaxed text-texto-2">{children}</div>
      </div>
    </section>
  );
}

export const linkAcento = "font-semibold text-acento underline underline-offset-4";
export const botaoAcento =
  "inline-flex h-[56px] items-center justify-center rounded-r3 bg-acento px-6 text-[16px] font-bold text-fundo transition-colors hover:bg-acento-escuro";

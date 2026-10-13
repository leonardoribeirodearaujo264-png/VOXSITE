import type { ReactNode } from "react";

export function Secao({
  id,
  rotulo,
  titulo,
  texto,
  children,
  className = "",
}: {
  id?: string;
  rotulo?: string;
  titulo: ReactNode;
  texto?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const idTitulo = id ? `${id}-titulo` : undefined;
  return (
    <section id={id} aria-labelledby={idTitulo} className={`scroll-mt-20 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="revelar max-w-2xl">
          {rotulo && (
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-acento">{rotulo}</p>
          )}
          <h2 id={idTitulo} className="mt-3 text-balance text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[44px]">
            {titulo}
          </h2>
          {texto && <p className="mt-5 text-pretty text-[17px] leading-relaxed text-texto-2">{texto}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

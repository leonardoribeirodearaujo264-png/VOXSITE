"use client";

import { useState } from "react";

export function Copiar({ texto, rotulo }: { texto: string; rotulo: string }) {
  const [feito, setFeito] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setFeito(true);
          setTimeout(() => setFeito(false), 1800);
        } catch {
          setFeito(false);
        }
      }}
      className="shrink-0 rounded-r1 border border-borda px-2.5 py-1.5 text-[12.5px] font-medium text-texto-2 transition-colors hover:border-borda-forte hover:text-texto"
    >
      <span aria-live="polite">{feito ? "Copiado" : rotulo}</span>
    </button>
  );
}

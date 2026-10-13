"use client";

import { useEffect } from "react";

/** Abre a pergunta cujo id está no endereço (ex.: /#chave). */
export function AbrirPorEndereco() {
  useEffect(() => {
    const abrir = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: "start" });
      }
    };
    abrir();
    window.addEventListener("hashchange", abrir);
    return () => window.removeEventListener("hashchange", abrir);
  }, []);
  return null;
}

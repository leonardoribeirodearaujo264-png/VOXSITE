"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";

export function MenuCelular() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="menu-celular"
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        onClick={() => setAberto((v) => !v)}
        className="grid h-11 w-11 place-items-center rounded-r2 border border-borda text-texto"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {aberto && (
        <nav
          id="menu-celular"
          aria-label="Principal no celular"
          className="absolute inset-x-0 top-16 border-b border-borda bg-fundo/95 px-4 pb-6 pt-2 backdrop-blur-xl"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="block rounded-r2 px-3 py-3.5 text-[16px] font-medium text-texto-2 hover:bg-painel-2 hover:text-texto"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/download"
            onClick={() => setAberto(false)}
            className="mt-3 block rounded-r2 bg-acento px-4 py-3.5 text-center text-[16px] font-semibold text-fundo"
          >
            Baixar para Windows
          </Link>
        </nav>
      )}
    </div>
  );
}

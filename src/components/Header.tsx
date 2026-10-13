import Link from "next/link";
import { Logo } from "./Logo";
import { MenuCelular } from "./MenuCelular";
import { NAV } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-borda/70 bg-fundo/80 backdrop-blur-xl">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-r2 focus:bg-acento focus:px-4 focus:py-2 focus:font-semibold focus:text-fundo"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="VOX Videos, página inicial" className="rounded-r1">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-r2 px-3 py-2 text-[14px] font-medium text-texto-2 transition-colors hover:bg-painel-2 hover:text-texto"
            >
              {item.rotulo}
            </Link>
          ))}
          <Link
            href="/download"
            className="ml-2 rounded-r2 bg-acento px-4 py-2 text-[14px] font-semibold text-fundo transition-colors hover:bg-[#5fedbd]"
          >
            Baixar
          </Link>
        </nav>
        <MenuCelular />
      </div>
    </header>
  );
}

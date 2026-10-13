import Link from "next/link";
import { Logo } from "./Logo";
import { RELEASES } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-borda/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-mudo">
            Editor de vídeo para Windows com IA. Editar com IA, powered by Claude.
          </p>
        </div>
        <nav aria-label="Produto">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-texto-2">Produto</h2>
          <ul className="mt-4 space-y-2.5 text-[14px] text-mudo">
            <li><Link className="hover:text-texto" href="/download">Download</Link></li>
            <li><Link className="hover:text-texto" href="/tutoriais">Tutoriais</Link></li>
            <li><a className="hover:text-texto" href={RELEASES.pagina}>Todas as versões</a></li>
          </ul>
        </nav>
        <nav aria-label="Informações legais">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-texto-2">Legal</h2>
          <ul className="mt-4 space-y-2.5 text-[14px] text-mudo">
            <li><Link className="hover:text-texto" href="/privacidade">Privacidade</Link></li>
            <li><Link className="hover:text-texto" href="/termos">Termos de uso</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-borda/50">
        <p className="mx-auto max-w-6xl px-4 py-6 text-[13px] leading-relaxed text-mudo sm:px-6">
          © 2026 VOX Videos. Windows é marca da Microsoft. Reels é marca da Meta. TikTok é marca da ByteDance.
        </p>
      </div>
    </footer>
  );
}

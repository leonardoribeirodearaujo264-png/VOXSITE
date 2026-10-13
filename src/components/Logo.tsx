/** O ícone do VOX (mesmo desenho do vox.ico do instalador) + o nome. */
export function IconeVox({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vox-verde" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4ade80" />
          <stop offset="1" stopColor="#1fc07a" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="#121318" />
      <rect x="59" y="62" width="17" height="132" rx="8.5" fill="url(#vox-verde)" />
      <path d="M90 62 L205 128 L90 194 Z" fill="#1fc07a" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <IconeVox />
      <span className="text-[15px] font-extrabold tracking-wide">
        VOX <span className="text-acento">VIDEOS</span>
      </span>
    </span>
  );
}

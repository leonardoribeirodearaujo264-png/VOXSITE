/** Ícone do VOX (o mesmo desenho do vox.ico do instalador). */
export function IconeVoxSvg({ tamanho = 96 }: { tamanho?: number }) {
  return (
    <svg viewBox="0 0 256 256" width={tamanho} height={tamanho} aria-hidden="true">
      <defs>
        <linearGradient id="vox-verde-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4ade80" />
          <stop offset="1" stopColor="#1fc07a" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="#121318" stroke="#2A2A36" strokeWidth="4" />
      <rect x="59" y="62" width="17" height="132" rx="8.5" fill="url(#vox-verde-r)" />
      <path d="M90 62 L205 128 L90 194 Z" fill="#1fc07a" />
    </svg>
  );
}

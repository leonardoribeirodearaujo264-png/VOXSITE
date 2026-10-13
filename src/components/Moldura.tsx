import Image, { type StaticImageData } from "next/image";

/** Print real do app dentro de uma janela discreta, com brilho verde atrás.
 *  Com `proporcao` a imagem preenche uma área fixa, presa ao topo (cards). */
export function Moldura({
  src,
  alt,
  prioridade = false,
  tamanhos = "(min-width: 1024px) 960px, 100vw",
  className = "",
  brilho = true,
  proporcao,
}: {
  src: StaticImageData;
  alt: string;
  prioridade?: boolean;
  tamanhos?: string;
  className?: string;
  brilho?: boolean;
  proporcao?: string;
}) {
  return (
    <figure className={`relative isolate ${className}`}>
      {brilho && (
        <div aria-hidden="true" className="brilho-acento pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10" />
      )}
      <div
        className="relative overflow-hidden rounded-r3 border border-borda-forte/80 bg-painel shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]"
        style={proporcao ? { aspectRatio: proporcao } : undefined}
      >
        {proporcao ? (
          <Image src={src} alt={alt} placeholder="blur" priority={prioridade} sizes={tamanhos} fill className="object-cover object-top" />
        ) : (
          <Image src={src} alt={alt} placeholder="blur" priority={prioridade} sizes={tamanhos} className="block h-auto w-full" />
        )}
      </div>
    </figure>
  );
}

import Image, { getImageProps, type StaticImageData } from "next/image";

/** Imagem feita em Remotion, com borda discreta. */
export function Quadro({
  src,
  alt,
  tamanhos,
  prioridade = false,
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  tamanhos: string;
  prioridade?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-r4 border border-borda/80 bg-fundo ${className}`}>
      <Image src={src} alt={alt} sizes={tamanhos} priority={prioridade} placeholder="blur" className="block h-auto w-full" />
    </div>
  );
}

/** Mesma cena em dois formatos: 9:16 no celular e 16:9 a partir de 768 px.
 *  O navegador baixa só a que vai usar. */
export function QuadroResponsivo({
  celular,
  desktop,
  alt,
  className = "",
}: {
  celular: StaticImageData;
  desktop: StaticImageData;
  alt: string;
  className?: string;
}) {
  const comum = { alt, priority: true, quality: 80 } as const;
  const { props: d } = getImageProps({ ...comum, src: desktop, sizes: "(min-width: 1200px) 1120px, 100vw" });
  const {
    props: { srcSet: srcCelular, ...m },
  } = getImageProps({ ...comum, src: celular, sizes: "100vw" });
  return (
    <div className={`overflow-hidden rounded-r4 border border-borda/80 bg-fundo ${className}`}>
      <picture>
        <source media="(min-width: 768px)" srcSet={d.srcSet} sizes={d.sizes} />
        <source media="(max-width: 767px)" srcSet={srcCelular} sizes="100vw" />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt vem em `m` */}
        <img {...m} className="block h-auto w-full" />
      </picture>
    </div>
  );
}

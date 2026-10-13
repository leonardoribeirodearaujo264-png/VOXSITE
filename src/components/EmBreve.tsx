import Link from "next/link";

/** Página provisória enquanto a etapa dela não chega. */
export function EmBreve({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
      <h1 className="text-[36px] font-extrabold tracking-tight sm:text-[48px]">{titulo}</h1>
      <p className="mt-5 text-[17px] leading-relaxed text-texto-2">{texto}</p>
      <Link href="/" className="mt-8 inline-block rounded-r2 border border-borda px-5 py-3 text-[15px] font-semibold hover:border-borda-forte">
        Voltar para o início
      </Link>
    </section>
  );
}

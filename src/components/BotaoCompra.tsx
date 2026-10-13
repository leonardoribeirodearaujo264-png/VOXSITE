import { LINK_COMPRA } from "@/lib/site";

/** "Comprar licença": só aparece com NEXT_PUBLIC_LINK_COMPRA preenchida. */
export function BotaoCompra() {
  if (!LINK_COMPRA) return null;
  return (
    <a
      href={LINK_COMPRA}
      className="inline-flex h-[60px] items-center rounded-r3 border border-borda-forte px-6 text-[16px] font-semibold text-texto transition-colors hover:border-acento hover:text-acento"
    >
      Comprar licença
    </a>
  );
}

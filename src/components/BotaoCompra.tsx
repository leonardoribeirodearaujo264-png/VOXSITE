import Link from "next/link";

/** Leva para /comprar (Checkout Pro do Mercado Pago, pagamento único). */
export function BotaoCompra() {
  return (
    <Link
      href="/comprar"
      className="inline-flex h-[60px] items-center rounded-r3 border border-borda-forte px-6 text-[16px] font-semibold text-texto transition-colors hover:border-acento hover:text-acento"
    >
      Comprar Vox — R$ 470,00
    </Link>
  );
}

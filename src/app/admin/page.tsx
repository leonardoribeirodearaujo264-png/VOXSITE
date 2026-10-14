import type { Metadata } from "next";
import { PainelAdmin } from "@/components/pagamento/PainelAdmin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

/** Tudo passa pelas rotas /api/admin/*, que conferem o cookie em cada pedido. */
export default function Admin() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-[30px] font-bold tracking-tight">Admin</h1>
      <PainelAdmin />
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { botaoAcento, Resultado } from "@/components/pagamento/Resultado";

export const metadata: Metadata = { title: "Pagamento não concluído", robots: { index: false, follow: false } };

export default function Falha() {
  return (
    <Resultado titulo="O pagamento não foi concluído" tom="erro">
      <p>Nada foi cobrado. Pode ter sido um dado do cartão, o limite ou a operadora. Tente de novo, com o mesmo cartão ou outra forma de pagamento.</p>
      <p className="pt-4">
        <Link href="/comprar" className={botaoAcento}>
          Tentar de novo
        </Link>
      </p>
    </Resultado>
  );
}

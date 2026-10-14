import type { Metadata } from "next";
import Link from "next/link";
import { linkAcento, Resultado } from "@/components/pagamento/Resultado";

export const metadata: Metadata = { title: "Pagamento pendente", robots: { index: false, follow: false } };

export default function Pendente() {
  return (
    <Resultado titulo="Pagamento pendente">
      <p>O Mercado Pago ainda está processando o pagamento. Assim que ele for aprovado, a chave chega no seu e-mail.</p>
      <p>Não precisa pagar de novo. Se pagou por boleto, a confirmação pode levar até 3 dias úteis.</p>
      <p>
        A chave não chegou depois da aprovação? Peça de novo na{" "}
        <Link href="/download#reenviar-chave" className={linkAcento}>
          página de download
        </Link>
        .
      </p>
    </Resultado>
  );
}

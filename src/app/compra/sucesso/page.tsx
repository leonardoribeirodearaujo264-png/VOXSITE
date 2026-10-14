import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { botaoAcento, linkAcento, Resultado } from "@/components/pagamento/Resultado";
import { banco } from "@/lib/pagamento/banco";
import { processarPagamento } from "@/lib/pagamento/webhook";

export const metadata: Metadata = { title: "Compra concluída", robots: { index: false, follow: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function texto(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v || "").trim();
}

export default function Sucesso({ searchParams }: PageProps<"/compra/sucesso">) {
  return (
    <Suspense
      fallback={
        <Resultado titulo="Conferindo o pagamento">
          <p>Um instante.</p>
        </Resultado>
      }
    >
      <Status searchParams={searchParams} />
    </Suspense>
  );
}

async function Status({ searchParams }: { searchParams: PageProps<"/compra/sucesso">["searchParams"] }) {
  const sp = await searchParams;
  const ref = texto(sp.external_reference);
  const paymentId = texto(sp.payment_id) || texto(sp.collection_id);

  let pedido: { email: string; status: string } | undefined;
  try {
    if (UUID.test(ref)) {
      const db = await banco();
      const ler = async () =>
        (await db.query<{ email: string; status: string }>(`SELECT email, status FROM pedidos WHERE id = $1`, [ref]))[0];
      pedido = await ler();
      // o aviso do Mercado Pago pode chegar depois da volta: confere direto na API oficial
      if (pedido && pedido.status !== "aprovado" && /^\d{1,30}$/.test(paymentId)) {
        await processarPagamento(paymentId).catch(() => {});
        pedido = await ler();
      }
    }
  } catch {
    pedido = undefined;
  }

  if (pedido?.status === "aprovado") {
    return (
      <Resultado titulo="Pagamento aprovado" tom="ok">
        <p>
          Sua chave foi enviada para <strong className="break-all text-texto">{pedido.email}</strong>. Se não aparecer em alguns
          minutos, olhe também o spam.
        </p>
        <p>Para ativar: abra o VOX, vá em Configuração, cole a chave e clique em Ativar.</p>
        <p className="pt-4">
          <Link href="/download" className={botaoAcento}>
            Baixar o VOX
          </Link>
        </p>
      </Resultado>
    );
  }

  return (
    <Resultado titulo="Pagamento em análise">
      <p>
        Assim que o Mercado Pago confirmar, a chave chega no seu e-mail
        {pedido ? (
          <>
            {" "}
            <strong className="break-all text-texto">{pedido.email}</strong>
          </>
        ) : null}
        . Não precisa pagar de novo.
      </p>
      <p>
        Se a chave não chegar, peça de novo na{" "}
        <Link href="/download#reenviar-chave" className={linkAcento}>
          página de download
        </Link>
        .
      </p>
    </Resultado>
  );
}

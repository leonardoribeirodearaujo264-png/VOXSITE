import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormComprar } from "@/components/pagamento/FormComprar";
import { cfg } from "@/lib/pagamento/config";

export const metadata: Metadata = {
  title: "Comprar o VOX",
  description: "Compre o VOX Videos por R$ 470,00, pagamento único pelo Mercado Pago. A chave de licença chega no seu e-mail.",
  alternates: { canonical: "/comprar" },
};

export default function Comprar() {
  const maquinas = cfg.maquinasPorLicenca;
  const itens = [
    "Pagamento único, sem assinatura e sem mensalidade.",
    `Licença vitalícia para usar em até ${maquinas} ${maquinas === 1 ? "computador" : "computadores"}.`,
    "Pagamento pelo Mercado Pago, com cartão em até 12 vezes.",
    "A chave chega no seu e-mail assim que o pagamento é aprovado.",
    "O Editar com IA usa a sua própria chave da IA, cobrada à parte pelo provedor.",
  ];
  return (
    <section className="relative overflow-hidden" aria-labelledby="comprar-titulo">
      <div aria-hidden="true" className="grade-fundo pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="font-mono text-[12.5px] uppercase tracking-[0.16em] text-acento">VOX Videos para Windows</p>
        <h1 id="comprar-titulo" className="mt-4 text-balance text-[38px] font-extrabold leading-[1.05] tracking-tight sm:text-[56px]">
          Comprar o VOX
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-texto-2">
          <span className="text-[28px] font-bold text-texto">R$ 470,00</span>
          <span className="ml-2">uma vez só</span>
        </p>

        <div className="mx-auto mt-10 max-w-md rounded-r4 border border-borda bg-painel/80 p-6 sm:p-8">
          <Suspense fallback={<div className="h-[230px]" aria-hidden="true" />}>
            <FormComprar />
          </Suspense>
        </div>

        <ul className="mx-auto mt-10 max-w-md space-y-3 text-left text-[15px] leading-relaxed text-texto-2">
          {itens.map((t) => (
            <li key={t} className="flex gap-3">
              <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-acento" />
              {t}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-[15px] text-texto-2">
          Já comprou e perdeu a chave?{" "}
          <Link href="/download#reenviar-chave" className="font-semibold text-acento underline underline-offset-4">
            Receber a chave de novo
          </Link>
        </p>
      </div>
    </section>
  );
}

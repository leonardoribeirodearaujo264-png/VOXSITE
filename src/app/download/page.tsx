import type { Metadata } from "next";
import Link from "next/link";
import { BotaoDownloadVisual } from "@/components/BotaoDownload";
import { Requisitos } from "@/components/Requisitos";
import { Copiar } from "@/components/Copiar";
import { buscarRelease, formatarData, formatarTamanho } from "@/lib/release";
import { FormReenviar } from "@/components/pagamento/FormReenviar";
import { RELEASES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Baixar para Windows",
  description: "Baixe o VOX Videos para Windows 10 e 11 (64 bits): versão, tamanho, SHA-256 e passo a passo da instalação.",
  alternates: { canonical: "/download" },
};

export default async function Download() {
  const r = await buscarRelease();
  const rel = r.ok ? r.release : null;

  const passos: { t: string; d: string; smartscreen?: boolean; link?: boolean }[] = [
    {
      t: "Baixe o instalador",
      d: rel
        ? `Clique em Baixar para Windows. O arquivo ${rel.instalador.nome} tem ${formatarTamanho(rel.instalador.bytes)}.`
        : "Clique em Baixar para Windows e, na página do GitHub, baixe o arquivo VOX-Videos-Setup terminado em .exe.",
    },
    {
      t: "Abra o instalador",
      d: "O Windows pode mostrar uma tela azul dizendo “O Windows protegeu o computador”. É normal: clique em Mais informações e depois em Executar assim mesmo.",
      smartscreen: true,
    },
    {
      t: "Siga o instalador",
      d: "Escolha a pasta (pode ser outro disco, como o D:) e vá em Avançar até Concluir. Não precisa instalar mais nada.",
    },
    {
      t: "Primeira abertura",
      d: "O VOX pergunta onde guardar os projetos e, com a sua autorização, baixa o programa dos títulos e animações. Leva alguns minutos, uma vez só.",
    },
    {
      t: "Licença e chave da IA",
      d: "Em Configuração, cole a chave de licença para liberar a exportação e a sua chave da IA para usar o Editar com IA.",
      link: true,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-borda/60" aria-labelledby="download-titulo">
        <div aria-hidden="true" className="grade-fundo pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 id="download-titulo" className="entrar text-balance text-[38px] font-extrabold leading-[1.05] tracking-tight sm:text-[56px]">
            Baixar o VOX Videos
          </h1>
          <p className="entrar-2 mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-texto-2">
            Para Windows 10 e 11. Um instalador só, com tudo dentro.
          </p>
          <div className="entrar-3 mt-10 flex justify-center">
            <BotaoDownloadVisual resultado={r} origem="download" grande />
          </div>

          {rel ? (
            <dl className="entrar-4 mx-auto mt-10 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-r3 border border-borda bg-borda text-left">
              <div className="bg-painel p-4">
                <dt className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-mudo">Versão</dt>
                <dd className="mt-1.5 text-[16px] font-semibold">{rel.versao}</dd>
              </div>
              <div className="bg-painel p-4">
                <dt className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-mudo">Publicada</dt>
                <dd className="mt-1.5 text-[16px] font-semibold">{formatarData(rel.data)}</dd>
              </div>
              <div className="bg-painel p-4">
                <dt className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-mudo">Tamanho</dt>
                <dd className="mt-1.5 text-[16px] font-semibold">{formatarTamanho(rel.instalador.bytes)}</dd>
              </div>
            </dl>
          ) : (
            <p role="status" className="entrar-4 mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-mudo">
              Não deu para ler os dados da versão agora. O botão leva para a página da última versão no GitHub.
            </p>
          )}

          <p className="mt-8 text-[15px]">
            <a href={RELEASES.pagina} className="font-semibold text-acento underline-offset-4 hover:underline">
              Todas as versões
            </a>
            <span className="mx-3 text-mudo" aria-hidden="true">·</span>
            <Link href="/comprar" className="font-semibold text-texto underline-offset-4 hover:underline">
              Comprar Vox — R$ 470,00
            </Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="instalar-titulo" className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="instalar-titulo" className="text-[30px] font-bold tracking-tight sm:text-[38px]">
            Passo a passo da instalação
          </h2>
          <ol className="mt-10 space-y-4">
            {passos.map((p, i) => (
              <li key={p.t} className="revelar flex gap-4 rounded-r3 border border-borda bg-painel/60 p-5 sm:gap-5 sm:p-6">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-acento-tinta font-mono text-[14px] font-medium text-acento">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[17px] font-semibold">{p.t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-texto-2">{p.d}</p>
                  {p.smartscreen && <SmartScreen />}
                  {p.link && (
                    <Link href="/#chave" className="mt-2 inline-block text-[15px] font-semibold text-acento underline underline-offset-4">
                      Como criar a chave da IA
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
          {rel && (
            <details className="mt-10 rounded-r3 border border-borda bg-painel/60 px-5 sm:px-6">
              <summary className="cursor-pointer py-4 text-[16px] font-semibold">Detalhes técnicos</summary>
              <div className="space-y-4 pb-6 text-[14.5px] leading-relaxed text-texto-2">
                <p>
                  Arquivo: <span className="font-mono text-texto">{rel.instalador.nome}</span>
                </p>
                {rel.sha256 && (
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-mudo">SHA-256 do instalador</p>
                      <Copiar texto={rel.sha256} rotulo="Copiar" />
                    </div>
                    <p className="mt-2 break-all font-mono text-[13px] text-texto">{rel.sha256}</p>
                  </div>
                )}
                <p>Para conferir o arquivo baixado, rode no PowerShell, na pasta Downloads, e compare com o valor acima:</p>
                <div className="flex items-center gap-2 rounded-r2 border border-borda bg-fundo p-2 pl-3">
                  <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-texto">{`Get-FileHash .\${rel.instalador.nome} -Algorithm SHA256`}</code>
                  <Copiar texto={`Get-FileHash .\${rel.instalador.nome} -Algorithm SHA256`} rotulo="Copiar" />
                </div>
              </div>
            </details>
          )}
        </div>
      </section>

      <section id="reenviar-chave" aria-labelledby="reenviar-titulo" className="scroll-mt-24 border-t border-borda/60 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="reenviar-titulo" className="text-[30px] font-bold tracking-tight sm:text-[38px]">
            Já comprou? Receber minha chave de novo
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-texto-2">
            Digite o e-mail usado na compra. Se ele comprou o VOX, mandamos a mesma chave de novo para ele.
          </p>
          <FormReenviar />
        </div>
      </section>

      <section aria-labelledby="req-titulo" className="border-t border-borda/60 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="req-titulo" className="text-[30px] font-bold tracking-tight sm:text-[38px]">
            Requisitos
          </h2>
          <Requisitos />
          <p className="mt-8 text-[15px] text-texto-2">
            Outras dúvidas estão nas{" "}
            <Link href="/#perguntas" className="text-acento underline underline-offset-4">
              perguntas frequentes
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

/** Desenho da tela do SmartScreen com os dois cliques marcados. */
function SmartScreen() {
  return (
    <figure className="mt-4">
      <div className="overflow-hidden rounded-r2 border border-[#2b5797] bg-[#1d4f91] p-5 text-white sm:p-6">
        <p className="text-[19px] font-light leading-tight sm:text-[22px]">O Windows protegeu o computador</p>
        <p className="mt-3 text-[13px] leading-relaxed text-white/85">
          O Microsoft Defender SmartScreen impediu a inicialização de um aplicativo não reconhecido.
        </p>
        <p className="mt-3 text-[13px]">
          <span className="rounded-sm underline outline outline-2 outline-offset-4 outline-acento">Mais informações</span>
          <span className="ml-3 font-mono text-[11px] text-acento">1</span>
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <span className="relative rounded-sm border border-white/70 px-4 py-1.5 text-[13px] outline outline-2 outline-offset-4 outline-acento">
            Executar assim mesmo
            <span className="absolute -right-5 -top-5 font-mono text-[11px] text-acento">2</span>
          </span>
          <span className="rounded-sm bg-white/90 px-4 py-1.5 text-[13px] text-[#1d4f91]">Não executar</span>
        </div>
      </div>
      <figcaption className="mt-2 text-[13px] text-mudo">
        O botão Executar assim mesmo só aparece depois do clique em Mais informações.
      </figcaption>
    </figure>
  );
}

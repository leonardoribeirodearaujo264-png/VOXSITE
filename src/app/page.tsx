import Link from "next/link";
import { Secao } from "@/components/Secao";
import { Moldura } from "@/components/Moldura";
import { Faq } from "@/components/Faq";
import { BotaoDownload } from "@/components/BotaoDownload";
import { Requisitos } from "@/components/Requisitos";
import { FAQ_GERAL } from "@/lib/faq";
import { CAP } from "@/lib/capturas";
import { BotaoCompra } from "@/components/BotaoCompra";
import { buscarRelease, formatarTamanho } from "@/lib/release";

const PASSOS = [
  {
    n: "01",
    titulo: "Importe o vídeo",
    texto:
      "Arraste a gravação para o VOX, inclusive vídeo do iPhone. Ele prepara uma cópia leve para o preview andar liso e guarda o original intacto para a exportação.",
    img: CAP.importar,
    alt: "Tela inicial do VOX com a área para soltar um vídeo novo e os projetos recentes.",
  },
  {
    n: "02",
    titulo: "Peça em português",
    texto:
      "Abra o Editar com IA e escreva o que quer: cortar os silêncios, pôr legenda, o seu @, um título no começo, um card com a notícia. Pedido longo vira um plano em passos que aparece na tela enquanto ele trabalha.",
    img: CAP.iaPlano,
    alt: "Gaveta Editar com IA com o pedido da pessoa e o plano em passos numerados.",
  },
  {
    n: "03",
    titulo: "Confira as versões",
    texto:
      "Cada entrega vira uma versão: v1, v2, v3. Assista no próprio VOX, peça um ajuste ou volte para qualquer versão anterior. Se preferir, abra a versão no Ajustar à mão e mexa você mesmo.",
    img: CAP.versoes,
    alt: "Barra de versões da IA com v1 e v2, o vídeo editado no centro e a linha do tempo da versão.",
  },
  {
    n: "04",
    titulo: "Exporte",
    texto: "Saia com um MP4 em 9:16, pronto para Reels e TikTok. Também exporta em 16:9 e 1:1.",
    img: CAP.exportar,
    alt: "Janela de exportação com resolução, quadros por segundo, qualidade e tempo estimado.",
  },
];

const FUNCOES = [
  {
    titulo: "Editar com IA",
    selo: "powered by Claude",
    texto:
      "Você conversa e a IA edita: corta silêncios, coloca legenda, o seu @, cards, títulos e animações. Corrige palavra que a transcrição errou e pesquisa notícia real, sempre com a fonte visível.",
    img: CAP.iaVersao,
    alt: "Conversa no Editar com IA terminando com a entrega de uma versão do vídeo.",
    destaque: true,
  },
  {
    titulo: "Plano em passos, ao vivo",
    texto:
      "Em pedidos longos a IA escreve primeiro o plano numerado e depois anuncia cada passo enquanto faz. Você acompanha tudo sem sair da tela.",
    img: CAP.iaPlano,
    alt: "Plano numerado do agente e os passos anunciados um a um.",
  },
  {
    titulo: "Versões com voltar",
    texto: "Cada pedido gera uma versão nova. Compare v1 e v2 e volte para qualquer uma sem perder nada.",
    img: CAP.versoes,
    alt: "Botões v1 e v2 na barra de versões da IA.",
  },
  {
    titulo: "Copie o estilo de um print",
    texto:
      "Mande o print de um Reels que você gostou e peça a legenda igual. A IA copia fonte, cores e posição e você salva o resultado como Meu estilo.",
    img: CAP.copiarEstilo,
    alt: "Print de outro vídeo anexado na conversa para copiar o estilo da legenda.",
  },
  {
    titulo: "Modelos e Meus estilos",
    texto: "Galeria de modelos prontos para começar rápido e os estilos que você salvou, para aplicar em outro vídeo com um clique.",
    img: CAP.modelos,
    alt: "Galeria com os modelos prontos e a seção Meus estilos.",
  },
  {
    titulo: "Ajustar à mão",
    texto:
      "Timeline com trilhas de vídeo, áudio, elementos e legenda. Desvincule o áudio, corte, mude o volume e faça fade. Mova e edite cada elemento e cada palavra da legenda.",
    img: CAP.ajustarMao,
    alt: "Modo Ajustar à mão com a timeline de vídeo, áudio, elementos e legenda.",
  },
  {
    titulo: "Importação do iPhone",
    texto: "Abre o vídeo do iPhone direto. O preview usa uma cópia leve e a exportação volta ao arquivo original.",
    img: CAP.editor,
    alt: "Editor com o vídeo importado, o preview e a timeline com miniaturas e onda do áudio.",
  },
  {
    titulo: "Exportação para Reels e TikTok",
    texto: "MP4 em 9:16, 16:9 ou 1:1, com a legenda e os elementos já no vídeo.",
    img: CAP.exportar,
    alt: "Janela de exportação do VOX pronta para gerar o MP4.",
  },
  {
    titulo: "Atualização pelo próprio app",
    texto:
      "O VOX avisa quando sai versão nova, baixa, confere o SHA-256 do instalador e atualiza. Seus projetos e configurações ficam.",
    img: CAP.atualizacao,
    alt: "Configuração do VOX na parte de atualização.",
  },
];

export default async function Inicio() {
  const r = await buscarRelease();
  const tamanho = r.ok ? formatarTamanho(r.release.instalador.bytes) : undefined;
  return (
    <>
      {/* ---------------------------------------------------------- topo */}
      <section className="relative overflow-hidden" aria-labelledby="titulo-principal">
        <div aria-hidden="true" className="grade-fundo pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="entrar inline-flex items-center gap-2 rounded-full border border-borda bg-painel/70 px-3.5 py-1.5 text-[13px] text-texto-2">
              <span className="h-1.5 w-1.5 rounded-full bg-acento" aria-hidden="true" />
              Editor de vídeo para Windows com IA
            </p>
            <h1
              id="titulo-principal"
              className="entrar-2 texto-gradiente mt-6 text-balance text-[40px] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[64px] lg:text-[76px]"
            >
              Você pede. O VOX edita o vídeo.
            </h1>
            <p className="entrar-3 mx-auto mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-texto-2 sm:text-[19px]">
              Importe a gravação, escreva o que quer em português e receba o vídeo cortado, legendado, com títulos e
              cards, pronto para Reels e TikTok.
            </p>
            <div className="entrar-3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <BotaoDownload origem="topo" />
              <Link
                href="#como-funciona"
                className="inline-flex h-14 items-center rounded-r3 px-6 text-[15px] font-semibold text-texto-2 transition-colors hover:text-texto"
              >
                Ver como funciona
              </Link>
            </div>
          </div>
          <div className="entrar-4 mx-auto mt-14 max-w-5xl sm:mt-20">
            <Moldura
              src={CAP.versoes}
              alt="O VOX com uma versão editada pela IA tocando no centro, a conversa do Editar com IA à direita e a linha do tempo embaixo."
              prioridade
              tamanhos="(min-width: 1100px) 1024px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- como funciona */}
      <Secao
        id="como-funciona"
        rotulo="Como funciona"
        titulo="Do vídeo cru ao MP4 em quatro passos"
        texto="Sem decorar ferramenta. Você descreve o resultado e o VOX faz o trabalho de edição no seu computador."
      >
        <ol className="mt-16 space-y-20 sm:space-y-28">
          {PASSOS.map((p, i) => (
            <li key={p.n} className="revelar grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                <span className="font-mono text-[13px] text-acento">{p.n}</span>
                <h3 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[30px]">{p.titulo}</h3>
                <p className="mt-4 text-pretty text-[16px] leading-relaxed text-texto-2 sm:text-[17px]">{p.texto}</p>
              </div>
              <div className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
                <Moldura
                  src={p.img}
                  alt={p.alt}
                  brilho={false}
                  className={p.img.height > p.img.width ? "mx-auto max-w-[400px]" : ""}
                  tamanhos="(min-width: 1024px) 640px, 100vw"
                />
              </div>
            </li>
          ))}
        </ol>
      </Secao>

      {/* --------------------------------------------------------- funções */}
      <Secao
        id="funcoes"
        rotulo="Funções"
        titulo="Tudo o que o VOX faz hoje"
        texto="Só está aqui o que já funciona no app. Cada imagem é um print da tela real."
        className="border-t border-borda/60"
      >
        <ul className="mt-14 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FUNCOES.map((f) => (
            <li
              key={f.titulo}
              className={`revelar flex flex-col overflow-hidden rounded-r3 border border-borda bg-painel transition-colors hover:border-borda-forte ${
                f.destaque ? "md:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className="p-6 sm:p-7">
                <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[19px] font-bold tracking-tight">
                  {f.titulo}
                  {f.selo && <span className="text-[13px] font-medium text-mudo">{f.selo}</span>}
                </h3>
                <p className="mt-3 text-pretty text-[15px] leading-relaxed text-texto-2">{f.texto}</p>
              </div>
              <div className="mt-auto px-6 pb-6 sm:px-7 sm:pb-7">
                <Moldura
                  src={f.img}
                  alt={f.alt}
                  brilho={false}
                  proporcao={f.destaque ? "16 / 11" : "16 / 10"}
                  tamanhos={
                    f.destaque
                      ? "(min-width: 1024px) 720px, 100vw"
                      : "(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </Secao>

      {/* --------------------------------------------------- antes e depois */}
      <Secao
        id="antes-e-depois"
        rotulo="Antes e depois"
        titulo="O mesmo vídeo, antes e depois do VOX"
        texto="À esquerda, a gravação como saiu do celular. À direita, a versão que a IA entregou para o pedido “edita no automático, estilo jurídico premium, com notícia real sobre a saidinha”. Rosto embaçado para preservar a pessoa."
        className="border-t border-borda/60"
      >
        <div className="revelar mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:gap-6">
          <figure>
            <Moldura src={CAP.antes} alt="Quadro do vídeo original, sem edição, com o rosto embaçado." brilho={false} tamanhos="(min-width: 768px) 380px, 50vw" />
            <figcaption className="mt-3 font-mono text-[12px] text-mudo sm:text-[13px]">ANTES · original</figcaption>
          </figure>
          <figure>
            <Moldura src={CAP.depois} alt="A versão editada pela IA tocando no VOX, com card de notícia e legenda, com o rosto embaçado." brilho={false} tamanhos="(min-width: 768px) 380px, 50vw" />
            <figcaption className="mt-3 font-mono text-[12px] text-acento sm:text-[13px]">DEPOIS · versão da IA</figcaption>
          </figure>
        </div>
      </Secao>

      {/* ------------------------------------------------------- requisitos */}
      <Secao
        id="requisitos"
        rotulo="Requisitos"
        titulo="O que o seu computador precisa"
        texto="Não precisa de placa de vídeo. O VOX é desenvolvido e testado num Intel Core i5 de 4 núcleos, de 2012, com 16 GB de memória."
        className="border-t border-borda/60"
      >
        <Requisitos tamanhoInstalador={tamanho} />
      </Secao>

      {/* -------------------------------------------------------------- FAQ */}
      <Secao id="perguntas" rotulo="Perguntas frequentes" titulo="Antes de baixar" className="border-t border-borda/60">
        <Faq itens={FAQ_GERAL} />
      </Secao>

      {/* ---------------------------------------------------- chamada final */}
      <section aria-labelledby="final-titulo" className="relative overflow-hidden border-t border-borda/60">
        <div
          aria-hidden="true"
          className="brilho-acento pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2"
        />
        <div className="revelar relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <h2 id="final-titulo" className="text-balance text-[34px] font-extrabold leading-[1.05] tracking-tight sm:text-[52px]">
            Seu próximo vídeo começa com um pedido.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-texto-2">
            Baixe o VOX para Windows, abra uma gravação e escreva o que quer.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BotaoDownload origem="final" />
            <BotaoCompra />
          </div>
        </div>
      </section>
    </>
  );
}

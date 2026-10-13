import { Briefcase, Clock3, Megaphone, MousePointerClick, Stethoscope, Type } from "lucide-react";
import { Secao } from "@/components/Secao";
import { Quadro, QuadroResponsivo } from "@/components/Quadro";
import { Faq } from "@/components/Faq";
import { BotaoDownload } from "@/components/BotaoDownload";
import { BotaoCompra } from "@/components/BotaoCompra";
import { Requisitos } from "@/components/Requisitos";
import { FAQ_GERAL } from "@/lib/faq";
import { V } from "@/lib/visuais";

const DORES = [
  { Icone: Clock3, titulo: "Horas cortando pausa", texto: "Cada “é...”, cada respiro, cada recomeço. Um por um." },
  { Icone: Type, titulo: "Legenda digitada", texto: "Palavra por palavra, depois corrigir o que o app ouviu errado." },
  { Icone: MousePointerClick, titulo: "Programa complicado", texto: "Mil botões, tutorial de uma hora, e o vídeo ainda parado." },
];

const PASSOS = [
  {
    n: "1",
    titulo: "Solte o vídeo",
    texto: "Do jeito que você gravou, no celular, no iPhone ou na câmera. Arrasta e pronto.",
    img: V.passoImportar,
    alt: "Área para soltar o vídeo com o arquivo gravação.mov sendo arrastado.",
  },
  {
    n: "2",
    titulo: "Peça o que quer",
    texto: "Em português, como pediria a um editor. O VOX mostra o plano e começa na hora.",
    img: V.passoPedir,
    alt: "Painel Editar com IA com o pedido e o plano em passos.",
  },
  {
    n: "3",
    titulo: "Confira e poste",
    texto: "Assista, peça um ajuste se quiser e exporte. O MP4 sai pronto para postar.",
    img: V.passoConferir,
    alt: "Versões v1, v2 e v3, o vídeo pronto no celular e a janela de exportação com MP4 pronto.",
  },
];

const BENEFICIOS = [
  { titulo: "Sem pausa nem “é...”", texto: "O VOX corta silêncios e o começo enrolado. Você só confere.", img: V.cortes, alt: "Timeline com as pausas marcadas para corte." },
  { titulo: "Legenda sem digitar", texto: "Sai da sua fala, palavra por palavra. Se a IA ouvir errado, corrige.", img: V.legenda, alt: "Vídeo com legenda e uma palavra corrigida." },
  { titulo: "Seu @, títulos e cards", texto: "No estilo que você escolher. A IA confere os quadros para não cobrir o seu rosto.", img: V.elementos, alt: "Vídeo com @ no topo, título e legenda com destaque." },
  { titulo: "Notícia real, com a fonte", texto: "Peça uma notícia: a IA pesquisa, confere e põe o card com a fonte na tela.", img: V.noticia, alt: "Vídeo com card de notícia e a fonte visível." },
  { titulo: "Nada se perde", texto: "Cada pedido vira uma versão. Volte para qualquer uma quando quiser.", img: V.versoes, alt: "Versões v1, v2 e v3 lado a lado." },
  { titulo: "Copie um estilo que você viu", texto: "Mande o print de um Reels e peça igual. Depois salve como Meu estilo.", img: V.estilo, alt: "Print de outro Reels ao lado do vídeo com o mesmo estilo de legenda." },
  { titulo: "Modelos prontos", texto: "Escolha um visual pronto ou um estilo seu e aplique em outro vídeo.", img: V.modelos, alt: "Galeria de modelos: Jurídico Premium, Explicativo, Notícia Urgente e outros." },
  { titulo: "Quer mexer você mesmo?", texto: "Ajuste à mão: corte, volume e fade no áudio, títulos e cada palavra da legenda.", img: V.mao, alt: "Timeline do modo Ajustar à mão com vídeo, áudio, elementos e legenda." },
  { titulo: "Pronto para postar", texto: "MP4 para Reels, TikTok e YouTube: vertical, horizontal ou quadrado.", img: V.exportar, alt: "Janela de exportação com os formatos vertical, YouTube e quadrado." },
  { titulo: "Sempre na versão nova", texto: "O VOX avisa quando há novidade e atualiza com um clique. Seus projetos ficam.", img: V.atualizacao, alt: "Aviso de versão nova disponível com o botão Atualizar." },
];

const PUBLICO = [
  { Icone: Briefcase, titulo: "Advogados", texto: "Explique um direito em um minuto e poste no mesmo dia, com legenda sóbria e o seu @." },
  { Icone: Stethoscope, titulo: "Profissionais liberais", texto: "Médicos, dentistas, psicólogos, contadores, corretores. Quem atende o dia todo e grava no intervalo." },
  { Icone: Megaphone, titulo: "Criadores", texto: "Quem grava falando toda semana e precisa de constância sem virar editor." },
];

export default function Inicio() {
  return (
    <>
      {/* ---------------------------------------------------------- topo */}
      <section className="relative overflow-hidden" aria-labelledby="titulo-principal">
        <div aria-hidden="true" className="grade-fundo pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-24 sm:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="entrar inline-flex items-center gap-2 rounded-full border border-borda bg-painel/70 px-3.5 py-1.5 text-[13px] text-texto-2">
              <span className="h-1.5 w-1.5 rounded-full bg-acento" aria-hidden="true" />
              Editor de vídeo com IA para Windows
            </p>
            <h1
              id="titulo-principal"
              className="entrar-2 texto-gradiente mt-6 text-balance text-[46px] font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-[80px] lg:text-[96px]"
            >
              Você pede. <span className="text-acento [-webkit-text-fill-color:currentColor]">O VOX edita.</span>
            </h1>
            <p className="entrar-3 mx-auto mt-6 max-w-2xl text-pretty text-[18px] leading-relaxed text-texto-2 sm:text-[20px]">
              Grave falando, escreva o que quer e receba o vídeo cortado, legendado e pronto para postar. Sem passar a
              noite editando.
            </p>
            <div className="entrar-3 mt-9 flex flex-col items-center justify-center gap-3">
              <BotaoDownload origem="topo" />
              <p className="text-[13px] text-mudo">Windows 10 e 11 · não precisa saber editar</p>
            </div>
          </div>
          <QuadroResponsivo
            celular={V.hero916}
            desktop={V.hero169}
            alt="O VOX com o pedido “corta os silêncios, legenda jurídico premium e meu @ no topo”, o plano concluído e o vídeo pronto no celular, com legenda, título e @."
            className="entrar-4 mx-auto mt-12 max-w-[440px] sm:mt-16 md:max-w-[1120px]"
          />
        </div>
      </section>

      {/* ------------------------------------------------------------ dor */}
      <Secao
        id="o-problema"
        rotulo="O problema"
        titulo="Gravar leva dois minutos. Editar leva a noite."
        texto="Você sabe que precisa postar. O que trava é a edição."
        className="border-t border-borda/60"
      >
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {DORES.map(({ Icone, titulo, texto }) => (
            <li key={titulo} className="revelar rounded-r3 border border-borda bg-painel/60 p-6 sm:p-7">
              <Icone className="h-6 w-6 text-perigo" aria-hidden="true" />
              <h3 className="mt-4 text-[19px] font-bold tracking-tight">{titulo}</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed text-texto-2">{texto}</p>
            </li>
          ))}
        </ul>
      </Secao>

      {/* -------------------------------------------------------- promessa */}
      <section aria-labelledby="promessa-titulo" className="relative overflow-hidden border-t border-borda/60 py-20 sm:py-28">
        <div aria-hidden="true" className="brilho-acento pointer-events-none absolute -right-40 top-10 h-[600px] w-[800px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="revelar">
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-acento">A solução</p>
            <h2 id="promessa-titulo" className="mt-3 text-balance text-[36px] font-extrabold leading-[1.04] tracking-tight sm:text-[52px]">
              Escreva o que quer. O VOX faz a edição.
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-texto-2 sm:text-[18px]">
              Como se estivesse falando com um editor. Ele mostra o plano, faz cada passo na sua frente e entrega o vídeo
              pronto para você conferir.
            </p>
            <blockquote className="mt-8 rounded-r3 border border-acento/30 bg-acento-tinta/60 p-5 text-[17px] leading-relaxed text-texto">
              “corta os silêncios, legenda jurídico premium e meu @ no topo”
            </blockquote>
            <p className="mt-4 text-[14px] text-mudo">Editar com IA, powered by Claude.</p>
          </div>
          <Quadro
            src={V.plano}
            alt="Painel Editar com IA mostrando o pedido e o plano: cortar pausas, legenda jurídico premium, @ no topo e conferir."
            tamanhos="(min-width: 1024px) 560px, 100vw"
            className="revelar"
          />
        </div>
      </section>

      {/* -------------------------------------------------- como funciona */}
      <Secao id="como-funciona" rotulo="Como funciona" titulo="Três passos. Nenhum é editar." className="border-t border-borda/60">
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {PASSOS.map((p) => (
            <li key={p.n} className="revelar">
              <Quadro src={p.img} alt={p.alt} tamanhos="(min-width: 768px) 380px, 100vw" />
              <div className="mt-6 flex items-baseline gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-acento font-mono text-[15px] font-medium text-fundo">
                  {p.n}
                </span>
                <h3 className="text-[23px] font-bold tracking-tight">{p.titulo}</h3>
              </div>
              <p className="mt-3 text-[16px] leading-relaxed text-texto-2">{p.texto}</p>
            </li>
          ))}
        </ol>
      </Secao>

      {/* ---------------------------------------------------- benefícios */}
      <Secao
        id="funcoes"
        rotulo="O que ele faz por você"
        titulo="Tudo o que tomava a sua noite"
        className="border-t border-borda/60"
      >
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {BENEFICIOS.map((b) => (
            <li key={b.titulo} className="revelar overflow-hidden rounded-r4 border border-borda bg-painel">
              <Quadro src={b.img} alt={b.alt} tamanhos="(min-width: 768px) 560px, 100vw" className="rounded-none border-0 border-b" />
              <div className="p-6 sm:p-7">
                <h3 className="text-[21px] font-bold tracking-tight">{b.titulo}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-texto-2">{b.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </Secao>

      {/* --------------------------------------------------- antes e depois */}
      <Secao
        id="antes-e-depois"
        rotulo="Antes e depois"
        titulo="Do vídeo cru ao vídeo pronto, com um pedido"
        texto="A mesma gravação: à esquerda como saiu do celular, à direita depois do VOX, com legenda, título e @."
        className="border-t border-borda/60"
      >
        <Quadro
          src={V.antesDepois}
          alt="Lado a lado: o vídeo cru e o mesmo vídeo editado com legenda, título e @."
          tamanhos="(min-width: 1100px) 1040px, 100vw"
          className="revelar mx-auto mt-12 max-w-[1040px]"
        />
      </Secao>

      {/* ------------------------------------------------------- para quem */}
      <Secao id="para-quem" rotulo="Para quem é" titulo="Para quem grava falando e não tem tempo de editar" className="border-t border-borda/60">
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {PUBLICO.map(({ Icone, titulo, texto }) => (
            <li key={titulo} className="revelar rounded-r3 border border-borda bg-painel/60 p-7">
              <Icone className="h-7 w-7 text-acento" aria-hidden="true" />
              <h3 className="mt-5 text-[21px] font-bold tracking-tight">{titulo}</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed text-texto-2">{texto}</p>
            </li>
          ))}
        </ul>
      </Secao>

      {/* ------------------------------------------------------- requisitos */}
      <Secao id="requisitos" rotulo="O que você precisa" titulo="Pouca coisa" className="border-t border-borda/60">
        <Requisitos />
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
          <h2 id="final-titulo" className="text-balance text-[38px] font-extrabold leading-[1.02] tracking-tight sm:text-[60px]">
            Seu próximo vídeo começa com um pedido.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[18px] leading-relaxed text-texto-2">
            Baixe o VOX, solte uma gravação e escreva o que quer.
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

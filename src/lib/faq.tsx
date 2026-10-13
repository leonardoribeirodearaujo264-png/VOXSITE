import Link from "next/link";
import type { Pergunta } from "@/components/Faq";

/** Perguntas da landing. Cada resposta foi conferida no código do app
 *  (D:\VOX-VIDEOS: TERMOS.md, backend/licenca.py, backend/remotion.py,
 *  motor/atualizacao.py, instalador/vox.iss). */
export const FAQ_GERAL: Pergunta[] = [
  {
    p: "Funciona no Mac ou no celular?",
    r: <p>Não. O VOX é um programa para Windows 10 e 11, 64 bits. O vídeo que ele exporta é que vai para o celular.</p>,
  },
  {
    p: "Preciso de internet?",
    r: (
      <>
        <p>
          Para baixar o instalador, na primeira abertura (o VOX baixa o Remotion, cerca de 220 MB) e para usar o Editar
          com IA.
        </p>
        <p>
          Importar, transcrever, cortar, legendar, ajustar à mão e exportar rodam no seu computador e não dependem da
          internet.
        </p>
      </>
    ),
  },
  {
    p: "Quanto custa usar a IA?",
    r: (
      <>
        <p>
          O Editar com IA usa uma chave de API da Anthropic que é sua. O uso é cobrado pela Anthropic direto na sua
          conta, não por nós.
        </p>
        <p>
          Antes de cada pedido o VOX mostra uma estimativa de custo e você define um teto em dólares por pedido. Depois,
          ele mostra quanto o pedido gastou.
        </p>
      </>
    ),
  },
  {
    p: "Meu vídeo é enviado para algum lugar?",
    r: (
      <>
        <p>
          O arquivo de vídeo fica no seu computador. Quando você usa o Editar com IA, vão para a Anthropic o seu pedido,
          o texto da transcrição e os quadros do vídeo que a IA confere para ver o resultado. Se você pedir uma notícia,
          a IA pesquisa na internet.
        </p>
        <p>
          Os detalhes estão na <Link href="/privacidade">política de privacidade</Link>.
        </p>
      </>
    ),
  },
  {
    p: "Preciso de licença?",
    r: (
      <p>
        Sim, para exportar. Sem chave de licença o VOX abre e edita, mas a exportação fica bloqueada. A chave vem com a
        compra e é conferida no próprio computador, sem internet.
      </p>
    ),
  },
  {
    p: "O que é o Remotion e por que ele é baixado?",
    r: (
      <>
        <p>
          É o programa que desenha os títulos, cards e animações. Ele não vem no instalador: na primeira abertura o VOX
          mostra os termos da licença do Remotion e, com o seu aceite, baixa Node.js, os pacotes do Remotion e o Chrome
          Headless Shell, cerca de 220 MB. Instalado, ocupa por volta de 450 MB.
        </p>
        <p>
          A licença do Remotion é gratuita para pessoa física e para empresas de até 3 pessoas. Empresas maiores compram
          direto da Remotion. A edição pela IA e os modelos precisam dele. O resto do editor funciona sem.
        </p>
      </>
    ),
  },
  {
    p: "O Windows mostrou um aviso ao abrir o instalador. É normal?",
    r: (
      <p>
        É. O instalador ainda não tem assinatura digital, por isso o SmartScreen avisa. Clique em{" "}
        <strong>Mais informações</strong> e depois em <strong>Executar assim mesmo</strong>. Para conferir que o arquivo
        é o original, compare o SHA-256 mostrado na <Link href="/download">página de download</Link>.
      </p>
    ),
  },
  {
    p: "Preciso de placa de vídeo?",
    r: (
      <p>
        Não. O VOX exporta pelo processador. Sem placa de vídeo dedicada, trocar o fundo atrás da pessoa é a parte mais
        lenta: pode levar alguns minutos por minuto de vídeo.
      </p>
    ),
  },
  {
    p: "Como atualizo?",
    r: (
      <p>
        Em Configuração, na parte Atualização, clique em Verificar atualização. O VOX baixa a versão nova, confere o
        SHA-256 e instala. Projetos, configurações, licença e chave de API continuam.
      </p>
    ),
  },
];

import Link from "next/link";
import type { Pergunta } from "@/components/Faq";

/** Perguntas da landing, em linguagem simples. Cada resposta foi conferida
 *  no app (D:\VOX-VIDEOS: TERMOS.md, backend/licenca.py, backend/remotion.py,
 *  motor/atualizacao.py, instalador/vox.iss). */
export const FAQ_GERAL: Pergunta[] = [
  {
    p: "Preciso saber editar vídeo?",
    r: (
      <p>
        Não. Você escreve o que quer, do jeito que pediria a um editor, e o VOX faz. Se um dia quiser mexer em algum
        detalhe, existe o modo Ajustar à mão.
      </p>
    ),
  },
  {
    p: "Funciona no Mac ou no celular?",
    r: <p>Não. O VOX é um programa para Windows 10 e 11. O vídeo pronto é que vai para o celular.</p>,
  },
  {
    id: "chave",
    p: "Como crio a minha chave da IA?",
    r: (
      <>
        <p>Leva uns 5 minutos, uma vez só:</p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5">
          <li>
            Entre em <a href="https://console.anthropic.com">console.anthropic.com</a> e crie a sua conta.
          </li>
          <li>Na parte de cobrança (Billing), coloque créditos.</li>
          <li>Na parte de chaves (API Keys), crie uma chave e copie.</li>
          <li>No VOX, abra Configuração, cole em Chave de API e salve.</li>
        </ol>
        <p>A chave fica guardada no cofre do Windows, no seu computador.</p>
      </>
    ),
  },
  {
    p: "Quanto custa usar a IA?",
    r: (
      <p>
        O uso é cobrado pela Anthropic, empresa da IA, direto na sua conta. Antes de cada pedido o VOX mostra uma
        estimativa e você define um limite de gasto por pedido. Depois, ele mostra quanto gastou.
      </p>
    ),
  },
  {
    p: "Meu vídeo vai para a internet?",
    r: (
      <>
        <p>
          O arquivo do vídeo fica no seu computador. Quando você usa o Editar com IA, a IA recebe o seu pedido, o texto
          da fala e algumas imagens do vídeo para conferir o resultado.
        </p>
        <p>
          Tudo explicado na <Link href="/privacidade">política de privacidade</Link>.
        </p>
      </>
    ),
  },
  {
    p: "Preciso de licença?",
    r: (
      <p>
        Sim, para exportar. Sem a chave de licença o VOX abre e edita, mas não exporta o vídeo. A chave vem com a
        compra.
      </p>
    ),
  },
  {
    p: "Por que a primeira abertura demora um pouco?",
    r: (
      <p>
        Na primeira vez o VOX baixa o programa que desenha os títulos, cards e animações (o Remotion, com a sua
        autorização). Leva alguns minutos e acontece uma vez só.
      </p>
    ),
  },
  {
    p: "O Windows mostrou um aviso azul ao instalar. É normal?",
    r: (
      <p>
        É. Clique em <strong>Mais informações</strong> e depois em <strong>Executar assim mesmo</strong>. O passo a
        passo com a imagem está na <Link href="/download">página de download</Link>.
      </p>
    ),
  },
  {
    p: "Como atualizo?",
    r: <p>O VOX avisa quando sai versão nova. Um clique e ele atualiza, sem mexer nos seus projetos.</p>,
  },
];

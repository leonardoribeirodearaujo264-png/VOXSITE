import { Still } from "remotion";
import * as Q from "./cenas/Quadros";

/** Quadros estáticos do site (Etapa 1). Viram WebP por scripts/render-quadros.mjs.
 *  Os vídeos (Etapas 2 a 4) entram aqui como <Composition>. */
export const QUADROS = [
  { id: "hero-16x9", componente: Q.Hero169, largura: 1920, altura: 1080 },
  { id: "hero-9x16", componente: Q.Hero916, largura: 1080, altura: 1920 },
  { id: "passo-importar", componente: Q.PassoImportar, largura: 1200, altura: 900 },
  { id: "passo-pedir", componente: Q.PassoPedir, largura: 1200, altura: 900 },
  { id: "passo-conferir", componente: Q.PassoConferir, largura: 1200, altura: 900 },
  { id: "func-cortes", componente: Q.FuncCortes, largura: 1000, altura: 750 },
  { id: "func-legenda", componente: Q.FuncLegenda, largura: 1000, altura: 750 },
  { id: "func-elementos", componente: Q.FuncElementos, largura: 1000, altura: 750 },
  { id: "func-noticia", componente: Q.FuncNoticia, largura: 1000, altura: 750 },
  { id: "func-plano", componente: Q.FuncPlano, largura: 1000, altura: 750 },
  { id: "func-versoes", componente: Q.FuncVersoes, largura: 1000, altura: 750 },
  { id: "func-estilo", componente: Q.FuncEstilo, largura: 1000, altura: 750 },
  { id: "func-modelos", componente: Q.FuncModelos, largura: 1000, altura: 750 },
  { id: "func-mao", componente: Q.FuncMao, largura: 1000, altura: 750 },
  { id: "func-exportar", componente: Q.FuncExportar, largura: 1000, altura: 750 },
  { id: "func-atualizacao", componente: Q.FuncAtualizacao, largura: 1000, altura: 750 },
  { id: "antes-depois", componente: Q.AntesDepois, largura: 1600, altura: 1100 },
] as const;

export function Raiz() {
  return (
    <>
      {QUADROS.map((q) => (
        <Still key={q.id} id={q.id} component={q.componente} width={q.largura} height={q.altura} />
      ))}
    </>
  );
}

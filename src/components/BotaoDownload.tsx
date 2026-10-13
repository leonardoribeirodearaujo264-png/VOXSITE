import { buscarRelease, formatarData, type ResultadoRelease } from "@/lib/release";
import { BotaoDownloadVisual } from "./BotaoDownloadVisual";

/** Botão de download. Busca a última release no servidor (cache de 10 min)
 *  e entrega o link direto do .exe (browser_download_url). Só se a API do
 *  GitHub falhar o botão leva para a página de releases. */
export async function BotaoDownload({ origem, grande = false }: { origem: string; grande?: boolean }) {
  const r = await buscarRelease();
  return <BotaoDownloadVisual resultado={r} origem={origem} grande={grande} />;
}

export { BotaoDownloadVisual };

/** Versão + data em uma linha, para textos. */
export function linhaVersao(r: ResultadoRelease): string | null {
  if (!r.ok) return null;
  return `Versão ${r.release.versao}, publicada em ${formatarData(r.release.data)}`;
}

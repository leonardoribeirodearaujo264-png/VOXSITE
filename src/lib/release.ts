import { cacheLife } from "next/cache";
import { RELEASES } from "./site";

export type { Release, ResultadoRelease } from "./release-formato";
export { formatarTamanho, formatarData } from "./release-formato";
import type { Release, ResultadoRelease } from "./release-formato";

/** Nome do instalador que a esteira do app publica (instalador.yml):
 *  VOX-Videos-Setup-<versão>.exe, com um .sha256 ao lado. */
const PADRAO_EXE = /^VOX-Videos-Setup-.+\.exe$/i;
const HEX64 = /\b([a-f0-9]{64})\b/i;

// Endereço da API trocável só para testar a queda (ver README).
const API = (process.env.VOX_GITHUB_API || "https://api.github.com").replace(/\/$/, "");

type Asset = { name: string; size: number; browser_download_url: string; digest?: string | null };
type RespostaGitHub = {
  tag_name: string;
  name?: string;
  published_at: string;
  html_url: string;
  draft?: boolean;
  prerelease?: boolean;
  assets: Asset[];
};

/** Busca a release na API do GitHub, com cache de 10 min no servidor.
 *  Falha também fica em cache, mas só por 1 min, para não martelar a API
 *  (o limite sem login é 60 pedidos por hora) e voltar logo quando ela voltar. */
export async function buscarRelease(): Promise<ResultadoRelease> {
  "use cache";
  try {
    const release = await consultar();
    cacheLife({ stale: 300, revalidate: 600, expire: 86400 });
    return { ok: true, release };
  } catch (e) {
    cacheLife({ stale: 30, revalidate: 60, expire: 300 });
    return { ok: false, motivo: e instanceof Error ? e.message : String(e) };
  }
}

async function consultar(): Promise<Release> {
  const cabecalhos: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "vox-site",
  };
  const r = await fetch(`${API}/repos/${RELEASES.dono}/${RELEASES.repo}/releases/latest`, {
    headers: cabecalhos,
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`GitHub respondeu ${r.status}`);
  const d = (await r.json()) as RespostaGitHub;
  if (d.draft || d.prerelease) throw new Error("a última release não é pública");

  const exe = d.assets.find((a) => PADRAO_EXE.test(a.name));
  if (!exe) throw new Error("a release não tem o instalador .exe");

  return {
    versao: d.tag_name.replace(/^v/i, ""),
    tag: d.tag_name,
    data: d.published_at,
    paginaUrl: d.html_url,
    instalador: { nome: exe.name, url: exe.browser_download_url, bytes: exe.size },
    sha256: await sha256Publicado(d.assets, exe),
  };
}

/** O SHA-256 do instalador, só se estiver publicado: primeiro o arquivo
 *  .sha256 que a esteira sobe junto; senão o digest que o GitHub registra. */
async function sha256Publicado(assets: Asset[], exe: Asset): Promise<string | null> {
  const arq = assets.find((a) => a.name.toLowerCase() === `${exe.name.toLowerCase()}.sha256`);
  if (arq) {
    try {
      const r = await fetch(arq.browser_download_url, { signal: AbortSignal.timeout(8000) });
      if (r.ok) {
        const m = (await r.text()).match(HEX64);
        if (m) return m[1].toLowerCase();
      }
    } catch {
      // cai para o digest abaixo
    }
  }
  const dig = exe.digest?.match(/^sha256:([a-f0-9]{64})$/i);
  return dig ? dig[1].toLowerCase() : null;
}


// Renderiza os quadros estáticos do Remotion (remotion/Root.tsx) em WebP,
// em src/assets/visuais/. Uso: node scripts/render-quadros.mjs [id ...]
import path from "node:path";
import { mkdirSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";

const raiz = path.resolve(import.meta.dirname, "..");
const saida = path.join(raiz, "src", "assets", "visuais");
mkdirSync(saida, { recursive: true });
const so = process.argv.slice(2);

const serveUrl = await bundle({ entryPoint: path.join(raiz, "remotion", "index.ts") });
const comps = await getCompositions(serveUrl);
for (const c of comps) {
  if (c.durationInFrames > 1) continue; // vídeos: scripts/render-videos.mjs
  if (so.length && !so.includes(c.id)) continue;
  const t = Date.now();
  await renderStill({ serveUrl, composition: c, output: path.join(saida, `${c.id}.webp`), imageFormat: "webp", overwrite: true });
  console.log(`${c.id} ${c.width}x${c.height} ${Date.now() - t} ms`);
}

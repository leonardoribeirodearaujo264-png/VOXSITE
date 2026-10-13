// Renderiza as composições de vídeo do Remotion.
// Uso: node scripts/render-videos.mjs <id> [id ...]
// Para cada id gera, em out/videos/: <id>.mp4 (H.264) e <id>.webm (VP9) em
// tamanho cheio; e em public/videos/<id>-leve.mp4 a versão leve que o site
// usa no celular (metade da resolução, CRF alto, faststart).
import path from "node:path";
import { mkdirSync, statSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const raiz = path.resolve(import.meta.dirname, "..");
const cheio = path.join(raiz, "out", "videos");
const leve = path.join(raiz, "public", "videos");
mkdirSync(cheio, { recursive: true });
mkdirSync(leve, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(raiz, "remotion", "index.ts"), publicDir: path.join(raiz, "public") });
const mb = (f) => (statSync(f).size / 1048576).toFixed(1) + " MB";

for (const id of process.argv.slice(2)) {
  const composition = await selectComposition({ serveUrl, id });
  const saidas = [
    { arquivo: path.join(cheio, `${id}.mp4`), codec: "h264", crf: 20, scale: 1 },
    { arquivo: path.join(cheio, `${id}.webm`), codec: "vp9", crf: 32, scale: 1 },
    { arquivo: path.join(leve, `${id}-leve.mp4`), codec: "h264", crf: 30, scale: 2 / 3 },
  ];
  for (const s of saidas) {
    const t = Date.now();
    let ultimo = -1;
    await renderMedia({
      serveUrl,
      composition,
      codec: s.codec,
      crf: s.crf,
      scale: s.scale,
      audioBitrate: "128k",
      outputLocation: s.arquivo,
      overwrite: true,
      concurrency: 3,
      x264Preset: s.codec === "h264" ? "slow" : undefined,
      onProgress: ({ progress }) => {
        const p = Math.floor(progress * 10);
        if (p !== ultimo) {
          ultimo = p;
          process.stdout.write(`${p * 10}% `);
        }
      },
    });
    console.log(`\n${path.basename(s.arquivo)} ${mb(s.arquivo)} em ${Math.round((Date.now() - t) / 1000)} s`);
  }
}

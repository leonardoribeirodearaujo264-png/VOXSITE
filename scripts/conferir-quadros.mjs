// Renderiza quadros soltos de uma composição para conferência visual.
// Uso: node scripts/conferir-quadros.mjs <id> <saida-dir> <quadro> [quadro ...]
import path from "node:path";
import { mkdirSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const [id, saida, ...quadros] = process.argv.slice(2);
const raiz = path.resolve(import.meta.dirname, "..");
mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(raiz, "remotion", "index.ts") });
const composition = await selectComposition({ serveUrl, id });
for (const q of quadros) {
  await renderStill({ serveUrl, composition, frame: Number(q), output: path.join(saida, `${id}-${q.padStart(4, "0")}.jpeg`), imageFormat: "jpeg", jpegQuality: 70, scale: 0.5 });
  console.log(q);
}

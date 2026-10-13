// Grava a tela do site (o topo com o vídeo tocando) em 1440 e 390 px.
// Uso: node scripts/gravar-site.mjs <saida> [url] [segundos]
import { createRequire } from "node:module";
import { mkdirSync, renameSync } from "node:fs";
import path from "node:path";

const de = process.env.PLAYWRIGHT_DE || "D:/VOX-VIDEOS/frontend/";
const { chromium } = createRequire(path.join(de, "package.json"))("playwright");
const [saida = "gravacoes", base = "http://localhost:3200", seg = "20"] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });
const telas = [
  { nome: "1440", viewport: { width: 1440, height: 900 } },
  { nome: "390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
for (const t of telas) {
  const ctx = await b.newContext({ ...t, recordVideo: { dir: saida, size: t.viewport } });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "load" });
  await p.waitForTimeout(1500);
  // desce até o vídeo ocupar a tela
  await p.locator("figure").first().evaluate((el) => el.scrollIntoView({ block: "center", behavior: "smooth" }));
  await p.waitForTimeout(Number(seg) * 1000);
  const v = p.video();
  await ctx.close();
  const destino = path.join(saida, `site-hero-${t.nome}.webm`);
  renameSync(await v.path(), destino);
  console.log(destino);
}
await b.close();

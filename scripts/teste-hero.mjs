// Confere que o vídeo do topo toca sozinho, sem som e em loop:
// 1440 px usa o Player do Remotion; 390 px usa o MP4 leve.
// Tira prints do hero em 3 momentos. Uso: node scripts/teste-hero.mjs <saida> [url]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const de = process.env.PLAYWRIGHT_DE || "D:/VOX-VIDEOS/frontend/";
const { chromium } = createRequire(path.join(de, "package.json"))("playwright");
const [saida = "prints-hero", base = "http://localhost:3200"] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });

const telas = [
  { nome: "1440", viewport: { width: 1440, height: 900 } },
  { nome: "390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
let falhas = 0;
const navegador = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
for (const t of telas) {
  const ctx = await navegador.newContext(t);
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "load" });
  const fig = p.locator("figure").first();
  await fig.scrollIntoViewIfNeeded();
  await p.waitForTimeout(4000);
  const tiros = [];
  for (const [i, espera] of [[1, 0], [2, 9000], [3, 9000]]) {
    await p.waitForTimeout(espera);
    const arq = path.join(saida, `hero-${t.nome}-${i}.png`);
    tiros.push(await fig.screenshot({ path: arq }));
  }
  const mudou = !tiros[0].equals(tiros[1]) && !tiros[1].equals(tiros[2]);
  const info = await p.evaluate(() => {
    const v = document.querySelector("figure video");
    const player = document.querySelector("figure .__remotion-player");
    const btn = [...document.querySelectorAll("figure button")].find((b) => /som/i.test(b.textContent || ""));
    return {
      modo: v ? "mp4" : player ? "player" : "nenhum",
      tempo: v ? Number(v.currentTime.toFixed(1)) : null,
      pausado: v ? v.paused : null,
      mudo: v ? v.muted : null,
      loop: v ? v.loop : null,
      botao: btn?.textContent ?? null,
    };
  });
  const ok = mudou && info.modo !== "nenhum" && info.botao === "Ativar som" && (info.modo === "player" || (!info.pausado && info.mudo && info.loop && info.tempo > 5));
  if (!ok) falhas++;
  console.log(`${ok ? "OK   " : "FALHA"} ${t.nome}px`, JSON.stringify({ ...info, quadros_mudando: mudou }));
  await ctx.close();
}
await navegador.close();
process.exit(falhas ? 1 : 0);

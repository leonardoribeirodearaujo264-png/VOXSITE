// Prints de página inteira em celular (390 px) e desktop (1440 px).
// Uso: node scripts/prints.mjs <pasta-de-saida> [url-base] [rotas...]
// O Playwright vem de PLAYWRIGHT_DE (pasta com node_modules/playwright),
// para não pesar no site.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const de = process.env.PLAYWRIGHT_DE || "D:/VOX-VIDEOS/frontend/";
const { chromium } = createRequire(path.join(de, "package.json"))("playwright");

const [saida = "prints", base = "http://localhost:3200", ...resto] = process.argv.slice(2);
const rotas = resto.length ? resto : ["/", "/download", "/tutoriais", "/privacidade", "/termos"];
const telas = [
  { nome: "celular-390", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { nome: "desktop-1440", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
];

mkdirSync(saida, { recursive: true });
const navegador = await chromium.launch();
for (const t of telas) {
  const ctx = await navegador.newContext({ ...t, reducedMotion: "reduce" });
  const pagina = await ctx.newPage();
  for (const rota of rotas) {
    await pagina.goto(base + rota, { waitUntil: "networkidle" });
    // força as imagens preguiçosas a carregar antes do print
    await pagina.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await pagina.waitForTimeout(500);
    const nome = (rota === "/" ? "inicio" : rota.replace(/\//g, "-").replace(/^-/, "")) + `-${t.nome}.png`;
    await pagina.screenshot({ path: path.join(saida, nome), fullPage: true });
    console.log(nome);
  }
  await ctx.close();
}
await navegador.close();

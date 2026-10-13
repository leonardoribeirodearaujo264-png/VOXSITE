// Clica em "Baixar para Windows" em 1440 px e 390 px e confere que o
// navegador começa a baixar o .exe direto (evento de download), sem sair da
// página, e que aparece "Seu download começou". Cancela o download logo em
// seguida (o arquivo tem ~700 MB).
// Uso: node scripts/teste-download.mjs [url-base]
import { createRequire } from "node:module";
import path from "node:path";

const de = process.env.PLAYWRIGHT_DE || "D:/VOX-VIDEOS/frontend/";
const { chromium } = createRequire(path.join(de, "package.json"))("playwright");
const base = process.argv[2] || "http://localhost:3200";

const telas = [
  { nome: "1440", viewport: { width: 1440, height: 900 } },
  { nome: "390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
let falhas = 0;
const navegador = await chromium.launch();
for (const t of telas) {
  for (const rota of ["/", "/download"]) {
    const ctx = await navegador.newContext({ ...t, acceptDownloads: true });
    const pagina = await ctx.newPage();
    await pagina.goto(base + rota, { waitUntil: "networkidle" });
    const botao = pagina.locator("a[data-origem]").first();
    const fonte = await botao.getAttribute("data-fonte");
    const href = await botao.getAttribute("href");
    const antes = pagina.url();
    const [dl] = await Promise.all([pagina.waitForEvent("download", { timeout: 30000 }), botao.click()]);
    const nome = dl.suggestedFilename();
    const aviso = await pagina.locator("[data-aviso-download]").isVisible();
    const mesmaPagina = pagina.url() === antes;
    await dl.cancel();
    const ok = fonte === "api" && /^VOX-Videos-Setup-.+\.exe$/i.test(nome) && aviso && mesmaPagina;
    if (!ok) falhas++;
    console.log(`${ok ? "OK   " : "FALHA"} ${t.nome}px ${rota}: arquivo=${nome} aviso=${aviso} mesma_pagina=${mesmaPagina} fonte=${fonte}`);
    console.log(`      href=${href}`);
    await ctx.close();
  }
}
await navegador.close();
process.exit(falhas ? 1 : 0);

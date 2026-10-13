// Falha se qualquer imagem, vídeo ou capa (poster) do site der erro.
// Abre cada página em 390 px e 1440 px, rola até o fim (carrega as
// preguiçosas), confere cada <img> (carregou e tem largura), cada <video>
// (src e poster respondem 200) e qualquer resposta de mídia com erro.
// Uso: node scripts/teste-imagens.mjs [url-base]
import { createRequire } from "node:module";
import path from "node:path";

const de = process.env.PLAYWRIGHT_DE || "D:/VOX-VIDEOS/frontend/";
const { chromium } = createRequire(path.join(de, "package.json"))("playwright");
const base = process.argv[2] || "http://localhost:3200";
const rotas = ["/", "/download", "/tutoriais", "/privacidade", "/termos"];
const telas = [
  { nome: "390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { nome: "1440", viewport: { width: 1440, height: 900 } },
];

let problemas = 0;
let conferidos = 0;
const navegador = await chromium.launch();
for (const t of telas) {
  const ctx = await navegador.newContext(t);
  for (const rota of rotas) {
    const pagina = await ctx.newPage();
    const erros = [];
    pagina.on("response", (r) => {
      const tipo = r.request().resourceType();
      if (["image", "media"].includes(tipo) && r.status() >= 400) erros.push(`${r.status()} ${r.url()}`);
    });
    pagina.on("requestfailed", (r) => {
      if (["image", "media"].includes(r.resourceType())) erros.push(`falhou ${r.url()} (${r.failure()?.errorText})`);
    });
    const resp = await pagina.goto(base + rota, { waitUntil: "networkidle" });
    if (!resp || resp.status() >= 400) erros.push(`página ${rota} respondeu ${resp?.status()}`);
    await pagina.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await pagina.waitForLoadState("networkidle");
    const r = await pagina.evaluate(async () => {
      const ruins = [];
      const imgs = [...document.querySelectorAll("img")];
      for (const img of imgs) {
        if (!img.complete) await new Promise((ok) => { img.onload = img.onerror = ok; setTimeout(ok, 8000); });
        if (!img.naturalWidth) ruins.push(`img sem imagem: ${img.currentSrc || img.src} (alt="${img.alt}")`);
      }
      const midias = [...document.querySelectorAll("video")].flatMap((v) => [v.poster, v.currentSrc || v.src, ...[...v.querySelectorAll("source")].map((s) => s.src)]).filter(Boolean);
      for (const url of midias) {
        try {
          const resp = await fetch(url, { method: "HEAD" });
          if (!resp.ok) ruins.push(`mídia ${resp.status}: ${url}`);
        } catch (e) {
          ruins.push(`mídia falhou: ${url}`);
        }
      }
      return { ruins, total: imgs.length + midias.length };
    });
    conferidos += r.total;
    const todos = [...erros, ...r.ruins];
    problemas += todos.length;
    console.log(`${todos.length ? "FALHA" : "OK   "} ${t.nome}px ${rota}: ${r.total} imagens/mídias`);
    for (const e of todos) console.log("      " + e);
    await pagina.close();
  }
  await ctx.close();
}
await navegador.close();
console.log(`${conferidos} conferidos, ${problemas} problema(s)`);
process.exit(problemas ? 1 : 0);

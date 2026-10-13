// Lighthouse no celular, N rodadas, mostra cada uma e a mediana.
// Uso: node scripts/lighthouse.mjs [url] [rodadas] [pasta-de-saida]
// Usa o Chromium do Playwright (CHROME_PATH) e a versão fixa do Lighthouse.
// LH_CONFIG=<arquivo> troca a configuração (ex.: lr-mobile-config.js, a do PageSpeed Insights).
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const [url = "http://localhost:3200/", rodadas = "3", saida = "D:/VOX-SITE-prints/lighthouse"] = process.argv.slice(2);
const de = process.env.PLAYWRIGHT_DE || "D:/VOX-VIDEOS/frontend/";
const { chromium } = createRequire(path.join(de, "package.json"))("playwright");
process.env.CHROME_PATH = chromium.executablePath();
mkdirSync(saida, { recursive: true });

const notas = [];
for (let i = 1; i <= Number(rodadas); i++) {
  const arq = path.join(saida, `lh-${i}.json`);
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["--yes", "lighthouse@12.8.2", url, "--only-categories=performance,accessibility,best-practices,seo", ...(process.env.LH_CONFIG ? [`--config-path=${process.env.LH_CONFIG}`] : ["--form-factor=mobile"]), "--chrome-flags=--headless=new", "--output=json", `--output-path=${arq}`, "--quiet"],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  const r = JSON.parse(readFileSync(arq, "utf8"));
  const c = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const m = (a) => r.audits[a].displayValue;
  notas.push(c.performance);
  console.log(`rodada ${i}: desempenho ${c.performance}, acessibilidade ${c.accessibility}, boas práticas ${c["best-practices"]}, SEO ${c.seo} | LCP ${m("largest-contentful-paint")}, TBT ${m("total-blocking-time")}, CLS ${m("cumulative-layout-shift")}, FCP ${m("first-contentful-paint")}`);
}
notas.sort((a, b) => a - b);
console.log(`mediana do desempenho: ${notas[Math.floor(notas.length / 2)]}`);

# vox-site

Site oficial do VOX Videos (landing, tutoriais, download). Next.js (App Router) + TypeScript + Tailwind, hospedado na Vercel. Sem backend próprio e sem segredos no código.

## Rodar

```
npm ci
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Prints do app

`capturas/` tem os prints reais do app, já com rosto e @ da pessoa embaçados (os originais ficam fora do repositório). `python -I scripts/preparar-capturas.py` gera os WebP em `src/assets/capturas/`.

`node scripts/prints.mjs <saida> http://localhost:3200` tira prints de página inteira em 390 px e 1440 px (usa o Playwright de `PLAYWRIGHT_DE`).

# vox-site

Site oficial do VOX Videos (landing, tutoriais, download). Next.js (App Router) + TypeScript + Tailwind, hospedado na Vercel. Sem backend próprio e sem segredos no código.

## Rodar

```
npm ci
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Visuais (Remotion)

Todo visual do site sai das composições em `remotion/`: as telas do app são recriadas como componentes (`remotion/ui`) com as cores e a fonte do frontend do VOX, e as pessoas são personagens ilustrados. Nenhum print do app.

- `node scripts/render-quadros.mjs [id ...]`: renderiza os quadros estáticos em `src/assets/visuais/*.webp`.
- `npx remotion studio remotion/index.ts`: abre o editor do Remotion para ver as cenas.

## Testes

- `node scripts/teste-imagens.mjs http://localhost:3200`: falha se qualquer imagem, vídeo ou capa der erro (390 e 1440 px).
- `node scripts/teste-download.mjs http://localhost:3200`: clica em "Baixar para Windows" e exige o download direto do .exe.
- `node scripts/prints.mjs <saida> http://localhost:3200`: prints de página inteira em 390 e 1440 px.

Os scripts usam o Playwright de `PLAYWRIGHT_DE` (padrão: `D:/VOX-VIDEOS/frontend/`).

## Narração

A voz dos vídeos é gerada localmente com o **Kokoro TTS** (modelo Kokoro-82M, licença Apache 2.0, de hexgrad), rodando por `kokoro-onnx` (MIT), instalado fora deste repositório. Só os MP3 gerados entram aqui (`narracao/`). Roteiros em `narracao/roteiros.md`.

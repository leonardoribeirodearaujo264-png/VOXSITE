# vox-site

Site oficial do VOX Videos (landing, tutoriais, download e venda da licença). Next.js (App Router) + TypeScript + Tailwind, hospedado na Vercel. Nenhum segredo no código: tudo vem de variáveis de ambiente (veja `.env.example`).

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

- `npm test`: pagamento e licença (vitest, Postgres PGlite em memória, Mercado Pago e Resend falsos). Não usa rede nem segredo real.
- `node scripts/teste-imagens.mjs http://localhost:3200`: falha se qualquer imagem, vídeo ou capa der erro (390 e 1440 px).
- `node scripts/teste-download.mjs http://localhost:3200`: clica em "Baixar para Windows" e exige o download direto do .exe.
- `node scripts/prints.mjs <saida> http://localhost:3200`: prints de página inteira em 390 e 1440 px.

Os scripts usam o Playwright de `PLAYWRIGHT_DE` (padrão: `D:/VOX-VIDEOS/frontend/`).

## Narração

A voz dos vídeos é gerada localmente com o **Kokoro TTS** (modelo Kokoro-82M, licença Apache 2.0, de hexgrad), rodando por `kokoro-onnx` (MIT), instalado fora deste repositório. Só os MP3 gerados entram aqui (`narracao/`). Roteiros em `narracao/roteiros.md`.

## Pagamento e licença

O VOX custa **R$ 470,00, pagamento único** (sem assinatura), pelo **Checkout Pro do Mercado Pago**. A licença chega por e-mail.

### Fluxo

1. `/comprar` (o app abre `/comprar?email=...`): a pessoa digita o e-mail e clica em "Comprar Vox — R$ 470,00".
2. `POST /api/checkout` valida o e-mail (formato e domínios descartáveis), aplica o limite (5 por hora e 20 por dia, por IP e por e-mail) e:
   - se o e-mail já tem licença ativa, **não cobra**: reenvia a chave e responde `ja_comprou`;
   - se há pedido aberto do mesmo e-mail nas últimas 2 h, reusa o mesmo link (evita pagar duas vezes);
   - senão cria o pedido e a preferência (preço fixo no servidor, `X-Idempotency-Key` = id do pedido) e manda a pessoa para o Mercado Pago.
3. O Mercado Pago avisa em `POST /api/webhooks/mercadopago`. A assinatura (`x-signature`) é conferida com `MP_WEBHOOK_SECRET`; inválida = 401. O pagamento é sempre **consultado na API oficial** e só libera com `approved`, R$ 470,00, BRL e um pedido nosso em `external_reference`. Cada aviso é processado uma vez só (`payment:<id>:<status>`): uma licença, um e-mail. Estorno ou chargeback revogam a licença. Erro nosso = 500, e o Mercado Pago tenta de novo.
4. A volta do Mercado Pago cai em `/compra/sucesso`, `/compra/pendente` ou `/compra/falha`. A de sucesso também confere o pagamento na API, caso o aviso ainda não tenha chegado.
5. O e-mail (Resend) leva a chave, a ativação em 3 passos, o link de download e os tutoriais.

A chave é `VOX-` + base32(dados) + `-` + base32(HMAC-SHA256(VOX_SEGREDO_LICENCA, dados)[:10]), com dados = `{"c": e-mail, "m": máquinas, "v": null}`: a mesma conta que o app faz offline. Mesmo e-mail, mesma chave. **`VOX_SEGREDO_LICENCA` tem de ser igual ao do app.**

### Rotas usadas pelo app

- `POST /api/licenca/validar` `{chave, maquina, versao_app}`: `{ok:true, status:"ativa", maquinas, usadas}` ou `{ok:false, motivo}` (`revogada`, `inexistente`, `limite_maquinas`, `chave_invalida`). Falha nossa = 5xx (o app trata como sem internet e não desativa).
- `POST /api/licenca/reenviar` `{email}`: sempre a mesma resposta genérica (não revela se o e-mail comprou); 400 e-mail inválido, 429 limite. Na página `/download` há o mesmo pedido ("Já comprou? Receber minha chave de novo").
- `POST /api/licenca`: licença grátis, só com `EXIGIR_PAGAMENTO=false`. No padrão responde `pagamento_necessario`.

Nenhuma rota pública devolve a chave: ela só sai por e-mail e no admin.

### Admin

`/admin`, com a senha de `ADMIN_SENHA` (sem ela, o admin fica desligado). Sessão em cookie httpOnly, SameSite=Strict, 12 h, assinado com a própria senha (trocar a senha derruba as sessões). Mostra licenças (chave mascarada, com "Mostrar"), máquinas usadas, pagamentos, e permite reenviar a chave, revogar ou reativar e liberar as máquinas.

### Variáveis de ambiente

Todas em `.env.example` (sem valores). Cadastre na Vercel em Settings > Environment Variables:

| Variável | Para quê |
| --- | --- |
| `MP_ACCESS_TOKEN` | Access Token do Mercado Pago (de teste ou de produção) |
| `MP_WEBHOOK_SECRET` | Assinatura secreta dos Webhooks do Mercado Pago |
| `MP_AMBIENTE` | `teste` (usa o `sandbox_init_point`) ou `producao` |
| `VOX_SEGREDO_LICENCA` | Segredo que assina as chaves, igual ao do app |
| `RESEND_API_KEY` / `EMAIL_REMETENTE` | Envio do e-mail (domínio verificado no Resend) |
| `ADMIN_SENHA` | Senha do `/admin` (vazia = desligado) |
| `DATABASE_URL` ou `POSTGRES_URL` | Postgres (Supabase pela integração da Vercel, que cria `POSTGRES_URL` sozinha). As tabelas são criadas na primeira chamada, com RLS ligado e nenhuma política: a API pública do Supabase (chave anon) não enxerga nada |
| `NEXT_PUBLIC_SITE_URL` | Endereço público, sem barra no fim (vai no `notification_url` e nas `back_urls`) |
| `EXIGIR_PAGAMENTO` | `true` (padrão) ou `false` para liberar a licença grátis |
| `MAQUINAS_POR_LICENCA` | Computadores por licença (padrão 2) |

O build passa com todas vazias; sem elas, as rotas respondem "indisponível" (503).

### Homologação (antes de vender de verdade)

1. No [painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel/app), crie a aplicação (Checkout Pro) e use as **credenciais de teste**: `MP_ACCESS_TOKEN` de teste e `MP_AMBIENTE=teste`.
2. Em Webhooks, cadastre `https://SEU-SITE/api/webhooks/mercadopago` com o evento **Pagamentos** e copie a assinatura secreta para `MP_WEBHOOK_SECRET`. (A preferência também manda o `notification_url`.)
3. Crie as contas de teste (vendedor e comprador) em "Contas de teste" e faça uma compra em `/comprar` logado como **comprador de teste**, com os cartões de teste do Mercado Pago (o nome do titular escolhe o resultado: `APRO` aprovado, `OTHE` recusado, `CONT` pendente).
4. Confira: e-mail com a chave chegou, `/admin` mostra o pedido `aprovado` e a licença, e o app ativa a chave.
5. O botão "Simular notificação" do painel serve para conferir a assinatura (resposta diferente de 401 = segredo certo). O id de pagamento dele é fictício, então a consulta falha e a rota responde 500: é esperado.
6. Para vender: troque para as credenciais de produção, `MP_AMBIENTE=producao`, e faça uma compra real de teste (estorne pelo painel e veja a licença ser revogada).


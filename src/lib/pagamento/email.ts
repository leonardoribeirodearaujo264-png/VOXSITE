/** E-mail pelo Resend (fetch, sem SDK). A chave só sai por aqui e pelo admin. */
import { RELEASES } from "@/lib/site";
import { cfg } from "./config";

export class EmailFalhou extends Error {}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function montarEmailChave(chave: string) {
  const download = RELEASES.ultima;
  const tutoriais = `${cfg.siteUrl}/tutoriais`;
  const assunto = "Sua chave do VOX Videos";
  const texto = [
    "Obrigado por comprar o VOX Videos.",
    "",
    "Sua chave de licença:",
    chave,
    "",
    "Como ativar:",
    "1. Abra o VOX.",
    "2. Vá em Configuração e cole a chave.",
    "3. Clique em Ativar.",
    "",
    `Baixar o VOX: ${download}`,
    `Tutoriais: ${tutoriais}`,
    "",
    "Guarde este e-mail. Se perder a chave, peça de novo na página de download do site.",
  ].join("\n");

  const passo = (n: number, t: string) =>
    `<tr><td style="padding:6px 0;vertical-align:top;width:34px"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:13px;background:#0b2a20;color:#2ee6a6;font-family:Consolas,monospace;font-size:13px">${n}</span></td><td style="padding:6px 0;color:#ececf4;font-size:15px;line-height:26px">${t}</td></tr>`;

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${assunto}</title></head>
<body style="margin:0;padding:0;background:#0b0b0f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0f;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#121218;border:1px solid #262633;border-radius:14px;font-family:Inter,'Segoe UI',Arial,sans-serif">
<tr><td style="padding:28px 28px 8px">
<p style="margin:0;color:#2ee6a6;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-family:Consolas,monospace">VOX Videos</p>
<h1 style="margin:12px 0 0;color:#ececf4;font-size:24px;line-height:1.25">Sua chave de licença chegou</h1>
<p style="margin:10px 0 0;color:#b4b4c6;font-size:15px;line-height:1.6">Obrigado por comprar o VOX. Esta é a sua chave, válida para sempre:</p>
</td></tr>
<tr><td style="padding:16px 28px">
<div style="background:#0b0b0f;border:1px solid #2ee6a6;border-radius:10px;padding:16px;color:#2ee6a6;font-family:Consolas,'Courier New',monospace;font-size:15px;line-height:1.5;word-break:break-all">${esc(chave)}</div>
</td></tr>
<tr><td style="padding:4px 28px 8px">
<p style="margin:0 0 6px;color:#ececf4;font-size:16px;font-weight:600">Ative em 3 passos</p>
<table role="presentation" cellpadding="0" cellspacing="0">
${passo(1, "Abra o VOX.")}
${passo(2, "Vá em <strong>Configuração</strong> e cole a chave.")}
${passo(3, "Clique em <strong>Ativar</strong>.")}
</table>
</td></tr>
<tr><td style="padding:16px 28px 8px">
<a href="${esc(download)}" style="display:inline-block;background:#2ee6a6;color:#0b0b0f;text-decoration:none;font-weight:700;font-size:15px;padding:12px 20px;border-radius:10px">Baixar o VOX para Windows</a>
<a href="${esc(tutoriais)}" style="display:inline-block;margin-left:8px;color:#2ee6a6;text-decoration:underline;font-size:15px;padding:12px 4px">Ver os tutoriais</a>
</td></tr>
<tr><td style="padding:16px 28px 28px">
<p style="margin:0;color:#8a8aa0;font-size:13px;line-height:1.6">Guarde este e-mail. Se perder a chave, peça de novo na página de download do site.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
  return { assunto, html, texto };
}

export async function enviarEmail(para: string, conteudo: { assunto: string; html: string; texto: string }) {
  const key = cfg.resendKey;
  const de = cfg.remetente;
  if (!key || !de) throw new EmailFalhou("RESEND_API_KEY ou EMAIL_REMETENTE não configurado");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: de, to: [para], subject: conteudo.assunto, html: conteudo.html, text: conteudo.texto }),
  });
  if (!r.ok) throw new EmailFalhou(`Resend respondeu ${r.status}`);
}

export async function enviarChave(para: string, chave: string) {
  await enviarEmail(para, montarEmailChave(chave));
}

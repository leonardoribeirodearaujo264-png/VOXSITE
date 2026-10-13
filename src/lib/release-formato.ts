/** Tipos e formatação da release: sem nada de servidor, pode ir para o navegador. */

/** O que o site precisa saber da última versão publicada. */
export type Release = {
  versao: string; // "1.2.2"
  tag: string; // "v1.2.2"
  data: string; // ISO de publicação
  paginaUrl: string; // página da release no GitHub
  instalador: {
    nome: string; // "VOX-Videos-Setup-1.2.2.exe"
    url: string; // link direto do .exe
    bytes: number;
  };
  sha256: string | null; // só quando está publicado na release
};

export type ResultadoRelease = { ok: true; release: Release } | { ok: false; motivo: string };

/** 714861520 -> "682 MB" (o mesmo número que o Windows mostra). */
export function formatarTamanho(bytes: number): string {
  const mb = bytes / 1048576;
  if (mb >= 1024) return `${(mb / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} GB`;
  return `${Math.round(mb)} MB`;
}

/** "2026-10-12T05:52:46Z" -> "12/10/2026" (horário de Brasília). */
export function formatarData(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(iso));
}

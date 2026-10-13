/** Requisitos conferidos no projeto do app: instalador/vox.iss (64 bits,
 *  1,1 GB instalado, WebView2), backend/remotion.py (≈220 MB de download,
 *  ≈450 MB em disco) e a release publicada (tamanho do instalador). */
export function Requisitos({ tamanhoInstalador }: { tamanhoInstalador?: string }) {
  const itens = [
    { rotulo: "Sistema", valor: "Windows 10 ou 11, 64 bits" },
    {
      rotulo: "Instalador",
      valor: tamanhoInstalador ? `${tamanhoInstalador} para baixar` : "Baixado uma vez, pelo GitHub",
    },
    { rotulo: "Espaço em disco", valor: "Cerca de 1,1 GB do programa e 450 MB do Remotion, mais os seus projetos" },
    {
      rotulo: "Primeira abertura",
      valor: "Com o seu aceite, baixa o Remotion (Node.js, pacotes e Chrome Headless Shell), cerca de 220 MB",
    },
    { rotulo: "Internet", valor: "Para baixar, para a primeira abertura e para o Editar com IA" },
    { rotulo: "Editar com IA", valor: "Uma chave de API da Anthropic, sua, cobrada na sua conta" },
    { rotulo: "Placa de vídeo", valor: "Não precisa. A exportação é pelo processador" },
    { rotulo: "WebView2", valor: "Já vem no Windows. Se faltar, o instalador baixa" },
  ];
  return (
    <dl className="revelar mt-12 grid overflow-hidden rounded-r3 border border-borda sm:grid-cols-2">
      {itens.map((i) => (
        <div key={i.rotulo} className="border-b border-borda bg-painel/60 p-5 sm:p-6 sm:odd:border-r">
          <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-mudo">{i.rotulo}</dt>
          <dd className="mt-2 text-[16px] leading-snug text-texto">{i.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

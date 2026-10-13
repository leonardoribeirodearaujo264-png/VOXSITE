import { Cpu, KeyRound, MonitorCheck, Wifi } from "lucide-react";

/** Requisitos em linguagem simples. Conferidos no projeto do app
 *  (instalador/vox.iss: Windows 64 bits; render pelo processador; a IA usa a
 *  chave de API da própria pessoa). */
export function Requisitos() {
  const itens = [
    { Icone: MonitorCheck, titulo: "Windows 10 ou 11", texto: "Computador com Windows de 64 bits e uns 2 GB livres no disco." },
    { Icone: Cpu, titulo: "Não precisa de placa de vídeo", texto: "Funciona em computador comum, sem placa de vídeo dedicada." },
    { Icone: Wifi, titulo: "Internet para usar a IA", texto: "Para baixar o VOX e para os pedidos ao Editar com IA." },
    {
      Icone: KeyRound,
      titulo: "Sua própria chave da IA",
      texto: "O uso da IA é cobrado na sua conta, sem intermediário. A gente mostra como criar.",
      link: "/#chave",
    },
  ];
  return (
    <ul className="revelar mt-12 grid gap-4 sm:grid-cols-2">
      {itens.map(({ Icone, titulo, texto, link }) => (
        <li key={titulo} className="flex gap-4 rounded-r3 border border-borda bg-painel/70 p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-r2 bg-acento-tinta text-acento">
            <Icone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-[17px] font-semibold">{titulo}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-texto-2">
              {texto}{" "}
              {link && (
                <a href={link} className="font-semibold text-acento underline underline-offset-4">
                  Ver como
                </a>
              )}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

import type { Metadata } from "next";
import { EmBreve } from "@/components/EmBreve";

export const metadata: Metadata = { title: "Download" };

export default function Pagina() {
  return <EmBreve titulo="Download" texto="A página com versão, tamanho e SHA-256 do instalador entra na próxima etapa." />;
}

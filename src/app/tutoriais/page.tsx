import type { Metadata } from "next";
import { EmBreve } from "@/components/EmBreve";

export const metadata: Metadata = { title: "Tutoriais" };

export default function Pagina() {
  return <EmBreve titulo="Tutoriais" texto="As aulas em vídeo, uma por tema, chegam em breve." />;
}

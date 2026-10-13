import type { Metadata } from "next";
import { EmBreve } from "@/components/EmBreve";

export const metadata: Metadata = { title: "Tutoriais" };

export default function Pagina() {
  return <EmBreve titulo="Tutoriais" texto="As aulas em vÃ­deo estÃ£o sendo gravadas a partir do app real." />;
}

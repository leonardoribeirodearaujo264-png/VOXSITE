import type { Metadata } from "next";
import { EmBreve } from "@/components/EmBreve";

export const metadata: Metadata = { title: "Privacidade" };

export default function Pagina() {
  return <EmBreve titulo="Privacidade" texto="Texto em preparação." />;
}

import type { Metadata } from "next";
import { EmBreve } from "@/components/EmBreve";

export const metadata: Metadata = { title: "Termos de uso" };

export default function Pagina() {
  return <EmBreve titulo="Termos de uso" texto="Texto em preparação." />;
}

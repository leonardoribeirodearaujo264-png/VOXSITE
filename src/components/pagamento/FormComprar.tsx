"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const MENSAGENS: Record<string, string> = {
  email_invalido: "E-mail inválido. Confira e tente de novo.",
  email_descartavel: "Use um e-mail que você acessa sempre: a chave chega nele.",
  limite: "Muitos pedidos, tente daqui a pouco.",
  ja_comprou: "Você já comprou: reenviamos sua chave para o seu e-mail.",
};

/** Só redireciona para o próprio Mercado Pago. */
function urlDoMercadoPago(url: unknown): string | null {
  try {
    const u = new URL(String(url));
    return u.protocol === "https:" && /(^|\.)mercadopago\.com(\.br)?$/.test(u.hostname) ? u.toString() : null;
  } catch {
    return null;
  }
}

export function FormComprar() {
  const params = useSearchParams();
  const [email, setEmail] = useState(() => (params.get("email") || "").slice(0, 254));
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "erro" | "ok"; texto: string } | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setAviso(null);
    const v = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      setAviso({ tipo: "erro", texto: MENSAGENS.email_invalido });
      return;
    }
    setEnviando(true);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v }),
      });
      const d = await r.json().catch(() => ({}));
      const destino = d.ok ? urlDoMercadoPago(d.url) : null;
      if (destino) {
        window.location.assign(destino);
        return;
      }
      if (d.motivo === "ja_comprou") setAviso({ tipo: "ok", texto: MENSAGENS.ja_comprou });
      else setAviso({ tipo: "erro", texto: MENSAGENS[d.motivo] || d.mensagem || "Não deu certo agora. Tente de novo em alguns minutos." });
    } catch {
      setAviso({ tipo: "erro", texto: "Sem conexão. Confira a internet e tente de novo." });
    }
    setEnviando(false);
  }

  return (
    <form onSubmit={enviar} noValidate className="mx-auto w-full max-w-md text-left">
      <label htmlFor="email-compra" className="block text-[15px] font-semibold">
        Seu e-mail
      </label>
      <p id="email-compra-ajuda" className="mt-1 text-[14px] text-mudo">
        A chave de licença chega nele assim que o pagamento for aprovado.
      </p>
      <input
        id="email-compra"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        maxLength={254}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-describedby="email-compra-ajuda email-compra-aviso"
        aria-invalid={aviso?.tipo === "erro" || undefined}
        placeholder="voce@exemplo.com"
        className="mt-3 h-[52px] w-full rounded-r2 border border-borda-forte bg-fundo px-4 text-[16px] text-texto placeholder:text-mudo focus:border-acento focus:outline-none"
      />
      <button
        type="submit"
        disabled={enviando}
        className="mt-4 inline-flex h-[60px] w-full items-center justify-center rounded-r3 bg-acento px-6 text-[17px] font-bold text-fundo transition-colors hover:bg-acento-escuro disabled:cursor-wait disabled:opacity-70"
      >
        {enviando ? "Abrindo o Mercado Pago…" : "Comprar Vox — R$ 470,00"}
      </button>
      <p
        id="email-compra-aviso"
        role={aviso?.tipo === "erro" ? "alert" : "status"}
        className={`mt-4 min-h-[1.5em] text-[15px] ${aviso?.tipo === "erro" ? "text-perigo" : "text-acento"}`}
      >
        {aviso?.texto}
      </p>
    </form>
  );
}

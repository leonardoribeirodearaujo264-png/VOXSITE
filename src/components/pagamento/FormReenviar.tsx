"use client";

import { useState } from "react";

/** "Já comprou? Receber minha chave de novo" -> /api/licenca/reenviar. */
export function FormReenviar() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "erro" | "ok"; texto: string } | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setAviso(null);
    const v = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      setAviso({ tipo: "erro", texto: "E-mail inválido. Confira e tente de novo." });
      return;
    }
    setEnviando(true);
    try {
      const r = await fetch("/api/licenca/reenviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) setAviso({ tipo: "ok", texto: "Se esse e-mail comprou o VOX, enviamos a chave. Olhe também o spam." });
      else if (r.status === 429) setAviso({ tipo: "erro", texto: "Muitos pedidos, tente daqui a pouco." });
      else setAviso({ tipo: "erro", texto: d.mensagem || "Não deu certo agora. Tente de novo em alguns minutos." });
    } catch {
      setAviso({ tipo: "erro", texto: "Sem conexão. Confira a internet e tente de novo." });
    }
    setEnviando(false);
  }

  return (
    <div className="mt-5">
      <form onSubmit={enviar} noValidate className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="email-reenvio" className="sr-only">
          E-mail usado na compra
        </label>
        <input
          id="email-reenvio"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="email-reenvio-aviso"
          placeholder="E-mail usado na compra"
          className="h-[50px] min-w-0 flex-1 rounded-r2 border border-borda-forte bg-fundo px-4 text-[16px] text-texto placeholder:text-mudo focus:border-acento focus:outline-none"
        />
        <button
          type="submit"
          disabled={enviando}
          className="h-[50px] shrink-0 rounded-r2 border border-acento px-5 text-[15px] font-semibold text-acento transition-colors hover:bg-acento-tinta disabled:cursor-wait disabled:opacity-70"
        >
          {enviando ? "Enviando…" : "Receber minha chave"}
        </button>
      </form>
      <p
        id="email-reenvio-aviso"
        role={aviso?.tipo === "erro" ? "alert" : "status"}
        className={`mt-3 min-h-[1.5em] text-[14.5px] ${aviso?.tipo === "erro" ? "text-perigo" : "text-acento"}`}
      >
        {aviso?.texto}
      </p>
    </div>
  );
}

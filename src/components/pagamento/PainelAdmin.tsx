"use client";

import { useCallback, useEffect, useState } from "react";

type Licenca = {
  id: string;
  email: string;
  chave_mascarada: string;
  maquinas: number;
  usadas: number;
  revogada: boolean;
  origem: string;
  criado_em: string;
};
type Pedido = { id: string; email: string; status: string; payment_id: string | null; valor: string; moeda: string; criado_em: string };
type Estado = "carregando" | "desligado" | "entrar" | "pronto" | "erro";

const data = (v: string) => new Date(v).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
const botao = "rounded-r1 border border-borda px-2.5 py-1 text-[12.5px] font-medium text-texto-2 hover:border-borda-forte hover:text-texto";

export function PainelAdmin() {
  const [estado, setEstado] = useState<Estado>("carregando");
  const [licencas, setLicencas] = useState<Licenca[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [chaves, setChaves] = useState<Record<string, string>>({});
  const [senha, setSenha] = useState("");
  const [aviso, setAviso] = useState("");

  const carregar = useCallback(async () => {
    const r = await fetch("/api/admin/dados", { cache: "no-store" }).catch(() => null);
    if (!r) return setEstado("erro");
    if (r.status === 404) return setEstado("desligado");
    if (r.status === 401) return setEstado("entrar");
    const d = await r.json().catch(() => null);
    if (!d?.ok) return setEstado("erro");
    setLicencas(d.licencas);
    setPedidos(d.pedidos);
    setEstado("pronto");
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setAviso("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    }).catch(() => null);
    setSenha("");
    if (r?.ok) return carregar();
    const d = await r?.json().catch(() => null);
    setAviso(d?.mensagem || "Não deu para entrar.");
  }

  async function sair() {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => null);
    setChaves({});
    setEstado("entrar");
  }

  async function acao(acao: string, l: Licenca) {
    if ((acao === "revogar" || acao === "liberar") && !window.confirm(`${acao === "revogar" ? "Revogar" : "Liberar as máquinas de"} ${l.email}?`)) return;
    const r = await fetch("/api/admin/acao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao, licenca_id: l.id }),
    }).catch(() => null);
    const d = await r?.json().catch(() => null);
    if (r?.status === 401) return setEstado("entrar");
    if (acao === "mostrar" && d?.chave) return setChaves((c) => ({ ...c, [l.id]: d.chave }));
    setAviso(d?.mensagem || "Não deu certo.");
    if (acao !== "reenviar") void carregar();
  }

  if (estado === "carregando") return <p className="mt-6 text-texto-2">Carregando…</p>;
  if (estado === "desligado") return <p className="mt-6 text-texto-2">Admin desligado: defina ADMIN_SENHA no ambiente para usar.</p>;
  if (estado === "erro") return <p className="mt-6 text-perigo">Não deu para carregar os dados (banco configurado?).</p>;
  if (estado === "entrar") {
    return (
      <form onSubmit={entrar} className="mt-6 flex max-w-sm flex-col gap-3">
        <label htmlFor="senha-admin" className="text-[15px] font-semibold">
          Senha
        </label>
        <input
          id="senha-admin"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="h-[48px] rounded-r2 border border-borda-forte bg-fundo px-4 text-[16px] focus:border-acento focus:outline-none"
        />
        <button type="submit" className="h-[48px] rounded-r2 bg-acento font-bold text-fundo hover:bg-acento-escuro">
          Entrar
        </button>
        <p role="alert" className="min-h-[1.5em] text-[14px] text-perigo">
          {aviso}
        </p>
      </form>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-[14px] text-acento">
          {aviso}
        </p>
        <button type="button" onClick={sair} className={botao}>
          Sair
        </button>
      </div>

      <h2 className="mt-8 text-[20px] font-semibold">Licenças ({licencas.length})</h2>
      <div className="mt-3 overflow-x-auto rounded-r2 border border-borda">
        <table className="w-full min-w-[860px] text-left text-[13.5px]">
          <thead className="bg-painel text-mudo">
            <tr>
              <th className="p-3 font-medium">E-mail</th>
              <th className="p-3 font-medium">Chave</th>
              <th className="p-3 font-medium">Máquinas</th>
              <th className="p-3 font-medium">Data</th>
              <th className="p-3 font-medium">Situação</th>
              <th className="p-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {licencas.map((l) => (
              <tr key={l.id} className="border-t border-borda align-top">
                <td className="p-3 break-all">{l.email}</td>
                <td className="p-3 font-mono text-[12px] break-all">
                  {chaves[l.id] || l.chave_mascarada}{" "}
                  {!chaves[l.id] && (
                    <button type="button" className={botao} onClick={() => acao("mostrar", l)}>
                      Mostrar
                    </button>
                  )}
                </td>
                <td className="p-3">
                  {l.usadas}/{l.maquinas}
                </td>
                <td className="p-3 whitespace-nowrap">{data(l.criado_em)}</td>
                <td className={`p-3 ${l.revogada ? "text-perigo" : "text-acento"}`}>
                  {l.revogada ? "Revogada" : "Ativa"} <span className="text-mudo">({l.origem})</span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" className={botao} onClick={() => acao("reenviar", l)}>
                      Reenviar chave
                    </button>
                    <button type="button" className={botao} onClick={() => acao(l.revogada ? "reativar" : "revogar", l)}>
                      {l.revogada ? "Reativar" : "Revogar"}
                    </button>
                    <button type="button" className={botao} onClick={() => acao("liberar", l)}>
                      Liberar máquinas
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-[20px] font-semibold">Pagamentos ({pedidos.length})</h2>
      <div className="mt-3 overflow-x-auto rounded-r2 border border-borda">
        <table className="w-full min-w-[760px] text-left text-[13.5px]">
          <thead className="bg-painel text-mudo">
            <tr>
              <th className="p-3 font-medium">Pedido</th>
              <th className="p-3 font-medium">E-mail</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">payment_id</th>
              <th className="p-3 font-medium">Valor</th>
              <th className="p-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="border-t border-borda">
                <td className="p-3 font-mono text-[12px]">{p.id.slice(0, 8)}</td>
                <td className="p-3 break-all">{p.email}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 font-mono text-[12px]">{p.payment_id || "—"}</td>
                <td className="p-3 whitespace-nowrap">
                  {Number(p.valor).toLocaleString("pt-BR", { style: "currency", currency: p.moeda || "BRL" })}
                </td>
                <td className="p-3 whitespace-nowrap">{data(p.criado_em)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

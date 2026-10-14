/** Limite por janela fixa (hora e dia), guardado na tabela `limites`. */
import type { Executor } from "./banco";

export type Regra = { escopo: string; id: string; porHora: number; porDia: number };

function janela(agora: Date, tipo: "h" | "d"): Date {
  const d = new Date(agora);
  d.setUTCMinutes(0, 0, 0);
  if (tipo === "d") d.setUTCHours(0);
  return d;
}

async function contar(db: Executor, chave: string, inicio: Date): Promise<number> {
  const r = await db.query<{ contagem: number }>(
    `INSERT INTO limites (chave, janela_inicio, contagem) VALUES ($1, $2, 1)
     ON CONFLICT (chave, janela_inicio) DO UPDATE SET contagem = limites.contagem + 1
     RETURNING contagem`,
    [chave, inicio.toISOString()],
  );
  return Number(r[0]?.contagem ?? 0);
}

/** Conta mais um pedido em cada regra. true = passou do limite. */
export async function estourou(db: Executor, regras: Regra[], agora = new Date()): Promise<boolean> {
  let passou = false;
  for (const r of regras) {
    const id = r.id.slice(0, 200);
    const h = await contar(db, `${r.escopo}:${id}:h`, janela(agora, "h"));
    const d = await contar(db, `${r.escopo}:${id}:d`, janela(agora, "d"));
    if (h > r.porHora || d > r.porDia) passou = true;
  }
  if (Math.random() < 0.02) {
    await db
      .query(`DELETE FROM limites WHERE janela_inicio < $1`, [new Date(agora.getTime() - 3 * 86_400_000).toISOString()])
      .catch(() => {});
  }
  return passou;
}

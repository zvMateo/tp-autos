"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Finanzas } from "@/lib/model";
import { formatMoney, formatMoneyM } from "@/lib/format";

interface FinanceChartProps {
  finanzas: Finanzas;
  precioObjetivo: number;
}

interface TipRow {
  name: string;
  capital: number;
  intereses: number;
}
interface TipProps {
  active?: boolean;
  payload?: { payload: TipRow }[];
}

function FinTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const total = p.capital + p.intereses;
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="mb-1 text-sm font-semibold text-ink">{p.name}</div>
      <div className="flex items-center justify-between gap-5 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink" /> Valor del auto
        </span>
        <span className="tnum font-mono">{formatMoney(p.capital)}</span>
      </div>
      {p.intereses > 0 && (
        <div className="flex items-center justify-between gap-5 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-car-nafta" /> Intereses
          </span>
          <span className="tnum font-mono">{formatMoney(p.intereses)}</span>
        </div>
      )}
      <div className="mt-1 flex items-center justify-between gap-5 border-t border-line pt-1 text-sm font-semibold text-ink">
        <span>Total</span>
        <span className="tnum font-mono">{formatMoney(total)}</span>
      </div>
    </div>
  );
}

/** G3 — Total desembolsado: contado vs prendario (la diferencia es el interés). */
export function FinanceChart({ finanzas, precioObjetivo }: FinanceChartProps) {
  const data: TipRow[] = [
    { name: "Contado", capital: precioObjetivo, intereses: 0 },
    { name: "Prendario", capital: precioObjetivo, intereses: finanzas.prendario.intereses },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 16, bottom: 4, left: 12 }} barCategoryGap="32%">
            <CartesianGrid stroke="var(--line)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "var(--ink)", fontSize: 13 }} stroke="var(--line-strong)" tickLine={false} />
            <YAxis
              tickFormatter={(v) => formatMoneyM(v)}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              stroke="var(--line-strong)"
              tickLine={false}
              width={64}
            />
            <Tooltip content={<FinTooltip />} cursor={{ fill: "var(--surface-2)" }} />
            <Bar dataKey="capital" stackId="a" fill="var(--ink)" radius={[0, 0, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="intereses" stackId="a" fill="var(--car-nafta)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-5 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink" /> Valor del auto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-car-nafta" /> Intereses pagados
        </span>
      </div>
    </div>
  );
}

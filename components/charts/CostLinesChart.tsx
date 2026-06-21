"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AUTO_KEYS, costoEnKm, serieCostos, type AutoKey, type Params } from "@/lib/model";
import type { ModelResults } from "@/lib/useModel";
import { AUTO_UI } from "@/lib/autos";
import { formatKm, formatMoney, formatMoneyM, formatNumber } from "@/lib/format";

interface CostLinesChartProps {
  params: Params;
  results: ModelResults;
}

interface TipItem {
  dataKey: AutoKey;
  value: number;
  color: string;
}
interface TipProps {
  active?: boolean;
  payload?: TipItem[];
  label?: number | string;
  horizonteAnios: number;
}

function CostTooltip({ active, payload, label, horizonteAnios }: TipProps) {
  if (!active || !payload?.length) return null;
  const km = Number(label);
  const rows = [...payload].sort((a, b) => a.value - b.value);
  const min = rows[0]?.value;
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="mb-1.5 text-xs text-muted">
        {formatKm(km)} totales · {formatNumber(km / horizonteAnios)} km/año
      </div>
      <div className="space-y-1">
        {rows.map((r) => {
          const best = r.value === min;
          return (
            <div key={r.dataKey} className="flex items-center justify-between gap-5 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                <span className={best ? "font-semibold text-ink" : "text-muted"}>{AUTO_UI[r.dataKey].short}</span>
              </span>
              <span className={`tnum font-mono ${best ? "font-semibold text-ink" : "text-muted"}`}>
                {formatMoney(r.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** G1 — Rectas de costo total vs km, con cruces y la línea de Martín. */
export function CostLinesChart({ params, results }: CostLinesChartProps) {
  const kmTot = results.kmTot;
  const maxKm = Math.max(200_000, kmTot * 1.2);
  const data = serieCostos(params, maxKm);

  const crosses = results.cruces
    .filter((c) => c.valido && c.kmTotales != null && c.kmTotales <= maxKm)
    .map((c) => ({ ...c, y: costoEnKm(results.autos[c.a], c.kmTotales as number) }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 24, right: 28, bottom: 18, left: 12 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="km"
          type="number"
          domain={[0, maxKm]}
          tickFormatter={(v) => `${formatNumber(v / 1000)}k`}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          stroke="var(--line-strong)"
          tickLine={false}
          label={{
            value: `km totales en ${params.horizonteAnios} años`,
            position: "insideBottom",
            offset: -10,
            fill: "var(--faint)",
            fontSize: 11,
          }}
        />
        <YAxis
          tickFormatter={(v) => formatMoneyM(v)}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          stroke="var(--line-strong)"
          tickLine={false}
          width={68}
        />
        <Tooltip
          content={<CostTooltip horizonteAnios={params.horizonteAnios} />}
          cursor={{ stroke: "var(--line-strong)", strokeDasharray: "3 3" }}
        />
        {AUTO_KEYS.map((k) => (
          <Line
            key={k}
            type="linear"
            dataKey={k}
            stroke={AUTO_UI[k].color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        ))}
        <ReferenceLine
          x={kmTot}
          stroke="var(--ink)"
          strokeDasharray="5 4"
          strokeWidth={1.5}
          label={{
            value: `Martín · ${formatNumber(params.kmAnio)} km/año`,
            position: "top",
            fill: "var(--ink)",
            fontSize: 11,
            fontWeight: 600,
          }}
        />
        {crosses.map((c, i) => (
          <ReferenceDot
            key={i}
            x={c.kmTotales as number}
            y={c.y}
            r={5}
            fill="var(--surface)"
            stroke="var(--ink)"
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

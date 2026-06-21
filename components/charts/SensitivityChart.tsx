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
import { serieSensibilidad, type Params } from "@/lib/model";
import type { ModelResults } from "@/lib/useModel";
import { formatKmAnio, formatNumber } from "@/lib/format";

interface SensitivityChartProps {
  params: Params;
  results: ModelResults;
}

interface TipProps {
  active?: boolean;
  payload?: { payload: { pct: number; cruce: number | null } }[];
}

function SensTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  if (p.cruce == null) return null;
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="text-xs text-muted">Suba nafta: {formatNumber(p.pct)}%/año</div>
      <div className="mt-0.5 text-sm text-ink">
        Cruce nafta↔eléctrico: <span className="tnum font-mono font-semibold">{formatKmAnio(p.cruce)}</span>
      </div>
    </div>
  );
}

/** G2 — Punto de equilibrio nafta↔eléctrico (km/año) según la suba anual de la nafta. */
export function SensitivityChart({ params, results }: SensitivityChartProps) {
  const data = serieSensibilidad(params);
  const cruceActual = results.cruces.find((c) => c.a === "nafta" && c.b === "electrico")?.kmAnio ?? null;
  const pctActual = params.subaNaftaAnual * 100;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 24, right: 28, bottom: 18, left: 12 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="pct"
          type="number"
          domain={[0, 100]}
          tickFormatter={(v) => `${formatNumber(v)}%`}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          stroke="var(--line-strong)"
          tickLine={false}
          label={{
            value: "suba anual de la nafta",
            position: "insideBottom",
            offset: -10,
            fill: "var(--faint)",
            fontSize: 11,
          }}
        />
        <YAxis
          tickFormatter={(v) => `${formatNumber(v / 1000)}k`}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          stroke="var(--line-strong)"
          tickLine={false}
          width={52}
          label={{ value: "km/año", angle: -90, position: "insideLeft", fill: "var(--faint)", fontSize: 11 }}
        />
        <Tooltip content={<SensTooltip />} cursor={{ stroke: "var(--line-strong)", strokeDasharray: "3 3" }} />
        <ReferenceLine
          y={params.kmAnio}
          stroke="var(--ink)"
          strokeDasharray="5 4"
          strokeWidth={1.5}
          label={{
            value: `Martín · ${formatNumber(params.kmAnio)} km/año`,
            position: "insideTopRight",
            fill: "var(--ink)",
            fontSize: 11,
            fontWeight: 600,
          }}
        />
        <Line
          type="monotone"
          dataKey="cruce"
          stroke="var(--accent)"
          strokeWidth={2.5}
          dot={false}
          connectNulls
          isAnimationActive={false}
        />
        {cruceActual != null && (
          <ReferenceDot x={pctActual} y={cruceActual} r={6} fill="var(--car-nafta)" stroke="var(--surface)" strokeWidth={2} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

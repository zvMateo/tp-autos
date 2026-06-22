"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { serieSensibilidad, serieSensibilidadLuz, type Params } from "@/lib/model";
import type { ModelResults } from "@/lib/useModel";
import { formatKmAnio, formatNumber } from "@/lib/format";

interface SensitivityChartProps {
  params: Params;
  results: ModelResults;
}

interface Row {
  pct: number;
  cruceNafta: number | null;
  cruceLuz: number | null;
}

interface TipProps {
  active?: boolean;
  payload?: { payload: Row }[];
}

function SensTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-line bg-surface/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="text-xs text-muted">Suba anual de la energía: {formatNumber(p.pct)}%/año</div>
      {p.cruceNafta != null && (
        <div className="mt-0.5 text-sm text-ink">
          Si sube la nafta → cruce{" "}
          <span className="tnum font-mono font-semibold text-car-nafta">{formatKmAnio(p.cruceNafta)}</span>
        </div>
      )}
      {p.cruceLuz != null && (
        <div className="mt-0.5 text-sm text-ink">
          Si sube la luz → cruce{" "}
          <span className="tnum font-mono font-semibold text-car-electrico">{formatKmAnio(p.cruceLuz)}</span>
        </div>
      )}
      {p.cruceLuz == null && (
        <div className="mt-0.5 text-xs text-faint">Con la luz tan cara, al eléctrico ya no le conviene a ningún uso.</div>
      )}
    </div>
  );
}

/**
 * G2 — Cómo se mueve el punto de equilibrio nafta↔eléctrico según suba cada
 * energía: subir la NAFTA baja el cruce (el eléctrico conviene antes), subir la
 * LUZ lo sube (conviene más tarde). Las dos curvas arrancan juntas en 0%.
 */
export function SensitivityChart({ params, results }: SensitivityChartProps) {
  const nafta = serieSensibilidad(params);
  const luz = serieSensibilidadLuz(params);
  const data: Row[] = nafta.map((n, i) => ({
    pct: n.pct,
    cruceNafta: n.cruce,
    cruceLuz: luz[i]?.cruce ?? null,
  }));
  const cruceActual = results.cruces.find((c) => c.a === "nafta" && c.b === "electrico")?.kmAnio ?? null;
  const pctNafta = params.subaNaftaAnual * 100;
  const pctLuz = params.subaLuzAnual * 100;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 28, right: 28, bottom: 18, left: 12 }}>
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
            value: "suba anual de la energía",
            position: "insideBottom",
            offset: -10,
            fill: "var(--faint)",
            fontSize: 11,
          }}
        />
        <YAxis
          domain={[0, 45000]}
          allowDataOverflow
          tickFormatter={(v) => `${formatNumber(v / 1000)}k`}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          stroke="var(--line-strong)"
          tickLine={false}
          width={52}
          label={{ value: "km/año", angle: -90, position: "insideLeft", fill: "var(--faint)", fontSize: 11 }}
        />
        <Tooltip content={<SensTooltip />} cursor={{ stroke: "var(--line-strong)", strokeDasharray: "3 3" }} />
        <Legend
          verticalAlign="top"
          height={24}
          iconType="plainline"
          wrapperStyle={{ fontSize: 11, color: "var(--muted)" }}
        />
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
          dataKey="cruceNafta"
          name="sube la nafta → baja"
          stroke="var(--car-nafta)"
          strokeWidth={2.5}
          dot={false}
          connectNulls
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="cruceLuz"
          name="sube la luz → sube"
          stroke="var(--car-electrico)"
          strokeWidth={2.5}
          strokeDasharray="6 3"
          dot={false}
          connectNulls
          isAnimationActive={false}
        />
        {cruceActual != null && (
          <ReferenceDot x={pctNafta} y={cruceActual} r={5} fill="var(--car-nafta)" stroke="var(--surface)" strokeWidth={2} />
        )}
        {cruceActual != null && (
          <ReferenceDot
            x={pctLuz}
            y={cruceActual}
            r={5}
            fill="var(--car-electrico)"
            stroke="var(--surface)"
            strokeWidth={2}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

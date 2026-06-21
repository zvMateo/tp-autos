"use client";

import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { FinanceChart } from "../charts/FinanceChart";
import { formatMoney, formatPct } from "@/lib/format";

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-faint">{label}</div>
      <div className="tnum mt-1 font-mono text-2xl font-bold" style={{ color: accent ?? "var(--ink)" }}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

/** Slide 7 — ¿Y cómo lo paga? Contado vs prendario vs esperar. */
export function SlidePago({ model }: { model: UseModel }) {
  const { params, results } = model;
  const f = results.finanzas;

  return (
    <SlideFrame eyebrow="¿Y cómo lo paga?" title={`Le faltan ${formatMoney(f.gap)}`}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="mb-1 text-sm font-semibold text-ink">Contado vs prendario</div>
          <p className="mb-2 text-xs text-muted">La diferencia entre las barras es lo que cuesta el crédito.</p>
          <div className="h-[320px]">
            <FinanceChart finanzas={f} precioObjetivo={params.precioObjetivo} />
          </div>
        </div>

        <div className="grid grid-cols-2 content-center gap-4">
          <StatCard label="Cuota prendario" value={formatMoney(f.prendario.cuota)} sub={`${params.mesesPrendario} cuotas`} accent="var(--car-nafta)" />
          <StatCard label="Intereses" value={formatPct(f.prendario.interesesPct)} sub={formatMoney(f.prendario.intereses)} accent="var(--car-nafta)" />
          <StatCard label="Plazo fijo (1 año)" value={formatMoney(f.plazoFijo.capFinal)} sub={`de ${formatMoney(params.ahorro)}`} accent="var(--car-electrico)" />
          <StatCard label="Auto en 1 año" value={formatMoney(f.esperar.precioFuturo)} sub={`+${formatPct(params.inflacionAutoAnual)}`} />
          <div className="col-span-2 rounded-2xl border border-line bg-surface-2/50 p-4 text-sm leading-relaxed text-ink">
            Esperar y ahorrar <strong>no alcanza</strong>: aunque el plazo fijo rinda, en pesos el faltante crece
            (el auto vale mucho más que lo ahorrado). Después de un año todavía faltarían{" "}
            <strong className="text-car-nafta">{formatMoney(f.esperar.gapFuturo)}</strong>.
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

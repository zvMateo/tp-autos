"use client";

import { AUTO_KEYS } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";
import type { UseModel } from "@/lib/useModel";
import { CountUp } from "./ui/CountUp";
import { Odometer } from "./ui/Odometer";
import { formatKmAnio, formatMoney, formatPct } from "@/lib/format";

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2/50 p-3">
      <div className="text-[11px] uppercase tracking-wide text-faint">{label}</div>
      <div className="tnum mt-1 font-mono text-base text-ink">{value}</div>
      {sub && <div className="text-[11px] text-muted">{sub}</div>}
    </div>
  );
}

/** Panel de resultados: ganador, costos a horizonte, cruces y finanzas (en vivo). */
export function ResultsPanel({ model }: { model: UseModel }) {
  const { params, results } = model;
  const g = results.ganador;
  const gUi = AUTO_UI[g.key];
  const ranked = AUTO_KEYS.map((k) => results.autos[k]).sort((a, b) => a.costoTotal - b.costoTotal);
  const maxCosto = ranked[ranked.length - 1].costoTotal;
  const f = results.finanzas;

  return (
    <div className="space-y-4">
      {/* Ganador */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="text-xs uppercase tracking-wider text-faint">
          A {formatKmAnio(params.kmAnio)} · {params.horizonteAnios} años
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl font-semibold text-ink">Conviene el</span>
          <span className="flex items-center gap-2 text-2xl font-bold" style={{ color: gUi.color }}>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: gUi.color }} />
            {gUi.short}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-faint">Costo total</div>
            <Odometer value={g.costoTotal} format={formatMoney} className="tnum font-mono text-xl font-semibold text-ink" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-faint">Ahorro vs. 2º</div>
            <Odometer value={g.ventaja} format={formatMoney} className="tnum font-mono text-xl font-semibold text-car-electrico" />
          </div>
        </div>
      </div>

      {/* Tabla de costos */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">Costo total a {params.horizonteAnios} años</h3>
        <div className="space-y-2">
          {ranked.map((c, i) => {
            const ui = AUTO_UI[c.key];
            const pctWidth = (c.costoTotal / maxCosto) * 100;
            return (
              <div key={c.key} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-4 text-center font-mono text-xs text-faint">{i + 1}</span>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ui.color }} />
                    <span className={i === 0 ? "font-semibold text-ink" : "text-muted"}>{ui.short}</span>
                    <span className="tnum font-mono text-[11px] text-faint">{formatMoney(c.pendiente)}/km</span>
                  </span>
                  <CountUp
                    value={c.costoTotal}
                    format={formatMoney}
                    className={`tnum font-mono ${i === 0 ? "font-semibold text-ink" : "text-muted"}`}
                  />
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${pctWidth}%`, backgroundColor: ui.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cruces */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">Puntos de equilibrio</h3>
        <ul className="space-y-2 text-sm">
          {results.cruces.map((c) => {
            const flatter = results.autos[c.a].pendiente < results.autos[c.b].pendiente ? c.a : c.b;
            const ui = AUTO_UI[flatter];
            if (!c.valido || c.kmAnio == null) {
              return (
                <li key={`${c.a}-${c.b}`} className="text-muted">
                  {AUTO_UI[c.a].short} vs {AUTO_UI[c.b].short}: no se cruzan en rango
                </li>
              );
            }
            return (
              <li key={`${c.a}-${c.b}`} className="flex items-center justify-between gap-3">
                <span className="text-muted">
                  <span className="font-medium" style={{ color: ui.color }}>
                    {ui.short}
                  </span>{" "}
                  conviene a partir de
                </span>
                <span className="tnum font-mono text-ink">{formatKmAnio(c.kmAnio)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Finanzas */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">¿Cómo lo paga? (faltan {formatMoney(f.gap)})</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <StatBox label="Cuota prendario" value={formatMoney(f.prendario.cuota)} sub={`${params.mesesPrendario} meses`} />
          <StatBox label="Total prendario" value={formatMoney(f.prendario.totalPagado)} sub={`intereses ${formatPct(f.prendario.interesesPct)}`} />
          <StatBox label="Intereses" value={formatMoney(f.prendario.intereses)} />
          <StatBox label="Plazo fijo (1 año)" value={formatMoney(f.plazoFijo.capFinal)} sub={`+${formatMoney(f.plazoFijo.ganancia)}`} />
          <StatBox label="Auto en 1 año" value={formatMoney(f.esperar.precioFuturo)} />
          <StatBox label="Faltaría igual" value={formatMoney(f.esperar.gapFuturo)} sub="esperar no alcanza" />
        </div>
      </div>
    </div>
  );
}

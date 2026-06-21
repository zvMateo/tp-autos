"use client";

import type { AutoCalculo, AutoConfig, AutoKey } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";
import { formatMoney, formatNumber } from "@/lib/format";

interface CarCardProps {
  autoKey: AutoKey;
  config: AutoConfig;
  calc?: AutoCalculo;
  highlight?: boolean;
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/70 py-1.5 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="tnum font-mono text-sm text-ink">{value}</span>
    </div>
  );
}

/** Tarjeta con los datos de un auto + (opcional) pendiente/ordenada calculadas. */
export function CarCard({ autoKey, config, calc, highlight }: CarCardProps) {
  const ui = AUTO_UI[autoKey];
  const unidad = config.energia === "nafta" ? "L/100km" : "kWh/100km";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
      style={{
        borderColor: highlight ? ui.color : "var(--line)",
        boxShadow: highlight ? `0 0 0 1px ${ui.color}` : undefined,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: ui.color }} />
      <div className="mb-4 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: ui.color }} />
        <h3 className="text-lg font-semibold text-ink">{ui.short}</h3>
      </div>
      <p className="mb-4 text-xs leading-snug text-faint">{config.nombre}</p>

      <div className="space-y-0">
        <Spec label="Precio" value={formatMoney(config.precio)} />
        <Spec label="Consumo" value={`${formatNumber(config.consumo, 1)} ${unidad}`} />
        <Spec label="Mantenimiento" value={`${formatMoney(config.mantKm)}/km`} />
        <Spec label="Seguro" value={`${formatMoney(config.seguro)}/año`} />
        {calc && (
          <>
            <Spec label="Costo por km" value={`${formatMoney(calc.pendiente)}/km`} />
            <Spec label="Costo fijo (compra+patente+seguro)" value={formatMoney(calc.ordenada)} />
          </>
        )}
      </div>
    </div>
  );
}

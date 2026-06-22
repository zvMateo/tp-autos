"use client";

import { AUTO_KEYS } from "@/lib/model";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { CarCard } from "../CarCard";
import { formatMoney } from "@/lib/format";

/** Slide 3 — Las variables: tarjetas de los 3 autos con sus datos. */
export function SlideVariables({ model }: { model: UseModel }) {
  const { params, results } = model;
  return (
    <SlideFrame eyebrow="Las variables" title="Tres autos, los mismos datos">
      <div className="grid gap-5 md:grid-cols-3">
        {AUTO_KEYS.map((k) => (
          <CarCard key={k} autoKey={k} config={params.autos[k]} calc={results.autos[k]} />
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="text-xs uppercase tracking-wide text-faint">Nafta súper (Córdoba)</div>
          <div className="mt-1 tnum font-mono text-xl text-car-nafta">
            {formatMoney(params.nafta)}
            <span className="text-sm text-muted"> /litro</span>
          </div>
          <div className="mt-1 text-xs text-faint">Su suba anual se explora en «Sensibilidad».</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="text-xs uppercase tracking-wide text-faint">Luz residencial (EPEC)</div>
          <div className="mt-1 tnum font-mono text-xl text-car-electrico">
            {formatMoney(params.luz)}
            <span className="text-sm text-muted"> /kWh</span>
          </div>
          <div className="mt-1 text-xs text-faint">Proyección jun-2026; sube ~32%/año (ver «Fuentes»).</div>
        </div>
      </div>

      <p className="mt-4 inline-block rounded-lg bg-surface-2 px-4 py-2 text-sm text-faint">
        Datos reales de Córdoba (junio 2026), verificados con fuentes — ver la diapositiva «Fuentes».
      </p>
    </SlideFrame>
  );
}

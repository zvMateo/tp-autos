"use client";

import { cruceNaftaElectricoKmAnio } from "@/lib/model";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { CostLinesChart } from "../charts/CostLinesChart";
import { SensitivityChart } from "../charts/SensitivityChart";
import { Slider } from "../ui/Slider";
import { Odometer } from "../ui/Odometer";
import { formatKmAnio, formatPct } from "@/lib/format";

/** Slide 6 — Análisis de sensibilidad (interactivo, momento "wow"). */
export function SlideSensibilidad({ model }: { model: UseModel }) {
  const { params, results, set } = model;
  const cruce = results.cruces.find((c) => c.a === "nafta" && c.b === "electrico")?.kmAnio ?? 0;
  const cruceSinSuba = cruceNaftaElectricoKmAnio({ ...params, subaNaftaAnual: 0 }, 0) ?? 0;

  return (
    <SlideFrame eyebrow="Análisis de sensibilidad" title="Todo depende del precio de la nafta">
      <div className="mb-5 rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-ink">Suba anual de la nafta</span>
              <span className="tnum font-mono text-lg text-car-nafta">{formatPct(params.subaNaftaAnual)}/año</span>
            </div>
            <div className="mt-3">
              <Slider
                value={params.subaNaftaAnual}
                min={0}
                max={1}
                step={0.05}
                color="var(--car-nafta)"
                ariaLabel="Suba anual de la nafta"
                onValueChange={(v) => set("subaNaftaAnual", v)}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-faint">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="sm:w-72 sm:border-l sm:border-line sm:pl-5">
            <div className="text-xs uppercase tracking-wide text-faint">Al eléctrico le conviene a partir de</div>
            <Odometer value={cruce} format={formatKmAnio} className="tnum font-mono text-3xl font-bold text-car-electrico" />
            <div className="mt-1 text-xs text-muted">Sin suba el umbral es {formatKmAnio(cruceSinSuba)}.</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="mb-1 text-sm font-semibold text-ink">Las rectas se inclinan</div>
          <div className="h-[300px]">
            <CostLinesChart params={params} results={results} />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="mb-1 text-sm font-semibold text-ink">El umbral cae con la suba</div>
          <div className="h-[300px]">
            <SensitivityChart params={params} results={results} />
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

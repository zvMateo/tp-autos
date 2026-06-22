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
  const cruceSinSuba = cruceNaftaElectricoKmAnio({ ...params, subaNaftaAnual: 0, subaLuzAnual: 0 }, 0) ?? 0;

  return (
    <SlideFrame eyebrow="Análisis de sensibilidad" title="Todo depende del precio de la energía">
      <div className="mb-4 rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
          <div>
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
            <div className="mt-1 text-xs text-faint">Baja el cruce: al eléctrico le conviene antes.</div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-ink">Suba anual de la luz (EPEC)</span>
              <span className="tnum font-mono text-lg text-car-electrico">{formatPct(params.subaLuzAnual)}/año</span>
            </div>
            <div className="mt-3">
              <Slider
                value={params.subaLuzAnual}
                min={0}
                max={1}
                step={0.05}
                color="var(--car-electrico)"
                ariaLabel="Suba anual de la luz"
                onValueChange={(v) => set("subaLuzAnual", v)}
              />
            </div>
            <div className="mt-1 text-xs text-faint">Sube el cruce: el eléctrico conviene más tarde.</div>
          </div>

          <div className="lg:w-64 lg:border-l lg:border-line lg:pl-5">
            <div className="text-xs uppercase tracking-wide text-faint">Al eléctrico le conviene a partir de</div>
            <Odometer value={cruce} format={formatKmAnio} className="tnum font-mono text-3xl font-bold text-car-electrico" />
            <div className="mt-1 text-xs text-muted">A precios de hoy (sin subas): {formatKmAnio(cruceSinSuba)}.</div>
          </div>
        </div>
      </div>

      <p className="mb-4 max-w-4xl rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm leading-snug text-muted">
        <span className="font-semibold text-ink">Aclaración honesta:</span> antes manteníamos la luz fija; ahora
        modelamos la suba de <strong className="text-ink">las dos</strong> energías (nafta y luz de EPEC, ~32%/año real).
        Empujan el cruce en sentidos opuestos, así la conclusión no depende de congelar una sola.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="mb-1 text-sm font-semibold text-ink">Las rectas se inclinan</div>
          <div className="h-[280px]">
            <CostLinesChart params={params} results={results} />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="mb-1 text-sm font-semibold text-ink">El umbral: la nafta lo baja, la luz lo sube</div>
          <div className="h-[280px]">
            <SensitivityChart params={params} results={results} />
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

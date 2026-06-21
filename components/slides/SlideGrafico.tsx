"use client";

import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { RaceChart } from "../charts/RaceChart";
import { Slider } from "../ui/Slider";
import { Odometer } from "../ui/Odometer";
import { AUTO_UI } from "@/lib/autos";
import { formatKmAnio, formatMoney } from "@/lib/format";

/** Slide 5 — El gráfico y el cruce (interactivo: slider de km/año). */
export function SlideGrafico({ model }: { model: UseModel }) {
  const { params, results, set } = model;
  const g = results.ganador;
  const gUi = AUTO_UI[g.key];

  return (
    <SlideFrame eyebrow="El gráfico y el cruce" title="El que arranca caro puede ganar">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="h-[460px]">
            <RaceChart params={params} results={results} />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-ink">Kilómetros por año de Martín</span>
              <span className="tnum font-mono text-lg text-ink">{formatKmAnio(params.kmAnio)}</span>
            </div>
            <div className="mt-3">
              <Slider
                value={params.kmAnio}
                min={0}
                max={60000}
                step={1000}
                color="var(--accent)"
                ariaLabel="Kilómetros por año"
                onValueChange={(v) => set("kmAnio", v)}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-faint">
              <span>0</span>
              <span>60.000</span>
            </div>
          </div>

          <div className="rounded-2xl border p-5" style={{ borderColor: gUi.color }}>
            <div className="text-xs uppercase tracking-wide text-faint">A ese uso conviene</div>
            <div className="mt-1 flex items-center gap-2 text-3xl font-bold" style={{ color: gUi.color }}>
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: gUi.color }} />
              {gUi.short}
            </div>
            <div className="mt-3 text-sm text-muted">
              Costo total:{" "}
              <Odometer value={g.costoTotal} format={formatMoney} className="tnum font-mono font-semibold text-ink" />
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted">
            Movés el slider y la <strong className="text-ink">línea vertical</strong> se desplaza: a pocos km gana el
            nafta; pasado el cruce, el eléctrico. La respuesta a la pregunta era <strong className="text-ink">no</strong>.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}

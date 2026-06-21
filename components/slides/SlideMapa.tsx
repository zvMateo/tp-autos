"use client";

import { AUTO_KEYS } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { DecisionMap } from "../charts/DecisionMap";
import { formatKmAnio, formatPct } from "@/lib/format";

/** Slide bonus — el mapa de decisión (concepto C). */
export function SlideMapa({ model }: { model: UseModel }) {
  const { params, results } = model;
  const gUi = AUTO_UI[results.ganador.key];

  return (
    <SlideFrame eyebrow="Bonus de análisis" title="El mapa de la decisión">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="h-[440px]">
            <DecisionMap params={params} />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5">
          <p className="text-lg leading-relaxed text-muted">
            Cada punto cruza <b className="text-ink">cuánto manejás</b> (horizontal) con <b className="text-ink">cuánto
            sube la nafta</b> (vertical). El color dice qué auto gana ahí — y el límite entre colores es el
            <b className="text-ink"> punto de equilibrio</b>.
          </p>

          <div className="rounded-2xl border p-5" style={{ borderColor: gUi.color }}>
            <div className="text-xs uppercase tracking-wide text-faint">Martín cae en la zona del</div>
            <div className="mt-1 flex items-center gap-2 text-2xl font-bold" style={{ color: gUi.color }}>
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: gUi.color }} />
              {gUi.short}
            </div>
            <div className="mt-2 text-sm text-muted">
              {formatKmAnio(params.kmAnio)} · suba {formatPct(params.subaNaftaAnual)}/año
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {AUTO_KEYS.map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded" style={{ backgroundColor: AUTO_UI[k].soft, outline: `1px solid ${AUTO_UI[k].color}` }} />
                <span className="text-muted">{AUTO_UI[k].short}</span>
              </span>
            ))}
          </div>
          <p className="text-sm text-faint">
            Subí por el eje vertical (más inflación de nafta) y la zona verde del eléctrico se agranda: lo que ya vimos en
            la sensibilidad, ahora como mapa.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}

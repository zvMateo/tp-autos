"use client";

import { AUTO_KEYS } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { CostSurfaces3D } from "../charts/CostSurfaces3D";
import { formatKmAnio, formatPct } from "@/lib/format";

/** Slide 3D — las tres superficies de costo en el espacio (km × suba × costo). */
export function SlideEspacio({ model }: { model: UseModel }) {
  const { params, results } = model;
  const gUi = AUTO_UI[results.ganador.key];

  return (
    <SlideFrame eyebrow="Bonus de análisis · 3D" title="El costo, en relieve">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="h-[clamp(300px,52vh,520px)] w-full">
            <CostSurfaces3D params={params} />
          </div>
          <div className="pointer-events-none absolute bottom-3 left-4 text-xs text-faint">
            arrastrá para rotar · rueda para acercar
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5">
          <p className="text-lg leading-relaxed text-muted">
            Cada auto deja de ser una recta y pasa a ser una <b className="text-ink">superficie</b>: su costo total según{" "}
            <b className="text-ink">cuánto manejás</b> (un eje) y <b className="text-ink">cuánto sube la nafta</b> (el
            otro). La superficie que queda <b className="text-ink">más abajo</b> es el auto que conviene.
          </p>

          <div className="rounded-2xl border p-5" style={{ borderColor: gUi.color }}>
            <div className="text-xs uppercase tracking-wide text-faint">En el punto de Martín gana el</div>
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
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: AUTO_UI[k].soft, outline: `1px solid ${AUTO_UI[k].color}` }}
                />
                <span className="text-muted">{AUTO_UI[k].short}</span>
              </span>
            ))}
          </div>

          <p className="text-sm text-faint">
            El <b className="text-muted">mapa de decisión</b> de la slide anterior es esto mismo visto desde arriba: las
            zonas de color son qué superficie está más abajo, y los bordes entre colores son las{" "}
            <b className="text-muted">curvas de equilibrio</b> donde dos superficies se cruzan.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}

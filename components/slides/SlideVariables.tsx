"use client";

import { AUTO_KEYS } from "@/lib/model";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { CarCard } from "../CarCard";

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
      <p className="mt-6 inline-block rounded-lg bg-surface-2 px-4 py-2 text-sm text-faint">
        Datos reales de Córdoba (junio 2026), verificados con fuentes — ver la diapositiva «Fuentes».
      </p>
    </SlideFrame>
  );
}

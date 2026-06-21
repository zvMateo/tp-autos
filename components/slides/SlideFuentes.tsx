"use client";

import { SOURCES, type Confianza, type SourceEntry } from "@/lib/sources";
import { SlideFrame } from "./SlideFrame";

const BADGE: Record<Confianza, { label: string; cls: string }> = {
  alta: { label: "alta", cls: "bg-car-electrico-soft text-car-electrico" },
  media: { label: "media", cls: "bg-car-hibrido-soft text-car-hibrido" },
  baja: { label: "baja", cls: "bg-car-nafta-soft text-car-nafta" },
};

function Row({ e }: { e: SourceEntry }) {
  return (
    <li className="flex items-start justify-between gap-3 border-b border-line/60 py-2 last:border-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm text-ink">{e.label}</span>
          <span className="tnum font-mono text-xs text-muted">{e.value}</span>
        </div>
        {e.nota && <p className="mt-0.5 text-[11px] leading-snug text-faint">{e.nota}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${BADGE[e.confianza].cls}`}>
          {BADGE[e.confianza].label}
        </span>
        {e.url ? (
          <a
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-[8rem] truncate text-[11px] text-accent underline decoration-dotted"
          >
            {e.fuente}
          </a>
        ) : (
          <span className="text-[11px] text-faint">{e.fuente}</span>
        )}
      </div>
    </li>
  );
}

/** Slide 9 — Fuentes y confiabilidad (validación, subproceso (f) de Blomhøj). */
export function SlideFuentes() {
  const datos = SOURCES.filter((s) => s.kind === "dato");
  const supuestos = SOURCES.filter((s) => s.kind === "supuesto");

  return (
    <SlideFrame eyebrow="Validación · subproceso (f) de Blomhøj" title="Fuentes y confiabilidad">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-faint">Datos reales (con fuente)</h3>
          <ul>
            {datos.map((e) => (
              <Row key={e.label} e={e} />
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-faint">Supuestos del modelo</h3>
          <ul>
            {supuestos.map((e) => (
              <Row key={e.label} e={e} />
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed text-muted">
            <span className="font-semibold text-ink">Honestidad que valida el modelo:</span> el BYD Atto 3 se usa como
            EV comparable en tamaño, pero no se vende en Argentina a junio 2026 (precio de referencia internacional).
            Los EV chinos que sí se venden (BYD Yuan Pro ≈ $48M) son más baratos, así que la conclusión a favor del
            eléctrico es <span className="font-semibold text-ink">conservadora</span>.
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-faint">
        Validamos comparando el modelo con datos reales (subproceso de validación de Blomhøj).
        <span className="ml-2">🟢 alta = lookup verificable · 🟡 media · 🔴 baja = estimación de mercado.</span>
      </p>
    </SlideFrame>
  );
}

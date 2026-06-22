"use client";

import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { formatKmAnio, formatPct } from "@/lib/format";

/**
 * Núcleo del modelo traducido a Python — las MISMAS fórmulas que `lib/model.ts`.
 * Es contenido estático (código fuente de ejemplo), no un número calculado:
 * los resultados que se muestran abajo sí salen del modelo en vivo.
 */
const CODIGO = `def factor_capitalizacion(r, h):
    """Promedio de (1+r)^t sobre el horizonte. r=0 -> 1 (sin suba)."""
    return sum((1 + r) ** t for t in range(h)) / h

def ordenada(precio, horizonte, seguro, patente_pct):
    # lo FIJO: compra + (seguro + patente) por cada año
    return precio + horizonte * (seguro + precio * patente_pct)

def pendiente(consumo, precio_energia, mant_km):
    # lo VARIABLE por km: energía/km + mantenimiento/km
    return (consumo / 100) * precio_energia + mant_km

def cruce_km_anio(ord_a, pend_a, ord_b, pend_b, horizonte):
    """Km/año donde dos rectas se igualan. None si son paralelas."""
    if pend_a == pend_b:
        return None
    return (ord_b - ord_a) / (pend_a - pend_b) / horizonte

def cuota_francesa(gap, tna, meses):
    i = tna / 12                       # sistema francés (cuota fija)
    return gap * i / (1 - (1 + i) ** -meses)`;

interface Familia {
  color: string;
  familia: string;
  fn: string;
  para: string;
}

const FAMILIAS: Familia[] = [
  {
    color: "var(--accent)",
    familia: "Lineal",
    fn: "ordenada() · pendiente()",
    para: "El costo de cada auto, C(K) = b + m·K.",
  },
  {
    color: "var(--car-nafta)",
    familia: "Exponencial",
    fn: "factor_capitalizacion()",
    para: "La nafta y la luz que suben año a año.",
  },
  {
    color: "var(--car-electrico)",
    familia: "Igualación de rectas",
    fn: "cruce_km_anio()",
    para: "El punto de equilibrio entre dos autos.",
  },
  {
    color: "var(--car-hibrido)",
    familia: "Interés compuesto",
    fn: "cuota_francesa()",
    para: "La cuota del crédito prendario.",
  },
];

/**
 * Slide puente — La misma matemática en Python (hacia la próxima unidad).
 * Muestra que el modelo es independiente del lenguaje: las fórmulas de la app
 * (TypeScript) son idénticas en Python y dan el mismo número.
 */
export function SlidePython({ model }: { model: UseModel }) {
  // Equivalencia derivada del modelo (no hardcodeada): cruce nafta↔eléctrico
  // y el sobrecosto del prendario, los mismos que produce el código de arriba.
  const cruceNE = model.results.cruces[0]?.kmAnio ?? null;
  const interesesPct = model.results.finanzas.prendario.interesesPct;

  return (
    <SlideFrame eyebrow="Puente · próxima unidad" title="La misma matemática, en Python" graphPaper>
      <p className="mb-6 max-w-3xl text-lg leading-relaxed text-muted">
        La app está hecha en <strong className="text-ink">TypeScript</strong>, pero el modelo no depende del lenguaje. Estas
        son las mismas fórmulas escritas en <strong className="text-ink">Python</strong> —el puente hacia la próxima unidad
        de la materia—. <span className="text-faint">No es que el TP esté programado en Python: es la traducción del modelo.</span>
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface-2 p-5 shadow-sm">
          <pre className="tnum font-mono text-[12.5px] leading-relaxed text-ink sm:text-[13.5px]">
            <code>{CODIGO}</code>
          </pre>
        </div>

        <div className="grid content-start gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-faint">
            Una función por familia de la materia
          </p>
          {FAMILIAS.map((f) => (
            <div key={f.familia} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: f.color }} />
                <span className="text-sm font-semibold text-ink">{f.familia}</span>
              </div>
              <div className="mt-1.5 font-mono text-xs text-accent">{f.fn}</div>
              <div className="mt-1 text-xs text-muted">{f.para}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-accent/40 bg-accent-soft/40 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-accent">El mismo número en los dos lenguajes</div>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted">
          Con los parámetros actuales, el cruce nafta↔eléctrico da{" "}
          <strong className="text-ink">{cruceNE !== null ? formatKmAnio(cruceNE) : "—"}</strong> y el prendario suma{" "}
          <strong className="text-ink">{formatPct(interesesPct)}</strong> de intereses —tanto en la app (TypeScript) como
          con estas funciones en Python—. La matemática es la misma; cambia solo cómo se escribe.
        </p>
      </div>
    </SlideFrame>
  );
}

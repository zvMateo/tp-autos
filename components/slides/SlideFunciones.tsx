"use client";

import { SlideFrame } from "./SlideFrame";

interface FamiliaMateria {
  nombre: string;
  idea: string;
  usada: boolean;
  color: string;
}

/**
 * Las familias de función que enseña la materia (consigna de la profe,
 * "MODELIZACIÓN MATEMÁTICA"). Marcamos cuáles usa este TP: mostrar que
 * conocemos todo el temario y elegimos las pertinentes es parte de la defensa.
 */
const FAMILIAS: FamiliaMateria[] = [
  { nombre: "Lineal", idea: "Tasa de cambio constante. Costo total, punto de equilibrio.", usada: true, color: "var(--accent)" },
  { nombre: "Exponencial", idea: "Crecimiento/decrecimiento rápido. Suba de nafta y de luz.", usada: true, color: "var(--car-nafta)" },
  { nombre: "Interés compuesto", idea: "Los intereses generan intereses. La cuota del prendario.", usada: true, color: "var(--car-hibrido)" },
  { nombre: "Porcentajes", idea: "Aumentos, descuentos, comisiones. Patente, IVA, intereses.", usada: true, color: "var(--car-electrico)" },
  { nombre: "Cuadrática", idea: "Optimización con un máximo o mínimo (ganancia, demanda).", usada: false, color: "var(--line-strong)" },
  { nombre: "Proporcionalidad", idea: "Directa e inversa: una crece, la otra crece o baja igual.", usada: false, color: "var(--line-strong)" },
  { nombre: "Interés simple", idea: "Interés solo sobre el capital inicial. Acá usamos el compuesto.", usada: false, color: "var(--line-strong)" },
];

/**
 * Slide 2 — ¿Qué son las funciones? Marco teórico de la materia (consigna).
 * Define qué es modelizar con funciones, presenta LA FÓRMULA PRINCIPAL del
 * trabajo (la lineal de costo total) y ubica las familias del temario.
 */
export function SlideFunciones() {
  return (
    <SlideFrame eyebrow="El lenguaje del trabajo · la materia" title="¿Qué son las funciones?" graphPaper>
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-lg leading-relaxed text-muted">
            Una <strong className="text-ink">función</strong> relaciona dos variables: a cada valor de entrada le asigna{" "}
            <strong className="text-ink">un único</strong> valor de salida. <strong className="text-ink">Modelizar</strong> es
            elegir la función que mejor representa la dinámica de un problema real —traducirlo al lenguaje matemático—.
          </p>

          <div className="mt-6 rounded-2xl border-2 border-accent/40 bg-accent-soft/40 p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-accent">La fórmula principal del trabajo</div>
            <div className="tnum mt-2 font-mono text-2xl text-ink sm:text-3xl">
              C(K) = b + m·K
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li>
                <span className="font-mono text-ink">b</span> = lo <strong className="text-ink">fijo</strong> (compra, seguro,
                patente) · <span className="font-mono text-ink">m</span> = lo <strong className="text-ink">variable</strong> por
                km (energía + mantenimiento) · <span className="font-mono text-ink">K</span> = kilómetros.
              </li>
              <li>
                Cada auto es una recta. De ahí sale el <strong className="text-ink">punto de equilibrio</strong>:{" "}
                <span className="tnum font-mono text-ink">K* = (b₂−b₁) / (m₁−m₂)</span>.
              </li>
            </ul>
            <p className="mt-3 text-xs text-faint">
              Es una función <strong className="text-muted">lineal</strong>. Las demás familias (exponencial, interés compuesto,
              porcentajes) no compiten con ella: le calculan los parámetros <span className="font-mono">b</span> y{" "}
              <span className="font-mono">m</span>.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-faint">
            Las familias que enseña la materia
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {FAMILIAS.map((f) => (
              <div
                key={f.nombre}
                className={`rounded-xl border p-3 ${f.usada ? "border-line bg-surface" : "border-line/60 bg-surface/40"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className={`text-sm font-semibold ${f.usada ? "text-ink" : "text-faint"}`}>{f.nombre}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      f.usada ? "bg-accent-soft text-accent" : "text-faint"
                    }`}
                  >
                    {f.usada ? "En el TP" : "Del temario"}
                  </span>
                </div>
                <p className={`mt-1.5 text-xs leading-snug ${f.usada ? "text-muted" : "text-faint"}`}>{f.idea}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-faint">
            Conocemos todo el temario; el caso usa cuatro familias y deja las otras como herramientas que no hicieron falta.
          </p>
        </div>
      </div>

      <p className="mt-7 max-w-4xl text-sm leading-relaxed text-muted">
        <strong className="text-ink">Regla base:</strong> el marco —qué familias de función existen, los pasos de modelización
        y cómo se valida— sale de los archivos de la materia (la consigna y el ciclo de Blomhøj). Los datos, de fuentes reales
        de Córdoba 2026.
      </p>
    </SlideFrame>
  );
}

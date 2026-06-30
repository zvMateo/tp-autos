"use client";

import type { ReactNode } from "react";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { formatKmAnio } from "@/lib/format";

interface Paso {
  label: string;
  hizo: ReactNode;
}

/**
 * Slide de cierre — los seis subprocesos de modelización de Blomhøj (la materia).
 * Recap del MÉTODO: muestra que el TP recorrió el ciclo entero, del problema real
 * a la validación con datos. El km del cruce sale del modelo en vivo (no hardcodeado).
 */
export function SlideBlomhoj({ model }: { model: UseModel }) {
  const cruceNE = model.results.cruces[0]?.kmAnio ?? null;
  const cruceTxt = cruceNE !== null ? formatKmAnio(cruceNE) : "—";

  const PASOS: Paso[] = [
    {
      label: "Formular",
      hizo: (
        <>
          Planteamos el problema: ¿qué auto le conviene a <strong className="text-ink">Martín</strong> y cómo pagarlo?
        </>
      ),
    },
    {
      label: "Sistematizar",
      hizo: (
        <>
          Elegimos las variables que de verdad importan —precio, consumo, kilómetros, energía, seguro, patente y tasas— y
          dejamos el resto de lado.
        </>
      ),
    },
    {
      label: "Matematizar",
      hizo: (
        <>
          Convertimos eso en funciones: las <strong className="text-ink">tres rectas</strong> de costo, la{" "}
          <strong className="text-ink">exponencial</strong> de la nafta y la luz, y la <strong className="text-ink">cuota</strong>{" "}
          del crédito.
        </>
      ),
    },
    {
      label: "Analizar",
      hizo: (
        <>
          Buscamos los cruces, hicimos la sensibilidad y comparamos las formas de pago.
        </>
      ),
    },
    {
      label: "Interpretar",
      hizo: (
        <>
          Volvimos al mundo real: a Martín le conviene el <strong className="text-ink">nafta</strong> hasta unos{" "}
          <strong className="text-ink">{cruceTxt}</strong>.
        </>
      ),
    },
    {
      label: "Validar",
      hizo: (
        <>
          Comparamos con datos reales de 2026 y reconocimos los <strong className="text-ink">límites</strong> del modelo.
        </>
      ),
    },
  ];

  return (
    <SlideFrame eyebrow="Cierre · el método de la materia" title="Los seis subprocesos de Blomhøj" graphPaper>
      <p className="mb-6 max-w-3xl text-lg leading-relaxed text-muted">
        Para cerrar: esto <strong className="text-ink">no lo inventamos</strong>. Seguimos los{" "}
        <strong className="text-ink">seis subprocesos de modelización de Blomhøj</strong> que vimos en la materia —y los
        recorrimos enteros, del problema real a la validación—.
      </p>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PASOS.map((p, i) => {
          const destacado = p.label === "Interpretar";
          return (
            <li
              key={p.label}
              className={`rounded-2xl border p-4 ${
                destacado ? "border-accent/40 bg-accent-soft/30" : "border-line bg-surface"
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="tnum font-mono text-2xl font-bold leading-none text-accent">{i + 1}</span>
                <span className="text-sm font-semibold uppercase tracking-wide text-ink">{p.label}</span>
              </div>
              <p className="mt-2 text-sm leading-snug text-muted">{p.hizo}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-2xl border-2 border-accent/40 bg-accent-soft/40 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-accent">Recorrimos el ciclo entero</div>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted">
          Por eso el trabajo no es una cuenta suelta, sino un <strong className="text-ink">modelo</strong>: se puede defender,
          criticar y mejorar. El badge de cada slide muestra en qué fase del ciclo estábamos —se evalúa el{" "}
          <strong className="text-ink">proceso</strong>, no sólo el número final—.
        </p>
      </div>
    </SlideFrame>
  );
}

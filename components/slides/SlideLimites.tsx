"use client";

import { SlideFrame } from "./SlideFrame";

interface Limite {
  titulo: string;
  detalle: string;
  color: string;
}

const LIMITES: Limite[] = [
  {
    titulo: "Costo de oportunidad del capital",
    detalle:
      "Los $30.000.000 que Martín pone en el auto podrían rendir invertidos (plazo fijo, dólares). El modelo no descuenta ese rendimiento perdido del costo de tener el auto.",
    color: "var(--car-electrico)",
  },
  {
    titulo: "Tiempo y conveniencia de carga",
    detalle:
      "Cargar el eléctrico lleva horas; la nafta, minutos. El modelo cuenta pesos, no el tiempo perdido ni la comodidad —que para quien trabaja con el auto pesan.",
    color: "var(--car-hibrido)",
  },
  {
    titulo: "Infraestructura de carga",
    detalle:
      "En Córdoba y el interior la red de carga pública es escasa. Es un riesgo real de uso del eléctrico que el modelo no pone en plata.",
    color: "var(--car-nafta)",
  },
  {
    titulo: "Disponibilidad del eléctrico",
    detalle:
      "El BYD Atto 3 se usa como referencia internacional: a junio 2026 no se vende oficialmente en Argentina. El número existe; el auto en la concesionaria, no.",
    color: "var(--accent)",
  },
];

/** Slide — Validación: lo que el modelo deja afuera (fase crítica de Blomhøj). */
export function SlideLimites() {
  return (
    <SlideFrame eyebrow="Validación · los límites" title="Lo que el modelo no captura">
      <p className="max-w-3xl text-lg leading-relaxed text-muted">
        Un buen modelo sabe lo que <strong className="text-ink">no</strong> mide. Estos factores quedan afuera del número
        final —reconocerlos es parte de validar el modelo, no una falla.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {LIMITES.map((l) => (
          <div key={l.titulo} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: l.color }} />
              <h3 className="text-base font-semibold text-ink">{l.titulo}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{l.detalle}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border-2 border-accent/40 bg-accent-soft/40 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-accent">
          El que más nos costó: valor de reventa
        </div>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted">
          Un auto se vende al final, y eso cambia el costo real. Investigamos la depreciación a 5 años: los Toyota nafta
          e híbrido retienen ~<strong className="text-ink">60%</strong> de su valor (dato construido con precios de
          usados en dólares, confianza media). Pero el{" "}
          <strong className="text-ink">eléctrico no tiene mercado de reventa local confiable</strong> —ni se vende en el
          país—, así que el único número disponible es un supuesto extranjero de baja confianza.{" "}
          <strong className="text-ink">Decidimos no modelarlo:</strong> meter una reventa firme para los autos con datos
          y un supuesto flojo para el eléctrico sesgaría la comparación. Preferimos dejarlo como límite explícito.
        </p>
      </div>
    </SlideFrame>
  );
}

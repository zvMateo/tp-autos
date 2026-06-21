"use client";

import { AUTO_KEYS } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { formatMoney, formatNumber } from "@/lib/format";

function Capa({ color, titulo, formula, ejemplo }: { color: string; titulo: string; formula: string; ejemplo: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-ink">{titulo}</span>
      </div>
      <div className="tnum mt-2 font-mono text-sm text-accent">{formula}</div>
      <div className="mt-1 text-xs text-muted">{ejemplo}</div>
    </div>
  );
}

/** Slide 4 — La matemática: las 3 rectas + las 4 familias de funciones. */
export function SlideMatematica({ model }: { model: UseModel }) {
  const { results } = model;
  return (
    <SlideFrame eyebrow="La matemática" title="Una recta por auto" graphPaper>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="mb-5 text-lg text-muted">
            El costo de <em>tener</em> cada auto durante el horizonte es una recta:
          </p>
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <div className="mb-4 tnum font-mono text-sm text-ink">
              C(K) = <span className="text-faint">ordenada</span> + <span className="text-faint">pendiente</span> · K
            </div>
            <div className="space-y-3">
              {AUTO_KEYS.map((k) => {
                const c = results.autos[k];
                const ui = AUTO_UI[k];
                return (
                  <div key={k} className="tnum font-mono text-sm sm:text-base">
                    <span className="font-semibold" style={{ color: ui.color }}>
                      {ui.short.padEnd(9, " ")}
                    </span>{" "}
                    <span className="text-ink">
                      {formatMoney(c.ordenada)} + ${formatNumber(c.pendiente, 1)}·K
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-muted">
            <li>
              <strong className="text-ink">Ordenada</strong> = lo fijo: compra + patente + seguro. El eléctrico arranca
              más arriba.
            </li>
            <li>
              <strong className="text-ink">Pendiente</strong> = lo que cuesta cada km: energía + mantenimiento. El
              eléctrico es el más barato por km.
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-faint">
            Cuatro familias en la misma decisión
          </p>
          <div className="grid gap-3">
            <Capa
              color="var(--accent)"
              titulo="Lineal"
              formula="C(K) = b + m·K"
              ejemplo="Costo total de cada auto según los km."
            />
            <Capa
              color="var(--car-nafta)"
              titulo="Exponencial"
              formula="nafta(t) = nafta₀·(1+r)ᵗ"
              ejemplo="El precio de la nafta sube año a año."
            />
            <Capa
              color="var(--car-electrico)"
              titulo="Interés compuesto"
              formula="cuota = gap·i / (1−(1+i)⁻ⁿ)"
              ejemplo="La cuota del prendario y el plazo fijo."
            />
            <Capa
              color="var(--car-hibrido)"
              titulo="Porcentajes"
              formula="patente = 3,5% · valor"
              ejemplo="Patente, inflación del auto, intereses."
            />
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

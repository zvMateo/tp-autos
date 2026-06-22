"use client";

import { AUTO_KEYS, costoEnKm } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { formatKm, formatMoney, formatNumber } from "@/lib/format";

/** Puntos de K (km totales) donde mostrar los pares ordenados (K, C(K)). */
const K_TABLA = [0, 25_000, 50_000, 75_000, 100_000];

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

/** Slide 4 — La matemática: las 3 rectas, las 4 familias y la tabla de pares ordenados. */
export function SlideMatematica({ model }: { model: UseModel }) {
  const { results } = model;

  // Pares ordenados (K, C(K)) de cada recta + cuál es el más barato en cada K.
  const filas = K_TABLA.map((K) => {
    const costos = AUTO_KEYS.map((k) => ({ k, c: costoEnKm(results.autos[k], K) }));
    const minKey = costos.reduce((a, b) => (b.c < a.c ? b : a)).k;
    return { K, costos, minKey };
  });

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
              formula="energía(t) = precio₀·(1+r)ᵗ"
              ejemplo="El precio de la nafta y el de la luz suben año a año."
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
              formula="patente = 3% · valor"
              ejemplo="Patente, inflación del auto, intereses."
            />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="text-sm font-semibold text-ink">Tabla de pares ordenados (K, C(K))</h3>
          <span className="text-xs text-faint">K = km totales · costo de tener cada auto · el más barato resaltado</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-faint">
                <th className="py-2 pr-4 font-semibold">K (km totales)</th>
                {AUTO_KEYS.map((k) => (
                  <th key={k} className="py-2 pr-4 font-semibold" style={{ color: AUTO_UI[k].color }}>
                    {AUTO_UI[k].short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tnum font-mono">
              {filas.map((f) => (
                <tr key={f.K} className="border-t border-line/60">
                  <td className="py-2 pr-4 text-muted">{formatKm(f.K)}</td>
                  {f.costos.map(({ k, c }) => {
                    const esMin = k === f.minKey;
                    return (
                      <td
                        key={k}
                        className={`py-2 pr-4 ${esMin ? "font-semibold" : "text-muted"}`}
                        style={esMin ? { color: AUTO_UI[k].color } : undefined}
                      >
                        {formatMoney(c)}
                        {esMin && <span className="ml-1 text-[10px]">●</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-xs text-muted">
          Cada fila es un punto de las tres rectas. Se lee el cruce: a pocos km el más barato es el nafta; al crecer K, el
          eléctrico (pendiente menor) lo alcanza y lo pasa.
        </p>
      </div>
    </SlideFrame>
  );
}

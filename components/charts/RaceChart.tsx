"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { AUTO_KEYS, costoEnKm, type AutoKey, type Params } from "@/lib/model";
import type { ModelResults } from "@/lib/useModel";
import { AUTO_UI } from "@/lib/autos";
import { formatKmAnio, formatMoney, formatMoneyM, formatNumber } from "@/lib/format";

interface RaceChartProps {
  params: Params;
  results: ModelResults;
}

// viewBox del SVG (unidades internas; el SVG escala al contenedor)
const W = 860;
const H = 470;
const M = { left: 92, right: 44, top: 28, bottom: 52 };

const EMOJI: Record<AutoKey, string> = { nafta: "🚗", hibrido: "🚙", electrico: "⚡" };

/**
 * Carrera de costos — las rectas son pistas; un auto por cada una avanza con K.
 * El que va más abajo (más barato) lidera; en el cruce, el eléctrico adelanta.
 * Las líneas se autodibujan al montar (pincelada de scrollytelling).
 */
export function RaceChart({ params, results }: RaceChartProps) {
  const reduce = useReducedMotion();
  const calcs = results.autos;
  const kmTot = results.kmTot;
  const maxKm = Math.max(200_000, kmTot * 1.2);
  const maxCost = Math.max(...AUTO_KEYS.map((k) => costoEnKm(calcs[k], maxKm))) * 1.05;

  const xPx = (km: number) => M.left + (km / maxKm) * (W - M.left - M.right);
  const yPx = (cost: number) => H - M.bottom - (cost / maxCost) * (H - M.top - M.bottom);

  const [t, setT] = useState(reduce ? 1 : 0);
  const [playing, setPlaying] = useState(false);
  const ctrl = useRef<AnimationPlaybackControls | null>(null);

  // autodibujo de las rectas al montar
  const [drawn, setDrawn] = useState(reduce);
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setDrawn(true), 60);
    return () => clearTimeout(id);
  }, [reduce]);

  useEffect(() => () => ctrl.current?.stop(), []);

  const play = () => {
    ctrl.current?.stop();
    setPlaying(true);
    setT(0);
    ctrl.current = animate(0, 1, {
      duration: 6.5,
      ease: "linear",
      onUpdate: setT,
      onComplete: () => setPlaying(false),
    });
  };
  const reset = () => {
    ctrl.current?.stop();
    setPlaying(false);
    setT(reduce ? 1 : 0);
  };

  const kmActual = t * maxKm;
  const posiciones = AUTO_KEYS.map((k) => ({
    k,
    cost: costoEnKm(calcs[k], kmActual),
  })).sort((a, b) => a.cost - b.cost);
  const lider = posiciones[0].k;

  const ticksX = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxKm);
  const ticksY = [0.25, 0.5, 0.75, 1].map((f) => f * maxCost);
  const crosses = results.cruces.filter((c) => c.valido && c.kmTotales != null && (c.kmTotales as number) <= maxKm);

  return (
    <div className="flex h-full flex-col">
      {/* Controles + marcador en vivo */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={play}
            disabled={playing}
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-40"
          >
            {playing ? "Corriendo…" : "▶ Largar carrera"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            Reiniciar
          </button>
        </div>
        <div className="text-sm">
          <span className="text-muted">En </span>
          <span className="tnum font-mono text-ink">{formatKmAnio(kmActual / params.horizonteAnios)}</span>
          <span className="text-muted"> va ganando </span>
          <span className="font-semibold" style={{ color: AUTO_UI[lider].color }}>
            {AUTO_UI[lider].short}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Carrera de costos: cada auto avanza sobre su recta de costo"
        >
          {/* grilla */}
          {ticksY.map((c, i) => (
            <g key={`gy${i}`}>
              <line x1={M.left} y1={yPx(c)} x2={W - M.right} y2={yPx(c)} stroke="var(--line)" strokeDasharray="2 5" />
              <text x={M.left - 10} y={yPx(c) + 4} textAnchor="end" fontSize="13" fill="var(--muted)" fontFamily="monospace">
                {formatMoneyM(c)}
              </text>
            </g>
          ))}
          {ticksX.map((km, i) => (
            <text key={`gx${i}`} x={xPx(km)} y={H - M.bottom + 22} textAnchor="middle" fontSize="13" fill="var(--muted)" fontFamily="monospace">
              {formatNumber(km / 1000)}k
            </text>
          ))}
          <text x={(M.left + W - M.right) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="var(--faint)">
            km totales en {params.horizonteAnios} años
          </text>

          {/* ejes */}
          <line x1={M.left} y1={M.top} x2={M.left} y2={H - M.bottom} stroke="var(--line-strong)" />
          <line x1={M.left} y1={H - M.bottom} x2={W - M.right} y2={H - M.bottom} stroke="var(--line-strong)" />

          {/* rectas (pistas) que se autodibujan */}
          {AUTO_KEYS.map((k) => {
            const x0 = xPx(0);
            const y0 = yPx(calcs[k].ordenada);
            const x1 = xPx(maxKm);
            const y1 = yPx(costoEnKm(calcs[k], maxKm));
            return (
              <motion.line
                key={`line${k}`}
                x1={x0}
                y1={y0}
                x2={x1}
                y2={y1}
                stroke={AUTO_UI[k].color}
                strokeWidth={k === lider ? 4 : 2.5}
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: drawn ? 1 : 0, opacity: k === lider ? 1 : 0.85 }}
                transition={{ pathLength: { duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] } }}
              />
            );
          })}

          {/* línea de Martín */}
          <line x1={xPx(kmTot)} y1={M.top} x2={xPx(kmTot)} y2={H - M.bottom} stroke="var(--ink)" strokeDasharray="5 4" />
          <text x={xPx(kmTot)} y={M.top - 8} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--ink)">
            Martín · {formatNumber(params.kmAnio)} km/año
          </text>

          {/* puntos de equilibrio */}
          {crosses.map((c, i) => {
            const cx = xPx(c.kmTotales as number);
            const cy = yPx(costoEnKm(calcs[c.a], c.kmTotales as number));
            return (
              <g key={`cx${i}`}>
                <circle cx={cx} cy={cy} r={5} fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} />
                <text x={cx} y={cy - 12 - i * 15} textAnchor="middle" fontSize="11" fill="var(--faint)" fontFamily="monospace">
                  {formatNumber(c.kmAnio as number)}/año
                </text>
              </g>
            );
          })}

          {/* autos corriendo */}
          {AUTO_KEYS.map((k) => {
            const cx = xPx(kmActual);
            const cy = yPx(costoEnKm(calcs[k], kmActual));
            const esLider = k === lider;
            return (
              <g key={`car${k}`}>
                {esLider && (
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={20}
                    fill="none"
                    stroke={AUTO_UI[k].color}
                    strokeWidth={2}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 0.15, 0.5], scale: [0.9, 1.15, 0.9] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                )}
                <circle cx={cx} cy={cy} r={13} fill={AUTO_UI[k].color} />
                <text x={cx} y={cy + 5} textAnchor="middle" fontSize="15">
                  {EMOJI[k]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* posiciones actuales */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs">
        {posiciones.map((p, i) => (
          <span key={p.k} className="flex items-center gap-1.5">
            <span className="font-mono text-faint">{i + 1}º</span>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: AUTO_UI[p.k].color }} />
            <span className={i === 0 ? "font-semibold text-ink" : "text-muted"}>{AUTO_UI[p.k].short}</span>
            <span className="tnum font-mono text-faint">{formatMoney(p.cost)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

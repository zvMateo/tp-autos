"use client";

import { useMemo } from "react";
import { AUTO_KEYS, calcularAutos, type AutoKey, type Params } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";
import { formatNumber } from "@/lib/format";

interface DecisionMapProps {
  params: Params;
}

const W = 820;
const H = 460;
const M = { left: 64, right: 22, top: 22, bottom: 50 };
const COLS = 96; // resolución del heatmap (bordes más finos)
const ROWS = 60;
const MAXKM = 50_000;

interface Centroide {
  k: AutoKey;
  x: number;
  y: number;
  frac: number;
}

/**
 * Mapa de decisión — para cada combinación de km/año (X) y suba de nafta (Y),
 * pinta qué auto gana. El cruce se vuelve una frontera entre regiones de color.
 * Cada región se rotula en su centroide para que se lea aun la franja angosta
 * del híbrido.
 */
export function DecisionMap({ params }: DecisionMapProps) {
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  const { cells, centroides } = useMemo(() => {
    const arr: { x: number; y: number; w: number; h: number; k: AutoKey }[] = [];
    const acc: Record<AutoKey, { x: number; y: number; n: number }> = {
      nafta: { x: 0, y: 0, n: 0 },
      hibrido: { x: 0, y: 0, n: 0 },
      electrico: { x: 0, y: 0, n: 0 },
    };
    const cw = plotW / COLS;
    const ch = plotH / ROWS;
    for (let c = 0; c < COLS; c++) {
      const km = ((c + 0.5) / COLS) * MAXKM;
      for (let r = 0; r < ROWS; r++) {
        const suba = (r + 0.5) / ROWS; // 0..1
        const a = calcularAutos({ ...params, kmAnio: km, subaNaftaAnual: suba });
        let best: AutoKey = "nafta";
        let bc = Infinity;
        AUTO_KEYS.forEach((k) => {
          if (a[k].costoTotal < bc) {
            bc = a[k].costoTotal;
            best = k;
          }
        });
        const x = M.left + (c / COLS) * plotW;
        const y = M.top + (1 - (r + 1) / ROWS) * plotH;
        arr.push({ x, y, w: cw + 0.6, h: ch + 0.6, k: best });
        acc[best].x += x + cw / 2;
        acc[best].y += y + ch / 2;
        acc[best].n += 1;
      }
    }
    const total = COLS * ROWS;
    const centroides: Centroide[] = AUTO_KEYS.map((k) =>
      acc[k].n > 0 ? { k, x: acc[k].x / acc[k].n, y: acc[k].y / acc[k].n, frac: acc[k].n / total } : null,
    ).filter((v): v is Centroide => v !== null);
    return { cells: arr, centroides };
  }, [params, plotW, plotH]);

  const mx = M.left + (Math.min(params.kmAnio, MAXKM) / MAXKM) * plotW;
  const my = M.top + (1 - Math.min(params.subaNaftaAnual, 1)) * plotH;

  const ticksX = [0, 10_000, 20_000, 30_000, 40_000, 50_000];
  const ticksY = [0, 25, 50, 75, 100];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa de decisión: qué auto conviene según km por año y suba de la nafta"
    >
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} fill={AUTO_UI[c.k].soft} />
      ))}

      {/* etiquetas de zona (en el centroide de cada región; solo si tiene presencia real) */}
      {centroides
        .filter((c) => c.frac > 0.015)
        .map((c) => (
          <text
            key={`lbl${c.k}`}
            x={c.x}
            y={c.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="700"
            fill={AUTO_UI[c.k].color}
            stroke="var(--surface)"
            strokeWidth={3.5}
            style={{ paintOrder: "stroke" }}
          >
            {AUTO_UI[c.k].short}
          </text>
        ))}

      {/* ejes */}
      <rect x={M.left} y={M.top} width={plotW} height={plotH} fill="none" stroke="var(--line-strong)" />
      {ticksX.map((km, i) => (
        <text key={`x${i}`} x={M.left + (km / MAXKM) * plotW} y={H - M.bottom + 20} textAnchor="middle" fontSize="12" fill="var(--muted)" fontFamily="monospace">
          {formatNumber(km / 1000)}k
        </text>
      ))}
      {ticksY.map((p, i) => (
        <text key={`y${i}`} x={M.left - 10} y={M.top + (1 - p / 100) * plotH + 4} textAnchor="end" fontSize="12" fill="var(--muted)" fontFamily="monospace">
          {p}%
        </text>
      ))}
      <text x={M.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="var(--faint)">km por año →</text>
      <text x={16} y={M.top + plotH / 2} textAnchor="middle" fontSize="12" fill="var(--faint)" transform={`rotate(-90 16 ${M.top + plotH / 2})`}>↑ suba de la nafta</text>

      {/* Martín */}
      <circle cx={mx} cy={my} r={11} fill="none" stroke="var(--ink)" strokeWidth={2} opacity={0.4} />
      <circle cx={mx} cy={my} r={5} fill="var(--ink)" />
      <text x={mx + 12} y={my - 8} fontSize="12" fontWeight="600" fill="var(--ink)" stroke="var(--surface)" strokeWidth={3} style={{ paintOrder: "stroke" }}>Martín</text>
    </svg>
  );
}

/**
 * autos.ts — metadata visual por auto (color + etiqueta corta).
 * Los colores apuntan a CSS custom properties definidas en app/globals.css,
 * así son la MISMA fuente para tarjetas, chips y gráficos (Recharts acepta
 * `var(--...)` en stroke/fill).
 */
import type { AutoKey } from "./model";

export interface AutoUI {
  short: string;
  /** Color sólido (línea, texto, acento) */
  color: string;
  /** Color tenue (fondos, áreas) */
  soft: string;
}

export const AUTO_UI: Record<AutoKey, AutoUI> = {
  nafta: { short: "Nafta", color: "var(--car-nafta)", soft: "var(--car-nafta-soft)" },
  hibrido: { short: "Híbrido", color: "var(--car-hibrido)", soft: "var(--car-hibrido-soft)" },
  electrico: { short: "Eléctrico", color: "var(--car-electrico)", soft: "var(--car-electrico-soft)" },
};

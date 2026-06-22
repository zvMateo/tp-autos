"use client";

/**
 * Ciclo de modelización matemática de Blomhøj (6 subprocesos).
 * El orden es el recorrido teórico; el badge resalta en qué fase está cada slide,
 * para que se evalúe el PROCESO de modelización y no sólo el resultado.
 */
export const FASES = [
  "formular",
  "sistematizar",
  "matematizar",
  "analizar",
  "interpretar",
  "validar",
] as const;

export type Fase = (typeof FASES)[number];

const FASE_LABEL: Record<Fase, string> = {
  formular: "Formular",
  sistematizar: "Sistematizar",
  matematizar: "Matematizar",
  analizar: "Analizar",
  interpretar: "Interpretar",
  validar: "Validar",
};

/**
 * Mapa slide → fase del ciclo. Vive con el badge (es su configuración).
 * `null` = slide transversal sin fase (portada, fuentes).
 */
const FASE_POR_SLIDE: Record<string, Fase | null> = {
  portada: null,
  funciones: null,
  problema: "formular",
  variables: "sistematizar",
  matematica: "matematizar",
  grafico: "analizar",
  sensibilidad: "analizar",
  mapa: "analizar",
  espacio: "analizar",
  pago: "analizar",
  limites: "validar",
  conclusion: "interpretar",
  fuentes: null,
};

export function faseDeSlide(slideId: string): Fase | null {
  return FASE_POR_SLIDE[slideId] ?? null;
}

/**
 * Badge del ciclo de Blomhøj: 6 segmentos (uno por subproceso) con la fase
 * actual resaltada y nombrada. Discreto, pensado para una esquina del slide.
 * Si `fase` es null no renderiza nada.
 */
export function FaseBadge({ fase }: { fase: Fase | null }) {
  if (!fase) return null;
  const activo = FASES.indexOf(fase);
  return (
    <div
      className="pointer-events-none flex items-center gap-2.5 rounded-full border border-line bg-surface/80 px-3 py-1.5 shadow-sm backdrop-blur-sm"
      aria-label={`Ciclo de modelización, fase actual: ${FASE_LABEL[fase]}`}
    >
      <span className="hidden text-[10px] font-medium uppercase tracking-[0.15em] text-faint sm:inline">
        Modelización
      </span>
      <span className="flex items-center gap-1" aria-hidden>
        {FASES.map((f, i) => (
          <span
            key={f}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === activo ? 16 : 6,
              backgroundColor:
                i === activo ? "var(--accent)" : i < activo ? "var(--line-strong)" : "var(--line)",
            }}
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-accent">{FASE_LABEL[fase]}</span>
    </div>
  );
}

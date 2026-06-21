"use client";

import { motion } from "framer-motion";

export type Mode = "presentacion" | "calculadora";

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const OPTS: { id: Mode; label: string }[] = [
  { id: "presentacion", label: "Presentación" },
  { id: "calculadora", label: "Calculadora" },
];

/** Toggle segmentado con pastilla deslizante (framer-motion layoutId). */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 p-1">
      {OPTS.map((o) => {
        const active = mode === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            style={{ color: active ? "white" : "var(--muted)" }}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="modePill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

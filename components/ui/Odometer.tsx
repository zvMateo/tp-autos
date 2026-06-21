"use client";

import { motion, useReducedMotion } from "framer-motion";

interface OdometerProps {
  value: number;
  format: (n: number) => string;
  className?: string;
}

function Digit({ d, reduce }: { d: number; reduce: boolean }) {
  return (
    <span style={{ display: "inline-block", height: "1em", overflow: "hidden", verticalAlign: "top" }}>
      <motion.span
        style={{ display: "flex", flexDirection: "column", height: "10em" }}
        animate={{ y: `${-d * 10}%` }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 130, damping: 20 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} style={{ height: "1em", lineHeight: 1 }}>
            {i}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Número estilo odómetro: cada dígito es un rodillo que gira al cambiar el valor.
 * On-theme (cuentakilómetros) y suave al arrastrar sliders. Respeta reduced-motion.
 */
export function Odometer({ value, format, className }: OdometerProps) {
  const reduce = !!useReducedMotion();
  const s = format(Math.round(value));
  return (
    <span className={className} style={{ display: "inline-flex", lineHeight: 1 }} aria-label={s}>
      {s.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <Digit key={i} d={Number(ch)} reduce={reduce} />
        ) : (
          <span key={i} style={{ display: "inline-block" }} aria-hidden>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

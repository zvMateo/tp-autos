"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: number;
  format: (n: number) => string;
  durationMs?: number;
  className?: string;
}

/** Número que se anima (count-up) cuando cambia. Respeta prefers-reduced-motion. */
export function CountUp({ value, format, durationMs = 500, className }: CountUpProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, durationMs, reduce]);

  return (
    <span className={className} suppressHydrationWarning>
      {format(display)}
    </span>
  );
}

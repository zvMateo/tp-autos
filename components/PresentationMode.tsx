"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { UseModel } from "@/lib/useModel";
import { SlidePortada } from "./slides/SlidePortada";
import { SlideProblema } from "./slides/SlideProblema";
import { SlideVariables } from "./slides/SlideVariables";
import { SlideMatematica } from "./slides/SlideMatematica";
import { SlideGrafico } from "./slides/SlideGrafico";
import { SlideSensibilidad } from "./slides/SlideSensibilidad";
import { SlidePago } from "./slides/SlidePago";
import { SlideConclusion } from "./slides/SlideConclusion";
import { SlideLimites } from "./slides/SlideLimites";
import { SlideFuentes } from "./slides/SlideFuentes";
import { SlideMapa } from "./slides/SlideMapa";
import { FaseBadge, faseDeSlide } from "./FaseBadge";
import dynamic from "next/dynamic";

// Lazy-load del slide 3D: three.js / R3F solo se descargan al entrar a esta slide.
const SlideEspacio = dynamic(() => import("./slides/SlideEspacio").then((m) => m.SlideEspacio), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-faint">Cargando espacio 3D…</div>,
});

interface SlideDef {
  id: string;
  label: string;
  Comp: (props: { model: UseModel }) => React.ReactElement;
}

const SLIDES: SlideDef[] = [
  { id: "portada", label: "Portada", Comp: () => <SlidePortada /> },
  { id: "problema", label: "El problema", Comp: ({ model }) => <SlideProblema model={model} /> },
  { id: "variables", label: "Las variables", Comp: ({ model }) => <SlideVariables model={model} /> },
  { id: "matematica", label: "La matemática", Comp: ({ model }) => <SlideMatematica model={model} /> },
  { id: "grafico", label: "El gráfico y el cruce", Comp: ({ model }) => <SlideGrafico model={model} /> },
  { id: "sensibilidad", label: "Sensibilidad", Comp: ({ model }) => <SlideSensibilidad model={model} /> },
  { id: "mapa", label: "Mapa de decisión", Comp: ({ model }) => <SlideMapa model={model} /> },
  { id: "espacio", label: "El costo en 3D", Comp: ({ model }) => <SlideEspacio model={model} /> },
  { id: "pago", label: "Cómo lo paga", Comp: ({ model }) => <SlidePago model={model} /> },
  { id: "limites", label: "Límites del modelo", Comp: () => <SlideLimites /> },
  { id: "conclusion", label: "Conclusión", Comp: ({ model }) => <SlideConclusion model={model} /> },
  { id: "fuentes", label: "Fuentes", Comp: () => <SlideFuentes /> },
];

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.98 }),
};

function isInteractive(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.getAttribute("role") === "slider";
}

/** Modo Presentación: slides a pantalla completa, navegables con teclado. */
export function PresentationMode({ model }: { model: UseModel }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);
  const reduce = useReducedMotion();

  const go = useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(Math.max(0, Math.min(SLIDES.length - 1, next)));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isInteractive(document.activeElement)) return;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(index + 1, 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(index - 1, -1);
      } else if (e.key === "Home") {
        go(0, -1);
      } else if (e.key === "End") {
        go(SLIDES.length - 1, 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const current = SLIDES[index];

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="absolute inset-x-0 top-0 z-20 h-0.5 bg-line/40">
        <div
          className="h-full bg-accent transition-[width] duration-300"
          style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
        />
      </div>
      <div className="relative min-h-0 flex-1">
        <div className="pointer-events-none absolute right-3 top-3 z-20 sm:right-6 sm:top-4">
          <FaseBadge fase={faseDeSlide(current.id)} />
        </div>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={current.id}
            custom={dir}
            variants={reduce ? undefined : variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 overflow-y-auto"
          >
            <current.Comp model={model} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Barra de navegación */}
      <div className="flex items-center justify-between gap-4 border-t border-line bg-surface/80 px-4 py-3 backdrop-blur-sm sm:px-8">
        <div className="hidden text-sm text-muted sm:block">
          <span className="tnum font-mono text-ink">
            {index + 1}/{SLIDES.length}
          </span>{" "}
          · {current.label}
        </div>

        <div className="flex flex-1 items-center justify-center gap-2 sm:flex-none">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Ir a ${s.label}`}
              aria-current={i === index}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? 22 : 8,
                backgroundColor: i === index ? "var(--accent)" : "var(--line-strong)",
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1, -1)}
            disabled={index === 0}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-30"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(index + 1, 1)}
            disabled={index === SLIDES.length - 1}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-30"
            aria-label="Siguiente"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

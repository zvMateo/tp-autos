"use client";

import type { ReactNode } from "react";

interface SlideFrameProps {
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  graphPaper?: boolean;
  className?: string;
}

/** Marco común de slide: padding consistente, eyebrow + título, fondo opcional. */
export function SlideFrame({ eyebrow, title, children, graphPaper, className }: SlideFrameProps) {
  return (
    <div className={`relative flex min-h-full w-full flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 ${className ?? ""}`}>
      {graphPaper && <div className="graph-paper graph-paper-breathe graph-paper-fade pointer-events-none absolute inset-0 -z-10" />}
      <div className="mx-auto w-full max-w-6xl">
        {eyebrow && <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</div>}
        {title && <h2 className="mb-8 text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

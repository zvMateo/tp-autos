"use client";

import { useState } from "react";
import { AUTO_KEYS } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";

/** Slide 1 — Portada. Integrantes editables (placeholder). */
export function SlidePortada() {
  const [integrantes, setIntegrantes] = useState("Mateo Zavala · Enzo Gaido · Bautista Defago");

  return (
    <div className="graph-paper graph-paper-breathe graph-paper-fade relative flex min-h-full w-full flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-5 flex items-center gap-2">
          {AUTO_KEYS.map((k) => (
            <span key={k} className="h-3 w-3 rounded-full" style={{ backgroundColor: AUTO_UI[k].color }} />
          ))}
          <span className="ml-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Trabajo Práctico · Modelización Matemática
          </span>
        </div>

        <h1 className="text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-7xl">
          ¿Qué auto conviene
          <br />
          <span className="text-accent">y cómo pagarlo?</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Nafta, híbrido o eléctrico. Una sola decisión real donde conviven funciones lineales, exponenciales, interés
          compuesto y porcentajes.
        </p>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-faint">Integrantes</div>
            <input
              value={integrantes}
              onChange={(e) => setIntegrantes(e.target.value)}
              className="mt-1 w-full max-w-md rounded-md border border-transparent bg-transparent text-base text-ink outline-none hover:border-line focus:border-accent sm:w-[28rem]"
              aria-label="Integrantes"
            />
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-faint">Fecha de exposición</div>
            <div className="tnum mt-1 font-mono text-base text-ink">23/06/2026</div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/qr.svg"
            alt="Código QR para abrir la app"
            width={84}
            height={84}
            className="rounded-lg border border-line bg-surface p-1"
          />
          <div className="text-sm leading-snug">
            <div className="font-semibold text-ink">Abrí la presentación en tu teléfono</div>
            <div className="text-faint">tp-autos.vercel.app</div>
          </div>
        </div>
      </div>
    </div>
  );
}

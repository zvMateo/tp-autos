"use client";

import { AUTO_UI } from "@/lib/autos";
import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { formatKmAnio, formatMoney, formatPct } from "@/lib/format";

function Reco({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-base leading-relaxed text-muted">{children}</span>
    </li>
  );
}

/** Slide 8 — Conclusión: recomendación por perfil + cierre. */
export function SlideConclusion({ model }: { model: UseModel }) {
  const { params, results } = model;
  const g = results.ganador;
  const gUi = AUTO_UI[g.key];
  const cruceNE = results.cruces.find((c) => c.a === "nafta" && c.b === "electrico")?.kmAnio ?? 0;
  const f = results.finanzas;

  return (
    <SlideFrame eyebrow="Conclusión" title="No hay un auto que gane siempre" graphPaper>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <ul className="space-y-4">
          <Reco color={gUi.color}>
            Para el perfil de Martín ({formatKmAnio(params.kmAnio)}, {params.horizonteAnios} años) hoy conviene el{" "}
            <strong style={{ color: gUi.color }}>{gUi.short}</strong>: gana por {formatMoney(g.ventaja)}.
          </Reco>
          <Reco color="var(--car-electrico)">
            Si manejara más de <strong className="text-ink">{formatKmAnio(cruceNE)}</strong> —o si la nafta se dispara—
            el <strong className="text-car-electrico">eléctrico</strong> pasa a convenir. La decisión es muy sensible al
            precio del combustible.
          </Reco>
          <Reco color="var(--car-nafta)">
            Para pagarlo: el <strong className="text-ink">contado</strong> es lo más barato; el{" "}
            <strong className="text-car-nafta">prendario</strong> agrega {formatPct(f.prendario.interesesPct)} en
            intereses; y <strong className="text-ink">esperar no alcanza</strong> (en pesos el faltante crece).
          </Reco>
          <li className="border-t border-line pt-3 text-xs text-faint">
            Marco teórico: los 6 subprocesos de modelización de Blomhøj — formular, sistematizar, matematizar, analizar,
            interpretar y validar.
          </li>
        </ul>

        <div className="flex flex-col justify-center rounded-2xl border border-line bg-surface p-8 shadow-sm">
          <p className="text-3xl font-bold leading-snug text-ink sm:text-4xl">
            Las funciones no son temas sueltos:{" "}
            <span className="text-accent">viven en una decisión real.</span>
          </p>
          <p className="mt-4 text-sm text-muted">
            Una sola pregunta —qué auto comprar y cómo pagarlo— pone a trabajar juntas a las funciones lineales,
            exponenciales, el interés compuesto y los porcentajes.
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/qr.svg"
              alt="Código QR para abrir la app"
              width={76}
              height={76}
              className="rounded-lg border border-line bg-paper p-1"
            />
            <div className="text-sm leading-snug">
              <div className="font-semibold text-ink">Probala vos mismo</div>
              <div className="text-faint">tp-autos.vercel.app</div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

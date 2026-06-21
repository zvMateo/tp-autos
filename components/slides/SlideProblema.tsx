"use client";

import type { UseModel } from "@/lib/useModel";
import { SlideFrame } from "./SlideFrame";
import { formatKmAnio, formatMoney } from "@/lib/format";

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="tnum font-mono text-2xl font-semibold text-ink">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}

/** Slide 2 — El problema: el caso de Martín + votación de la clase (conteo acumulable). */
export function SlideProblema({ model }: { model: UseModel }) {
  const { params, votos, votar, resetVotos } = model;
  const total = votos.si + votos.no;
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  // Opción líder: resalta el fondo de la más votada (null si empate o sin votos).
  const lider: "si" | "no" | null =
    total === 0 || votos.si === votos.no ? null : votos.si > votos.no ? "si" : "no";

  return (
    <SlideFrame eyebrow="El problema" title="Martín tiene que decidir">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-lg leading-relaxed text-muted">
            Martín vive en Córdoba capital, tiene <strong className="text-ink">{formatMoney(params.ahorro)}</strong>{" "}
            ahorrados y usa el auto para trabajar: recorre <strong className="text-ink">{formatKmAnio(params.kmAnio)}</strong>.
            Quiere tenerlo <strong className="text-ink">{params.horizonteAnios} años</strong> y duda entre tres autos
            —nafta, híbrido, eléctrico— y entre tres formas de pago —contado, crédito prendario o esperar y ahorrar—.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Fact value={formatMoney(params.ahorro)} label="Ahorro disponible" />
            <Fact value={formatKmAnio(params.kmAnio)} label="Uso (trabaja con el auto)" />
            <Fact value={`${params.horizonteAnios} años`} label="Cuánto lo va a tener" />
            <Fact value="3 × 3" label="autos × formas de pago" />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-line bg-surface p-7 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold uppercase tracking-wide text-accent">La pregunta · votación</div>
            {total > 0 && (
              <button
                type="button"
                onClick={resetVotos}
                className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-faint transition-colors hover:border-accent hover:text-accent"
              >
                reiniciar
              </button>
            )}
          </div>
          <p className="mt-3 text-2xl font-semibold leading-snug text-ink">
            ¿El auto más barato de <span className="underline decoration-car-nafta decoration-2">comprar</span> es el más
            barato de <span className="underline decoration-car-electrico decoration-2">tener</span>?
          </p>
          <div className="mt-6 space-y-2">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => votar("si")}
                className={`flex-1 rounded-xl border p-3 text-left transition-colors ${
                  lider === "si" ? "border-car-nafta bg-car-nafta-soft" : "border-line hover:border-car-nafta"
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink">Sí, el más barato gana</span>
                  <span className="tnum font-mono text-faint">{votos.si}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-car-nafta transition-[width] duration-300" style={{ width: `${pct(votos.si)}%` }} />
                </div>
              </button>
              <button
                type="button"
                onClick={() => votar("no")}
                className={`flex-1 rounded-xl border p-3 text-left transition-colors ${
                  lider === "no" ? "border-car-electrico bg-car-electrico-soft" : "border-line hover:border-car-electrico"
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink">No, depende de cuánto maneje</span>
                  <span className="tnum font-mono text-faint">{votos.no}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-car-electrico transition-[width] duration-300" style={{ width: `${pct(votos.no)}%` }} />
                </div>
              </button>
            </div>
            <p className="text-xs text-faint">
              {total > 0
                ? `${total} voto${total === 1 ? "" : "s"} contados. Lo respondemos con números en 3 slides.`
                : "El expositor toca una vez por cada mano alzada. Lo respondemos con números en 3 slides."}
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

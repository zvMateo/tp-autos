"use client";

import type { ReactNode } from "react";
import { AUTO_KEYS, type Params } from "@/lib/model";
import { AUTO_UI } from "@/lib/autos";
import type { UseModel } from "@/lib/useModel";
import { NumberField } from "./ui/NumberField";
import { formatKmAnio, formatMoney } from "@/lib/format";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-b border-line py-5 first:pt-0 last:border-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">{title}</h3>
      {children}
    </section>
  );
}

/** Escenarios de un toque: setean params clave para explorar sin mover sliders a ciegas. */
const PRESETS: { label: string; partial: Partial<Params> }[] = [
  { label: "Uso urbano", partial: { kmAnio: 8000 } },
  { label: "Repartidor", partial: { kmAnio: 40000 } },
  { label: "Nafta por las nubes", partial: { subaNaftaAnual: 0.4 } },
  { label: "Luz por las nubes", partial: { subaLuzAnual: 0.32 } },
];

/** Panel de parámetros editables. Todo recalcula la app en vivo. */
export function ParametersPanel({ model }: { model: UseModel }) {
  const { params, set, setAuto, aplicarPreset, reset, modificado } = model;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">Parámetros</h2>
        <button
          type="button"
          onClick={reset}
          disabled={!modificado}
          className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40"
        >
          Restaurar referencia
        </button>
      </div>
      <p className="mb-3 rounded-lg bg-surface-2 px-3 py-2 text-[11px] leading-snug text-faint">
        Datos reales de Córdoba (junio 2026), verificados con fuentes — ver la diapositiva «Fuentes».
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="w-full text-[11px] font-semibold uppercase tracking-wider text-faint">Escenarios</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => aplicarPreset(p.partial)}
            className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {p.label}
          </button>
        ))}
      </div>

      <Section title="Uso y energía">
        <NumberField
          label="Kilómetros por año"
          value={params.kmAnio}
          min={0}
          max={60000}
          step={1000}
          suffix="km/año"
          color="var(--accent)"
          onChange={(v) => set("kmAnio", v)}
          format={(v) => formatKmAnio(v)}
        />
        <NumberField
          label="Años que lo tiene"
          value={params.horizonteAnios}
          min={1}
          max={10}
          step={1}
          suffix="años"
          onChange={(v) => set("horizonteAnios", v)}
        />
        <NumberField
          label="Precio de la nafta"
          value={params.nafta}
          min={500}
          max={4000}
          step={50}
          suffix="$/L"
          onChange={(v) => set("nafta", v)}
          format={(v) => `${formatMoney(v)} por litro`}
        />
        <NumberField
          label="Precio de la luz"
          value={params.luz}
          min={50}
          max={600}
          step={10}
          suffix="$/kWh"
          onChange={(v) => set("luz", v)}
          format={(v) => `${formatMoney(v)} por kWh`}
        />
        <NumberField
          label="Suba anual de la nafta"
          value={params.subaNaftaAnual}
          min={0}
          max={100}
          step={5}
          unit={0.01}
          suffix="%/año"
          color="var(--car-nafta)"
          hint="Encarece el km del nafta: baja el cruce"
          onChange={(v) => set("subaNaftaAnual", v)}
        />
        <NumberField
          label="Suba anual de la luz (EPEC)"
          value={params.subaLuzAnual}
          min={0}
          max={100}
          step={5}
          unit={0.01}
          suffix="%/año"
          color="var(--car-electrico)"
          hint="Encarece el km del eléctrico: sube el cruce"
          onChange={(v) => set("subaLuzAnual", v)}
        />
        <NumberField
          label="Patente"
          value={params.patentePct}
          min={0}
          max={10}
          step={0.1}
          unit={0.01}
          suffix="%/año"
          hint="Sobre el valor del auto"
          onChange={(v) => set("patentePct", v)}
        />
      </Section>

      <Section title="Autos">
        {AUTO_KEYS.map((k) => {
          const ui = AUTO_UI[k];
          const cfg = params.autos[k];
          const unidad = cfg.energia === "nafta" ? "L/100km" : "kWh/100km";
          return (
            <div key={k} className="space-y-3 rounded-xl border border-line/70 bg-surface-2/40 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ui.color }} />
                <span className="text-sm font-semibold text-ink">{ui.short}</span>
              </div>
              <NumberField
                label="Precio"
                value={cfg.precio}
                min={10}
                max={100}
                step={0.5}
                unit={1_000_000}
                suffix="M"
                color={ui.color}
                onChange={(v) => setAuto(k, "precio", v)}
                format={(v) => formatMoney(v)}
              />
              <NumberField
                label="Consumo"
                value={cfg.consumo}
                min={2}
                max={25}
                step={0.1}
                suffix={unidad}
                color={ui.color}
                onChange={(v) => setAuto(k, "consumo", v)}
              />
            </div>
          );
        })}
      </Section>

      <Section title="Pago (sobre el auto nafta)">
        <NumberField
          label="Precio del auto objetivo"
          value={params.precioObjetivo}
          min={10}
          max={100}
          step={0.5}
          unit={1_000_000}
          suffix="M"
          onChange={(v) => set("precioObjetivo", v)}
          format={(v) => formatMoney(v)}
        />
        <NumberField
          label="Ahorro disponible"
          value={params.ahorro}
          min={0}
          max={100}
          step={0.5}
          unit={1_000_000}
          suffix="M"
          color="var(--car-electrico)"
          onChange={(v) => set("ahorro", v)}
          format={(v) => formatMoney(v)}
        />
        <NumberField
          label="TNA crédito prendario"
          value={params.tnaPrendario}
          min={0}
          max={120}
          step={1}
          unit={0.01}
          suffix="%"
          color="var(--car-nafta)"
          onChange={(v) => set("tnaPrendario", v)}
        />
        <NumberField
          label="Plazo del prendario"
          value={params.mesesPrendario}
          min={12}
          max={72}
          step={6}
          suffix="meses"
          onChange={(v) => set("mesesPrendario", v)}
        />
        <NumberField
          label="TNA plazo fijo"
          value={params.tnaPlazoFijo}
          min={0}
          max={120}
          step={1}
          unit={0.01}
          suffix="%"
          onChange={(v) => set("tnaPlazoFijo", v)}
        />
        <NumberField
          label="Inflación anual del auto"
          value={params.inflacionAutoAnual}
          min={0}
          max={100}
          step={5}
          unit={0.01}
          suffix="%/año"
          onChange={(v) => set("inflacionAutoAnual", v)}
        />
      </Section>
    </div>
  );
}

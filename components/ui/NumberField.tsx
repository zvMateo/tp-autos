"use client";

import { Slider } from "./Slider";

interface NumberFieldProps {
  label: string;
  /** Valor nativo (en las unidades del modelo) */
  value: number;
  /** min/max/step en unidades de DISPLAY (lo que ve y edita el usuario) */
  min: number;
  max: number;
  step?: number;
  /** native = display * unit. Ej: millones -> 1_000_000 ; porcentaje -> 0.01 */
  unit?: number;
  suffix?: string;
  color?: string;
  hint?: string;
  /** Vista previa "amigable" del valor nativo (ej: "$38.000.000") */
  format?: (native: number) => string;
  onChange: (native: number) => void;
}

/** Control de parámetro: etiqueta + input numérico editable + slider + preview. */
export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 1,
  suffix,
  color,
  hint,
  format,
  onChange,
}: NumberFieldProps) {
  const display = value / unit;
  const clamp = (d: number) => Math.min(max, Math.max(min, d));
  const decimals = step < 1 ? (step.toString().split(".")[1]?.length ?? 1) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-ink">{label}</div>
          {hint && <div className="text-[11px] leading-tight text-faint">{hint}</div>}
        </div>
        <div className="flex shrink-0 items-baseline gap-1.5">
          <input
            type="number"
            inputMode="decimal"
            value={Number.isFinite(display) ? Number(display.toFixed(decimals)) : 0}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const d = parseFloat(e.target.value);
              if (!Number.isNaN(d)) onChange(clamp(d) * unit);
            }}
            className="tnum w-24 rounded-md border border-line bg-surface-2 px-2 py-1 text-right font-mono text-sm text-ink outline-none [appearance:textfield] focus:border-accent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label={label}
          />
          {suffix && <span className="whitespace-nowrap font-mono text-xs text-muted">{suffix}</span>}
        </div>
      </div>
      <Slider
        value={display}
        min={min}
        max={max}
        step={step}
        color={color}
        ariaLabel={label}
        onValueChange={(d) => onChange(clamp(d) * unit)}
      />
      {format && <div className="tnum font-mono text-xs text-muted">{format(value)}</div>}
    </div>
  );
}

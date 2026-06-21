"use client";

import * as RSlider from "@radix-ui/react-slider";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  /** Color del rango y el thumb (default: acento) */
  color?: string;
  ariaLabel?: string;
}

/** Slider accesible (Radix) con estética del sistema. Maneja un solo valor. */
export function Slider({ value, min, max, step = 1, onValueChange, color = "var(--accent)", ariaLabel }: SliderProps) {
  return (
    <RSlider.Root
      className="relative flex h-5 w-full touch-none select-none items-center"
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onValueChange(v[0])}
      aria-label={ariaLabel}
    >
      <RSlider.Track className="relative h-1.5 grow rounded-full bg-line-strong/50">
        <RSlider.Range className="absolute h-full rounded-full" style={{ backgroundColor: color }} />
      </RSlider.Track>
      <RSlider.Thumb
        className="block h-4 w-4 rounded-full border-2 bg-surface shadow-sm transition-transform duration-150 hover:scale-110 focus-visible:scale-110"
        style={{ borderColor: color }}
      />
    </RSlider.Root>
  );
}

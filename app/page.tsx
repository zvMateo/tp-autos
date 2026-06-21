"use client";

import { useState } from "react";
import { useModel } from "@/lib/useModel";
import { ModeToggle, type Mode } from "@/components/ui/ModeToggle";
import { PresentationMode } from "@/components/PresentationMode";
import { CalculatorMode } from "@/components/CalculatorMode";

export default function Home() {
  const model = useModel();
  const [mode, setMode] = useState<Mode>("presentacion");

  return (
    <div className="flex h-dvh flex-col">
      <div className="atmosphere" aria-hidden />
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line bg-surface/80 px-4 py-2.5 backdrop-blur-sm sm:px-8">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ink">¿Qué auto conviene?</span>
          <span className="hidden text-xs text-faint sm:inline">· TP Modelización</span>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </header>

      <main className="min-h-0 flex-1 overflow-hidden">
        {mode === "presentacion" ? (
          <PresentationMode model={model} />
        ) : (
          <div className="h-full overflow-y-auto">
            <CalculatorMode model={model} />
          </div>
        )}
      </main>
    </div>
  );
}

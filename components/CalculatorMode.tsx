"use client";

import type { ReactNode } from "react";
import type { UseModel } from "@/lib/useModel";
import { ParametersPanel } from "./ParametersPanel";
import { ResultsPanel } from "./ResultsPanel";
import { CostLinesChart } from "./charts/CostLinesChart";
import { SensitivityChart } from "./charts/SensitivityChart";
import { FinanceChart } from "./charts/FinanceChart";

function ChartCard({
  title,
  subtitle,
  height,
  children,
}: {
  title: string;
  subtitle: string;
  height: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      <div className={height}>{children}</div>
    </div>
  );
}

/** Modo Calculadora: panel de parámetros + resultados y gráficos en vivo. */
export function CalculatorMode({ model }: { model: UseModel }) {
  const { params, results } = model;
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <ParametersPanel model={model} />
        </aside>
        <div className="space-y-6">
          <ResultsPanel model={model} />
          <ChartCard
            title="Costo total según cuánto manejes"
            subtitle="Donde se cruzan las rectas está el punto de equilibrio"
            height="h-[380px]"
          >
            <CostLinesChart params={params} results={results} />
          </ChartCard>
          <div className="grid gap-6 xl:grid-cols-2">
            <ChartCard
              title="Sensibilidad al precio de la nafta"
              subtitle="A cuántos km/año conviene el eléctrico según la suba"
              height="h-[300px]"
            >
              <SensitivityChart params={params} results={results} />
            </ChartCard>
            <ChartCard
              title="Cómo pagarlo"
              subtitle="Total desembolsado: contado vs prendario"
              height="h-[300px]"
            >
              <FinanceChart finanzas={results.finanzas} precioObjetivo={params.precioObjetivo} />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

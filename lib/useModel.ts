"use client";

import { useCallback, useMemo, useReducer, useState } from "react";
import {
  defaults,
  calcularAutos,
  cruces,
  ganador,
  calcularFinanzas,
  kmTotales,
  type Params,
  type AutoKey,
  type AutoConfig,
} from "./model";

/** Claves de Params de valor numérico (editables con slider/input). */
export type NumParamKey =
  | "horizonteAnios"
  | "kmAnio"
  | "nafta"
  | "luz"
  | "patentePct"
  | "precioObjetivo"
  | "ahorro"
  | "tnaPrendario"
  | "mesesPrendario"
  | "tnaPlazoFijo"
  | "inflacionAutoAnual"
  | "subaNaftaAnual"
  | "subaLuzAnual";

/** Campos numéricos editables de cada auto. */
export type NumAutoField = "precio" | "consumo" | "mantKm" | "seguro";

type Action =
  | { type: "set"; key: NumParamKey; value: number }
  | { type: "setAuto"; auto: AutoKey; field: NumAutoField; value: number }
  | { type: "preset"; partial: Partial<Params> }
  | { type: "reset" };

function reducer(state: Params, action: Action): Params {
  switch (action.type) {
    case "set":
      return { ...state, [action.key]: action.value };
    case "setAuto":
      return {
        ...state,
        autos: {
          ...state.autos,
          [action.auto]: { ...state.autos[action.auto], [action.field]: action.value },
        },
      };
    case "preset":
      // Merge shallow: los presets actuales sólo tocan campos de primer nivel
      // (kmAnio, subaNaftaAnual). No mergea `autos` en profundidad a propósito.
      return { ...state, ...action.partial };
    case "reset":
      return defaults;
    default:
      return state;
  }
}

/** Conteo de votos de la clase a la pregunta del slide "El problema". */
export interface Votos {
  si: number;
  no: number;
}
export type VotoOpcion = "si" | "no";

export interface ModelResults {
  autos: ReturnType<typeof calcularAutos>;
  cruces: ReturnType<typeof cruces>;
  ganador: ReturnType<typeof ganador>;
  finanzas: ReturnType<typeof calcularFinanzas>;
  kmTot: number;
}

export interface UseModel {
  params: Params;
  results: ModelResults;
  set: (key: NumParamKey, value: number) => void;
  setAuto: (auto: AutoKey, field: NumAutoField, value: number) => void;
  /** Aplica un escenario predefinido (merge shallow sobre los params). */
  aplicarPreset: (partial: Partial<Params>) => void;
  reset: () => void;
  /** true si los parámetros difieren de los de referencia. */
  modificado: boolean;
  /** Conteo de votos de la clase (intuición), separado del modelo matemático. */
  votos: Votos;
  /** Suma un voto a la opción dada (un toque por mano alzada). */
  votar: (op: VotoOpcion) => void;
  /** Reinicia el conteo de votos a 0/0. */
  resetVotos: () => void;
}

/**
 * Estado global de la app: un único `Params` con sus resultados derivados.
 * Se instancia en app/page.tsx y se comparte entre los dos modos, así los
 * cambios persisten al alternar Presentación / Calculadora.
 *
 * El conteo de votos vive aparte (useState), no en `Params`: es estado de la
 * dinámica de clase, no un parámetro del modelo, y no debe afectar `modificado`.
 */
export function useModel(): UseModel {
  const [params, dispatch] = useReducer(reducer, defaults);
  const [votos, setVotos] = useState<Votos>({ si: 0, no: 0 });

  const set = useCallback((key: NumParamKey, value: number) => dispatch({ type: "set", key, value }), []);
  const setAuto = useCallback(
    (auto: AutoKey, field: NumAutoField, value: number) => dispatch({ type: "setAuto", auto, field, value }),
    [],
  );
  const aplicarPreset = useCallback(
    (partial: Partial<Params>) => dispatch({ type: "preset", partial }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const votar = useCallback((op: VotoOpcion) => setVotos((v) => ({ ...v, [op]: v[op] + 1 })), []);
  const resetVotos = useCallback(() => setVotos({ si: 0, no: 0 }), []);

  const results = useMemo<ModelResults>(
    () => ({
      autos: calcularAutos(params),
      cruces: cruces(params),
      ganador: ganador(params),
      finanzas: calcularFinanzas(params),
      kmTot: kmTotales(params),
    }),
    [params],
  );

  const modificado = useMemo(() => JSON.stringify(params) !== JSON.stringify(defaults), [params]);

  return { params, results, set, setAuto, aplicarPreset, reset, modificado, votos, votar, resetVotos };
}

export type { Params, AutoKey, AutoConfig };

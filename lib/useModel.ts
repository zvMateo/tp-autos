"use client";

import { useCallback, useMemo, useReducer } from "react";
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
  | "subaNaftaAnual";

/** Campos numéricos editables de cada auto. */
export type NumAutoField = "precio" | "consumo" | "mantKm" | "seguro";

type Action =
  | { type: "set"; key: NumParamKey; value: number }
  | { type: "setAuto"; auto: AutoKey; field: NumAutoField; value: number }
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
    case "reset":
      return defaults;
    default:
      return state;
  }
}

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
  reset: () => void;
  /** true si los parámetros difieren de los de referencia. */
  modificado: boolean;
}

/**
 * Estado global de la app: un único `Params` con sus resultados derivados.
 * Se instancia en app/page.tsx y se comparte entre los dos modos, así los
 * cambios persisten al alternar Presentación / Calculadora.
 */
export function useModel(): UseModel {
  const [params, dispatch] = useReducer(reducer, defaults);

  const set = useCallback((key: NumParamKey, value: number) => dispatch({ type: "set", key, value }), []);
  const setAuto = useCallback(
    (auto: AutoKey, field: NumAutoField, value: number) => dispatch({ type: "setAuto", auto, field, value }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

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

  return { params, results, set, setAuto, reset, modificado };
}

export type { Params, AutoKey, AutoConfig };

/**
 * model.ts — FUENTE DE VERDAD del TP.
 *
 * Toda la matemática de la app vive acá, como funciones puras sobre `Params`.
 * Ningún componente debe hardcodear un número calculado: todo deriva de esto.
 *
 * Familias de funciones que conviven en la decisión:
 *   - Lineal:            C(K) = ordenada + pendiente·K   (costo total de tener el auto)
 *   - Exponencial:       precio nafta(t) = nafta0·(1+r)^t (sensibilidad)
 *   - Interés compuesto: cuota sistema francés / plazo fijo capitalizado
 *   - Porcentajes:       patente, inflación del auto, intereses sobre el gap
 */

// ----------------------------------------------------------------------------
// Tipos
// ----------------------------------------------------------------------------

export type Energia = "nafta" | "luz";
export type AutoKey = "nafta" | "hibrido" | "electrico";

export interface AutoConfig {
  /** Etiqueta larga para tarjetas y tooltips */
  nombre: string;
  /** Precio de compra ($) */
  precio: number;
  /** Consumo: L/100km (nafta) o kWh/100km (eléctrico) */
  consumo: number;
  /** Vector energético que consume */
  energia: Energia;
  /** Mantenimiento por km ($/km) */
  mantKm: number;
  /** Seguro anual ($/año) */
  seguro: number;
}

export interface Params {
  /** Años que se planea tener el auto */
  horizonteAnios: number;
  /** Kilómetros por año */
  kmAnio: number;
  /** Precio de la nafta ($/litro) */
  nafta: number;
  /** Precio de la luz ($/kWh) */
  luz: number;
  /** Patente anual como % del valor del auto */
  patentePct: number;
  /** Configuración de cada auto */
  autos: Record<AutoKey, AutoConfig>;

  // --- Capa financiera (sobre el auto nafta) ---
  /** Precio del auto que se quiere comprar ($) */
  precioObjetivo: number;
  /** Ahorro disponible hoy ($) */
  ahorro: number;
  /** TNA del crédito prendario (fracción, ej 0.45 = 45%) */
  tnaPrendario: number;
  /** Plazo del prendario en meses */
  mesesPrendario: number;
  /** TNA del plazo fijo (fracción) */
  tnaPlazoFijo: number;
  /** Inflación anual del precio del auto (fracción) */
  inflacionAutoAnual: number;

  // --- Análisis de sensibilidad ---
  /** Suba anual de la nafta usada en el modelo (fracción). 0 = sin suba. */
  subaNaftaAnual: number;
}

// ----------------------------------------------------------------------------
// Constantes
// ----------------------------------------------------------------------------

export const MESES_ANIO = 12;
export const AUTO_KEYS: readonly AutoKey[] = ["nafta", "hibrido", "electrico"] as const;

/**
 * PARÁMETROS DE REFERENCIA (Córdoba, 2026 — verificar antes de la entrega).
 * Editables desde la UI; "Restaurar valores de referencia" vuelve a esto.
 */
export const defaults: Params = {
  horizonteAnios: 5, // supuesto del caso
  kmAnio: 15000, // Martín (supuesto del caso)
  nafta: 2084, // $/litro — YPF súper Córdoba, jun 2026
  luz: 200, // $/kWh — EPEC residencial, estimado jun 2026
  patentePct: 0.03, // Córdoba, tramo valuación $20–50M (jun 2026)
  autos: {
    nafta: {
      nombre: "Nafta (Toyota Corolla Cross XEI 2.0)",
      precio: 55_944_000, // lista jun 2026 (La Nación)
      consumo: 6.1, // L/100km mixto (ficha Toyota)
      energia: "nafta",
      mantKm: 15, // estimación de mercado
      seguro: 2_000_000, // estimación anual
    },
    hibrido: {
      nombre: "Híbrido (Toyota Corolla Cross XEI HEV)",
      precio: 57_355_000, // lista jun 2026 (La Nación)
      consumo: 5.0, // L/100km (WLTP)
      energia: "nafta",
      mantKm: 12, // estimación de mercado
      seguro: 2_100_000, // estimación anual
    },
    electrico: {
      nombre: "Eléctrico (BYD Atto 3 — referencia)",
      precio: 63_000_000, // ref. internacional; no se vende en AR a jun 2026
      consumo: 15.9, // kWh/100km (WLTP)
      energia: "luz",
      mantKm: 7, // estimación (EV más barato de mantener)
      seguro: 2_400_000, // estimación anual
    },
  },
  // capa financiera (sobre el auto nafta)
  precioObjetivo: 55_944_000, // = precio del Corolla Cross nafta
  ahorro: 30_000_000, // supuesto del caso
  tnaPrendario: 0.45, // crédito prendario, jun 2026
  mesesPrendario: 48,
  tnaPlazoFijo: 0.19, // plazo fijo 30 días, jun 2026 (BCRA)
  inflacionAutoAnual: 0.15, // 0km AR 2026 (corriendo por debajo de la inflación)
  // sensibilidad
  subaNaftaAnual: 0,
};

// ----------------------------------------------------------------------------
// Precio de energía efectivo (capa exponencial)
// ----------------------------------------------------------------------------

/**
 * Factor promedio de capitalización del precio de la nafta sobre el horizonte.
 *   mean((1+r)^t, t = 0 .. horizonte-1)
 * Con r = 0 devuelve 1 (sin suba).
 */
export function factorNaftaEfectivo(r: number, horizonteAnios: number): number {
  if (horizonteAnios <= 0) return 1;
  let suma = 0;
  for (let t = 0; t < horizonteAnios; t++) suma += Math.pow(1 + r, t);
  return suma / horizonteAnios;
}

/**
 * Precio efectivo promedio del vector energético sobre el horizonte.
 * La nafta se ajusta por la suba anual; la luz se asume estable.
 */
export function precioEnergiaEfectivo(p: Params, energia: Energia): number {
  if (energia === "luz") return p.luz;
  return p.nafta * factorNaftaEfectivo(p.subaNaftaAnual, p.horizonteAnios);
}

// ----------------------------------------------------------------------------
// Cálculo lineal por auto: C(K) = ordenada + pendiente·K
// ----------------------------------------------------------------------------

export interface AutoCalculo {
  key: AutoKey;
  nombre: string;
  energia: Energia;
  /** Costo de energía por km ($/km) */
  energiaPorKm: number;
  /** Pendiente = energía/km + mantenimiento/km ($/km) */
  pendiente: number;
  /** Ordenada al origen = compra + horizonte·(seguro + patente) ($) */
  ordenada: number;
  /** Costo total a los km totales del horizonte ($) */
  costoTotal: number;
}

/** Km totales recorridos en el horizonte (eje X de las rectas). */
export function kmTotales(p: Params): number {
  return p.kmAnio * p.horizonteAnios;
}

/** Calcula pendiente, ordenada y costo total de un auto. */
export function calcularAuto(p: Params, key: AutoKey): AutoCalculo {
  const auto = p.autos[key];
  const precioEnergia = precioEnergiaEfectivo(p, auto.energia);
  const energiaPorKm = (auto.consumo / 100) * precioEnergia;
  const pendiente = energiaPorKm + auto.mantKm;
  const ordenada = auto.precio + p.horizonteAnios * (auto.seguro + auto.precio * p.patentePct);
  const costoTotal = ordenada + pendiente * kmTotales(p);
  return { key, nombre: auto.nombre, energia: auto.energia, energiaPorKm, pendiente, ordenada, costoTotal };
}

/** Calcula los tres autos de una. */
export function calcularAutos(p: Params): Record<AutoKey, AutoCalculo> {
  return {
    nafta: calcularAuto(p, "nafta"),
    hibrido: calcularAuto(p, "hibrido"),
    electrico: calcularAuto(p, "electrico"),
  };
}

/** Evalúa la recta de un auto en una cantidad de km totales. */
export function costoEnKm(calc: Pick<AutoCalculo, "ordenada" | "pendiente">, kmTot: number): number {
  return calc.ordenada + calc.pendiente * kmTot;
}

// ----------------------------------------------------------------------------
// Puntos de equilibrio (cruce entre rectas)
// ----------------------------------------------------------------------------

/**
 * Km TOTALES en los que se cruzan dos rectas de costo.
 *   K* = (ordenada_b - ordenada_a) / (pendiente_a - pendiente_b)
 * Devuelve null si las pendientes son iguales (no se cruzan).
 */
export function cruceKmTotales(a: AutoCalculo, b: AutoCalculo): number | null {
  const denom = a.pendiente - b.pendiente;
  if (denom === 0) return null;
  return (b.ordenada - a.ordenada) / denom;
}

/** Cruce expresado en km/año. */
export function cruceKmAnio(p: Params, a: AutoCalculo, b: AutoCalculo): number | null {
  const kt = cruceKmTotales(a, b);
  if (kt === null) return null;
  return kt / p.horizonteAnios;
}

export interface CrucePar {
  a: AutoKey;
  b: AutoKey;
  kmTotales: number | null;
  kmAnio: number | null;
  /** true si el cruce cae en el primer cuadrante (km positivos) */
  valido: boolean;
}

/** Los tres cruces posibles entre los autos. */
export function cruces(p: Params): CrucePar[] {
  const calcs = calcularAutos(p);
  const pares: Array<[AutoKey, AutoKey]> = [
    ["nafta", "electrico"],
    ["nafta", "hibrido"],
    ["hibrido", "electrico"],
  ];
  return pares.map(([a, b]) => {
    const kt = cruceKmTotales(calcs[a], calcs[b]);
    const ka = kt === null ? null : kt / p.horizonteAnios;
    return { a, b, kmTotales: kt, kmAnio: ka, valido: kt !== null && kt > 0 };
  });
}

// ----------------------------------------------------------------------------
// Ganador a un nivel de km dado
// ----------------------------------------------------------------------------

export interface Ganador {
  key: AutoKey;
  costoTotal: number;
  /** Diferencia de costo con el segundo más barato ($) */
  ventaja: number;
}

/** Auto más barato a los km/año actuales. */
export function ganador(p: Params): Ganador {
  const ordenados = AUTO_KEYS.map((k) => calcularAuto(p, k)).sort((x, y) => x.costoTotal - y.costoTotal);
  const mejor = ordenados[0];
  const segundo = ordenados[1];
  return { key: mejor.key, costoTotal: mejor.costoTotal, ventaja: segundo.costoTotal - mejor.costoTotal };
}

// ----------------------------------------------------------------------------
// Sensibilidad: cruce nafta ↔ eléctrico en función de la suba de la nafta
// ----------------------------------------------------------------------------

/** Cruce nafta↔eléctrico (km/año) para una suba anual r dada. */
export function cruceNaftaElectricoKmAnio(p: Params, r: number): number | null {
  const pr: Params = { ...p, subaNaftaAnual: r };
  const nafta = calcularAuto(pr, "nafta");
  const electrico = calcularAuto(pr, "electrico");
  return cruceKmAnio(pr, nafta, electrico);
}

// ----------------------------------------------------------------------------
// Capa financiera
// ----------------------------------------------------------------------------

export interface Finanzas {
  /** Plata que falta: precioObjetivo - ahorro */
  gap: number;
  prendario: {
    cuota: number;
    totalPagado: number;
    intereses: number;
    /** intereses / gap (ej 1.17 = 117%) */
    interesesPct: number;
  };
  plazoFijo: {
    capFinal: number;
    ganancia: number;
  };
  esperar: {
    precioFuturo: number;
    gapFuturo: number;
  };
}

/**
 * Cuota del sistema francés.
 *   i = TNA/12 ; cuota = gap·i / (1 - (1+i)^(-n))
 */
export function cuotaFrancesa(monto: number, tnaAnual: number, meses: number): number {
  const i = tnaAnual / MESES_ANIO;
  if (i === 0) return monto / meses;
  return (monto * i) / (1 - Math.pow(1 + i, -meses));
}

/** Calcula las tres estrategias de pago: contado / prendario / esperar. */
export function calcularFinanzas(p: Params): Finanzas {
  const gap = p.precioObjetivo - p.ahorro;

  const cuota = cuotaFrancesa(gap, p.tnaPrendario, p.mesesPrendario);
  const totalPagado = cuota * p.mesesPrendario;
  const intereses = totalPagado - gap;
  const interesesPct = gap !== 0 ? intereses / gap : 0;

  const capFinal = p.ahorro * Math.pow(1 + p.tnaPlazoFijo / MESES_ANIO, MESES_ANIO);

  const precioFuturo = p.precioObjetivo * (1 + p.inflacionAutoAnual);
  const gapFuturo = precioFuturo - capFinal;

  return {
    gap,
    prendario: { cuota, totalPagado, intereses, interesesPct },
    plazoFijo: { capFinal, ganancia: capFinal - p.ahorro },
    esperar: { precioFuturo, gapFuturo },
  };
}

// ----------------------------------------------------------------------------
// Series para los gráficos
// ----------------------------------------------------------------------------

export interface PuntoCosto {
  km: number;
  nafta: number;
  hibrido: number;
  electrico: number;
}

/** Serie de costo total vs km totales, para el gráfico de rectas (G1). */
export function serieCostos(p: Params, maxKmTotal: number, steps = 80): PuntoCosto[] {
  const calcs = calcularAutos(p);
  const pts: PuntoCosto[] = [];
  for (let s = 0; s <= steps; s++) {
    const km = (maxKmTotal * s) / steps;
    pts.push({
      km,
      nafta: costoEnKm(calcs.nafta, km),
      hibrido: costoEnKm(calcs.hibrido, km),
      electrico: costoEnKm(calcs.electrico, km),
    });
  }
  return pts;
}

export interface PuntoSensibilidad {
  /** Suba anual de la nafta como porcentaje (0..100) */
  pct: number;
  /** Cruce nafta↔eléctrico en km/año (null si no aplica) */
  cruce: number | null;
}

/** Serie cruce(km/año) vs % de suba de la nafta, de 0 a 100% (G2). */
export function serieSensibilidad(p: Params, steps = 50): PuntoSensibilidad[] {
  const pts: PuntoSensibilidad[] = [];
  for (let s = 0; s <= steps; s++) {
    const r = s / steps; // 0 .. 1
    pts.push({ pct: r * 100, cruce: cruceNaftaElectricoKmAnio(p, r) });
  }
  return pts;
}

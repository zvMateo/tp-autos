/** format.ts — formateo de moneda y números en es-AR. */

const nf0 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

/** Pesos sin decimales: 38000000 -> "$38.000.000" */
export function formatMoney(n: number): string {
  return "$" + nf0.format(Math.round(n));
}

/** Pesos compactos en millones: 38000000 -> "$38,0 M" (ejes y chips) */
export function formatMoneyM(n: number): string {
  return "$" + nf1.format(n / 1_000_000) + " M";
}

/** Número con separador de miles es-AR y decimales opcionales. */
export function formatNumber(n: number, dec = 0): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(n);
}

/** Fracción a porcentaje: 0.45 -> "45%" */
export function formatPct(frac: number, dec = 0): string {
  return formatNumber(frac * 100, dec) + "%";
}

/** Km/año redondeado: 31250 -> "31.250 km/año" */
export function formatKmAnio(n: number): string {
  return nf0.format(Math.round(n)) + " km/año";
}

/** Km redondeado: 31250 -> "31.250 km" */
export function formatKm(n: number): string {
  return nf0.format(Math.round(n)) + " km";
}

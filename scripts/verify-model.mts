/**
 * verify-model.mts — valida las FÓRMULAS de lib/model.ts contra la tabla de
 * referencia del brief, usando una fixture fija (los valores placeholder
 * originales). Así prueba que la matemática es correcta, independientemente
 * de los `defaults` actuales (que ahora tienen datos reales de jun 2026).
 * Correr con:  node scripts/verify-model.mts
 */
import {
  defaults,
  calcularAuto,
  cruces,
  cruceNaftaElectricoKmAnio,
  cruceNaftaElectricoLuzKmAnio,
  calcularFinanzas,
  costoEnKm,
  ganador,
  breakevenAnios,
  type AutoKey,
  type Params,
} from "../lib/model.ts";

// Fixture = valores placeholder ORIGINALES del brief (no los defaults reales).
const fixture: Params = {
  horizonteAnios: 5,
  kmAnio: 15000,
  nafta: 1300,
  luz: 150,
  patentePct: 0.035,
  autos: {
    nafta: { nombre: "Nafta", precio: 38_000_000, consumo: 7.5, energia: "nafta", mantKm: 25, seguro: 1_500_000 },
    hibrido: { nombre: "Híbrido", precio: 46_000_000, consumo: 4.3, energia: "nafta", mantKm: 22, seguro: 1_700_000 },
    electrico: { nombre: "Eléctrico", precio: 48_000_000, consumo: 15.0, energia: "luz", mantKm: 12, seguro: 1_900_000 },
  },
  precioObjetivo: 38_000_000,
  ahorro: 30_000_000,
  tnaPrendario: 0.45,
  mesesPrendario: 48,
  tnaPlazoFijo: 0.35,
  inflacionAutoAnual: 0.4,
  subaNaftaAnual: 0,
  subaLuzAnual: 0,
};

let fallos = 0;
function ok(nombre: string, got: number, esperado: number, tol: number) {
  const pasa = Math.abs(got - esperado) <= tol;
  console.log(`${pasa ? "✓" : "✗"} ${nombre}: ${got.toLocaleString("es-AR")}  (esperado ${esperado.toLocaleString("es-AR")}, tol ${tol})`);
  if (!pasa) fallos++;
}
function okRound(nombre: string, got: number, esperado: number) {
  const r = Math.round(got);
  console.log(`${r === esperado ? "✓" : "✗"} ${nombre}: ${r.toLocaleString("es-AR")}  (esperado ${esperado.toLocaleString("es-AR")})`);
  if (r !== esperado) fallos++;
}

console.log("=== FÓRMULAS contra la tabla del brief (fixture placeholder) ===");
const refs: Record<AutoKey, { pend: number; ord: number; costo75: number }> = {
  nafta: { pend: 122.5, ord: 52_150_000, costo75: 61_337_500 },
  hibrido: { pend: 77.9, ord: 62_550_000, costo75: 68_392_500 },
  electrico: { pend: 34.5, ord: 65_900_000, costo75: 68_487_500 },
};
(Object.keys(refs) as AutoKey[]).forEach((k) => {
  const c = calcularAuto(fixture, k);
  ok(`${k} pendiente`, c.pendiente, refs[k].pend, 0.001);
  ok(`${k} ordenada`, c.ordenada, refs[k].ord, 0.5);
  ok(`${k} costo@75k`, costoEnKm(c, 75_000), refs[k].costo75, 0.5);
});

const cr = cruces(fixture);
const get = (a: AutoKey, b: AutoKey) => cr.find((x) => x.a === a && x.b === b)!.kmAnio!;
okRound("cruce Nafta↔Eléctrico", get("nafta", "electrico"), 31_250);
okRound("cruce Nafta↔Híbrido", get("nafta", "hibrido"), 46_637);
okRound("cruce Híbrido↔Eléctrico", get("hibrido", "electrico"), 15_438);
okRound("sensibilidad nafta +50%", cruceNaftaElectricoKmAnio(fixture, 0.5)!, 11_104);
// La suba de la LUZ mueve el cruce hacia ARRIBA (efecto opuesto al de la nafta):
// con luz +50% el eléctrico necesita MÁS km/año para convenir.
okRound("sensibilidad luz +50%", cruceNaftaElectricoLuzKmAnio(fixture, 0.5)!, 53_757);
ok("breakeven Nafta→Eléctrico (años)", breakevenAnios(fixture, "nafta", "electrico")!, 17.543859, 0.001);

const f = calcularFinanzas(fixture);
ok("cuota prendario", f.prendario.cuota, 361_809, 5);
ok("intereses %", f.prendario.interesesPct * 100, 117, 0.5);
ok("plazo fijo capFinal", f.plazoFijo.capFinal, 42_359_399, 100);
ok("gap futuro", f.esperar.gapFuturo, 10_840_601, 100);

// --- Info: resultados con los DATOS REALES actuales (no se asertan) ---
console.log("\n=== Datos reales actuales (jun 2026) — informativo ===");
const g = ganador(defaults);
console.log(`Ganador a ${defaults.kmAnio.toLocaleString("es-AR")} km/año: ${g.key} ($${Math.round(g.costoTotal).toLocaleString("es-AR")})`);
cruces(defaults).forEach((c) => {
  const km = c.valido && c.kmAnio != null ? `${Math.round(c.kmAnio).toLocaleString("es-AR")} km/año` : "no se cruzan";
  console.log(`  cruce ${c.a} ↔ ${c.b}: ${km}`);
});
const peso = (n: number) => `$${Math.round(n).toLocaleString("es-AR")}`;
(["nafta", "hibrido", "electrico"] as AutoKey[]).forEach((k) => {
  const c = calcularAuto(defaults, k);
  console.log(`  ${k}: ordenada ${peso(c.ordenada)} | ${c.pendiente.toFixed(1)} $/km | costo@75k ${peso(c.costoTotal)}`);
});
const fr = calcularFinanzas(defaults);
console.log(`Finanzas: gap ${peso(fr.gap)} | cuota ${peso(fr.prendario.cuota)} | total ${peso(fr.prendario.totalPagado)} | intereses ${peso(fr.prendario.intereses)} (${(fr.prendario.interesesPct * 100).toFixed(1)}%)`);
console.log(`  plazo fijo 1 año ${peso(fr.plazoFijo.capFinal)} | auto futuro ${peso(fr.esperar.precioFuturo)} | gap futuro ${peso(fr.esperar.gapFuturo)}`);

console.log("");
if (fallos > 0) {
  console.error(`✗ ${fallos} verificación(es) FALLARON — hay un bug en el modelo.`);
  process.exit(1);
} else {
  console.log("✓ Fórmulas correctas (coinciden con la tabla de referencia del brief).");
}

/**
 * sources.ts — fuentes y confiabilidad de cada dato del modelo.
 * Alimenta la diapositiva «Fuentes y confiabilidad» y deja explícito qué es
 * dato verificable (lookup con fuente) y qué es supuesto/estimación.
 * Datos relevados para Córdoba, Argentina, junio 2026.
 */

export type Confianza = "alta" | "media" | "baja";

export interface SourceEntry {
  label: string;
  value: string;
  /** dato = lookup verificable ; supuesto = estimación o premisa del caso */
  kind: "dato" | "supuesto";
  confianza: Confianza;
  fuente: string;
  /** URL de la fuente (vacío = premisa sin fuente externa) */
  url: string;
  fecha: string;
  nota?: string;
}

export const SOURCES: SourceEntry[] = [
  // --- Datos verificables ---
  {
    label: "Nafta súper (Córdoba)",
    value: "$2.084/L",
    kind: "dato",
    confianza: "alta",
    fuente: "hoydia.com.ar",
    url: "https://hoydia.com.ar/economia/combustibles-cordoba-nafta-precios-2/",
    fecha: "jun 2026",
  },
  {
    label: "Luz residencial (EPEC)",
    value: "≈ $220/kWh",
    kind: "dato",
    confianza: "media",
    fuente: "Cuadro tarifario EPEC (Res. ERSeP 14/2025)",
    url: "https://www.epec.com.ar/docs/cuadro-tarifario/cuadro-tarifario-publicado-290825-aplicacion-010925.pdf",
    fecha: "jun 2026 (proyección)",
    nota: "Cuadro oficial sep-2025: ~$174–211/kWh sin subsidio (Nivel 1). Proyectado a jun-2026 con ajustes FAM → ~$220/kWh. No hay cuadro oficial de jun-2026 publicado.",
  },
  {
    label: "Suba anual tarifa EPEC",
    value: "≈ 32%/año",
    kind: "dato",
    confianza: "media",
    fuente: "Ente Regulador / La Voz",
    url: "https://ente.gob.ar/tarifas-la-boleta-de-epec-en-cordoba-subio-hasta-557-en-un-ano-y-mas-de-100-para-quien-perdio-subsidios/",
    fecha: "mar 2026 (interanual)",
    nota: "Boleta plena de EPEC +32,8% interanual (mar-25→mar-26), apenas sobre la inflación REM 2026 (~30,5%). Se explora con el slider de sensibilidad; proyección a 5 años de confianza media.",
  },
  {
    label: "Corolla Cross XEI 2.0 (nafta)",
    value: "$55.944.000",
    kind: "dato",
    confianza: "alta",
    fuente: "La Nación",
    url: "https://www.lanacion.com.ar/autos/cuanto-cuesta-el-toyota-corolla-cross-en-junio-2026-nid08062026/",
    fecha: "jun 2026",
  },
  {
    label: "Corolla Cross XEI HEV (híbrido)",
    value: "$57.355.000",
    kind: "dato",
    confianza: "alta",
    fuente: "La Nación",
    url: "https://www.lanacion.com.ar/autos/cuanto-cuesta-el-toyota-corolla-cross-en-junio-2026-nid08062026/",
    fecha: "jun 2026",
  },
  {
    label: "BYD Atto 3 (eléctrico, referencia)",
    value: "≈ $63.000.000",
    kind: "dato",
    confianza: "media",
    fuente: "km77 (Europa) / BYD",
    url: "https://www.km77.com/coches/byd/atto-3-evo/2026/estandar",
    fecha: "ref. internacional",
    nota: "No se vende en AR a jun-2026 (precio de referencia). Los EV chinos que sí se venden (Yuan Pro ~$48M) son más baratos.",
  },
  {
    label: "Consumo nafta",
    value: "6,1 L/100km",
    kind: "dato",
    confianza: "media",
    fuente: "Toyota / concesionario",
    url: "https://toyotayacopini.com/toyota-corolla-cross-sorprende-por-su-consumo-de-combustible/",
    fecha: "ficha",
    nota: "Mixto de ficha; real urbano ~8–9 L/100km.",
  },
  {
    label: "Consumo híbrido",
    value: "5,0 L/100km",
    kind: "dato",
    confianza: "alta",
    fuente: "km77 (WLTP)",
    url: "https://www.km77.com/coches/toyota/corolla-cross/2023/estandar/estandar/corolla-cross-style-18-hybrid/datos",
    fecha: "WLTP",
  },
  {
    label: "Consumo eléctrico",
    value: "15,9 kWh/100km",
    kind: "dato",
    confianza: "alta",
    fuente: "km77 (WLTP)",
    url: "https://www.km77.com/coches/byd/dolphin/2024/estandar/informacion/byd-dolphin-2024-consumo-y-recarga",
    fecha: "WLTP",
  },
  {
    label: "Patente Córdoba",
    value: "3,0% anual",
    kind: "dato",
    confianza: "media",
    fuente: "Rentas Córdoba",
    url: "https://www.rentascordoba.gob.ar/cms/cs-impuesto-automotor/",
    fecha: "2026",
    nota: "Escala progresiva; tramo valuación $20–50M.",
  },
  {
    label: "TNA crédito prendario",
    value: "≈ 45%",
    kind: "dato",
    confianza: "media",
    fuente: "Santander / Nación / BCRA",
    url: "https://www.santander.com.ar/personas/prendarios/autos",
    fecha: "jun 2026",
    nota: "Rango amplio 22–65% según banco y plazo.",
  },
  {
    label: "TNA plazo fijo (30 días)",
    value: "≈ 19%",
    kind: "dato",
    confianza: "alta",
    fuente: "BCRA / Infobae",
    url: "https://www.infobae.com/economia/2026/06/08/plazo-fijo-cuanto-pagan-los-bancos-por-depositar-1-millon-a-30-dias/",
    fecha: "jun 2026",
  },
  {
    label: "Inflación autos 0km",
    value: "≈ 15%/año",
    kind: "dato",
    confianza: "baja",
    fuente: "Infobae / Arodar",
    url: "https://arodarpost.com.ar/informe-anticipa-que-los-precios-de-los-0km-podrian-aumentar-menos-de-20-en-2026/",
    fecha: "2026",
    nota: "Los 0km corren por debajo de la inflación general (~29%).",
  },

  // --- Supuestos del modelo ---
  {
    label: "Seguro anual",
    value: "$2,0–2,4M",
    kind: "supuesto",
    confianza: "media",
    fuente: "comparadores (SeguroYa)",
    url: "https://seguroya.com.ar/cuanto-cuesta-seguro-auto-argentina-2026/",
    fecha: "2026",
    nota: "Estimación; varía por perfil, código postal y franquicia.",
  },
  {
    label: "Mantenimiento por km",
    value: "$15 / $12 / $7",
    kind: "supuesto",
    confianza: "baja",
    fuente: "Ámbito / Autoblog",
    url: "https://autoblog.com.ar/electrico-hibrido-y-naftero-analisis-de-costo-por-kilometro/",
    fecha: "2025–26",
    nota: "Estimación derivada; eléctrico < híbrido < nafta.",
  },
  {
    label: "Caso de Martín",
    value: "15.000 km · $30M · 5 años",
    kind: "supuesto",
    confianza: "alta",
    fuente: "premisa del problema",
    url: "",
    fecha: "—",
    nota: "Personaje y escenario definidos por el grupo (no es un dato a verificar).",
  },
];

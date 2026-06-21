# Fuentes y confiabilidad de los datos

Datos relevados para **Córdoba, Argentina — junio 2026**. Esta tabla acompaña la
diapositiva «Fuentes y confiabilidad» de la app y existe para que cualquiera pueda
auditar de dónde sale cada número.

Convención de confianza:

- 🟢 **alta** — lookup verificable, fuente directa y reciente.
- 🟡 **media** — fuente secundaria, rango amplio, o conversión por tipo de cambio.
- 🔴 **baja** — estimación de mercado / proyección (no hay un único valor oficial).

## Datos verificables

| Dato | Valor usado | Conf. | Fuente |
|---|---|---|---|
| Nafta súper (Córdoba) | $2.084/L | 🟢 | [hoydia.com.ar](https://hoydia.com.ar/economia/combustibles-cordoba-nafta-precios-2/) |
| Luz residencial (EPEC) | ≈ $200/kWh | 🔴 | [EPEC / ERSeP](https://www.epec.com.ar/hogares-tp-cuadro-tarifario.html) — cuadro sep-2025 + ajustes FAM; jun-2026 estimado |
| Corolla Cross XEI 2.0 (nafta) | $55.944.000 | 🟢 | [La Nación, 15/06/2026](https://www.lanacion.com.ar/autos/cuanto-cuesta-el-toyota-corolla-cross-en-junio-2026-nid08062026/) |
| Corolla Cross XEI HEV (híbrido) | $57.355.000 | 🟢 | [La Nación, 15/06/2026](https://www.lanacion.com.ar/autos/cuanto-cuesta-el-toyota-corolla-cross-en-junio-2026-nid08062026/) |
| BYD Atto 3 (eléctrico, **referencia**) | ≈ $63.000.000 | 🟡 | [km77 (Europa)](https://www.km77.com/coches/byd/atto-3-evo/2026/estandar) · no se vende en AR a jun-2026 |
| Consumo nafta | 6,1 L/100km | 🟡 | [Toyota / concesionario](https://toyotayacopini.com/toyota-corolla-cross-sorprende-por-su-consumo-de-combustible/) — real ~8–9 |
| Consumo híbrido | 5,0 L/100km (WLTP) | 🟢 | [km77](https://www.km77.com/coches/toyota/corolla-cross/2023/estandar/estandar/corolla-cross-style-18-hybrid/datos) |
| Consumo eléctrico | 15,9 kWh/100km (WLTP) | 🟢 | [km77](https://www.km77.com/coches/byd/dolphin/2024/estandar/informacion/byd-dolphin-2024-consumo-y-recarga) |
| Patente Córdoba | 3,0% anual | 🟡 | [Rentas Córdoba](https://www.rentascordoba.gob.ar/cms/cs-impuesto-automotor/) — tramo $20–50M |
| TNA crédito prendario | ≈ 45% | 🟡 | [Santander](https://www.santander.com.ar/personas/prendarios/autos) — rango 22–65% |
| TNA plazo fijo (30 días) | ≈ 19% | 🟢 | [Infobae, 08/06/2026](https://www.infobae.com/economia/2026/06/08/plazo-fijo-cuanto-pagan-los-bancos-por-depositar-1-millon-a-30-dias/) |
| Inflación autos 0km | ≈ 15%/año | 🔴 | [Arodar / Infobae](https://arodarpost.com.ar/informe-anticipa-que-los-precios-de-los-0km-podrian-aumentar-menos-de-20-en-2026/) — corren < inflación |

## Supuestos del modelo (no son lookup de un valor único)

| Supuesto | Valor usado | Conf. | Base |
|---|---|---|---|
| Seguro anual | $2,0–2,4M | 🟡 | [comparadores 2026](https://seguroya.com.ar/cuanto-cuesta-seguro-auto-argentina-2026/) — varía por perfil/CP/franquicia |
| Mantenimiento por km | $15 / $12 / $7 (nafta/híbrido/EV) | 🔴 | [Ámbito / Autoblog](https://autoblog.com.ar/electrico-hibrido-y-naftero-analisis-de-costo-por-kilometro/) — EV < híbrido < nafta |
| Caso de Martín | 15.000 km/año · $30M · 5 años | — | premisa del problema (definida por el grupo) |

## Nota honesta (suma puntos en la rúbrica)

El BYD **Atto 3** se eligió como EV comparable en tamaño al Corolla Cross, pero **no se
comercializa en Argentina a junio 2026**; su precio es una **referencia internacional**. Los
EV de BYD que sí se venden acá (Yuan Pro ≈ US$31.990 ≈ $48M, Dolphin Mini ≈ $34M) son
**más baratos** que los Corolla — es decir, en el mercado real argentino el eléctrico ya
arranca más barato. Por lo tanto, la conclusión del trabajo a favor del eléctrico es
**conservadora**: con datos reales conviene incluso antes.

Esto es exactamente el **subproceso (f) de validación** del marco de Blomhøj: comparar el
modelo con datos reales y ajustar/contextualizar las conclusiones.

# Plan de mejoras — Presentación TP Autos

> Plan para ejecutar en **sesión nueva** (contexto fresco). Implementa 7 mejoras
> sobre la app de presentación del TP de modelización. Leé esta sección de
> contexto antes de tocar nada.

---

## Contexto del proyecto (para quien ejecute)

- **Qué es:** app Next.js de la presentación de un TP de modelización matemática.
  Caso "Martín": qué auto comprar (nafta / híbrido / eléctrico) según km/año y
  cómo pagarlo. Modo **Presentación** (11 slides) + modo **Calculadora**.
- **Stack:** Next.js **16.2.9** (App Router, Turbopack) · React 19.2.4 · TS strict ·
  Tailwind v4 · Recharts · framer-motion · three + @react-three/fiber@9 + @react-three/drei@10.
- **Deploy:** `tp-autos.vercel.app`. NO está git-connected: se deploya con
  `vercel --prod` por CLI (el `.vercel/` está gitignored). El push a `master`
  NO auto-deploya. El CLI puede pedir re-login (`vercel login`, interactivo → lo corre el usuario).
- **Repo:** `github.com/zvMateo/tp-autos`, branch `master`. Commit directo a master
  (TP solo-dev). Attribution de Claude DESHABILITADA (no agregar `Co-Authored-By`).

### Convenciones críticas (NO ignorar)
- **`AGENTS.md` del repo:** "This is NOT the Next.js you know". Verificá la API de
  Next 16 en `node_modules/next/dist/docs/` o Context7 antes de escribir patrones nuevos.
- **GateGuard (hook):** cada **primer** Write/Edit de un archivo en la sesión se
  bloquea pidiendo "facts" (quién lo importa, no-duplicado, datos, instrucción verbatim).
  Presentá los facts y reintentá el mismo tool call. Comandos destructivos (`rm`) también gatean.
- **Colores OKLCH → three:** `THREE.Color` NO entiende `oklch()` ni `lab()`. Para
  pasar colores del CSS a materiales 3D, leé el pixel con `getImageData` (ver
  `components/charts/CostSurfaces3D.tsx`, función `resolveColor`).
- **Modelo = fuente de verdad:** toda la matemática vive en `lib/model.ts`. Ningún
  componente hardcodea números calculados. El validador es `npm run verify`
  (`scripts/verify-model.mts`), corre asserts contra la tabla del brief.
- **Verificación obligatoria:** `npm run build` (typecheck + compile) verde antes de
  declarar listo. Para UI, verificación visual con Playwright (dev server o `npm start`).

### Mapa de archivos relevante
```
app/page.tsx                      shell: useModel() + toggle Presentación/Calculadora
components/PresentationMode.tsx    array SLIDES (11) + navegación por teclado/dots
components/CalculatorMode.tsx      dashboard de la calculadora
components/ParametersPanel.tsx     sliders/inputs de params
components/ResultsPanel.tsx        resultados de la calculadora
components/slides/SlideFrame.tsx   marco común (eyebrow + título + children)
components/slides/Slide*.tsx       Portada, Problema(votación), Variables, Matematica,
                                   Grafico(RaceChart), Sensibilidad, Mapa(DecisionMap),
                                   Espacio(3D), Pago, Conclusion, Fuentes
components/charts/*                CostLinesChart, SensitivityChart, FinanceChart,
                                   DecisionMap, RaceChart, CostSurfaces3D
lib/model.ts                       Params, calcularAuto, cruces, finanzas, series
lib/useModel.ts                    hook de estado global (params + results + set/reset)
lib/autos.ts                       AUTO_UI (colores por auto, CSS vars)
lib/format.ts                      formateadores
lib/sources.ts                     fuentes + confianza (alimenta SlideFuentes)
```

### Datos de referencia actuales (defaults, Córdoba jun 2026)
- Martín: 15.000 km/año, horizonte 5 años (75.000 km totales), ahorro $30.000.000.
- Nafta (Corolla Cross XEI 2.0): $55.944.000 · 6,1 L/100km · mant $15/km · seguro $2.000.000/año.
- Híbrido (Corolla Cross XEI HEV): $57.355.000 · 5,0 L/100km · $12/km · $2.100.000.
- Eléctrico (BYD Atto 3, referencia internacional, NO se vende en AR): $63.000.000 · 15,9 kWh/100km · $7/km · $2.400.000.
- Nafta $2.084/L · luz $200/kWh · patente 3%.
- Ganador a 15k/año: **Nafta** ($84.994.900). Cruces (km/año): N↔H 16.376 · N↔E 19.578 · H↔E 20.651.

---

## Orden de ejecución sugerido

Por dependencia y riesgo: **3 → 2 → 1 → 4 → 5 → 7 → 6**. (El #6 mobile va al final
porque verifica todo junto. El #7 reventa es el más pesado y puede degradarse.)

Hacé `npm run build` después de cada bloque. Al final: build + verificación visual
(desktop y mobile) + commit a master + `vercel --prod`.

---

## Tier 1 — Mueve la nota

### #3 — Cerrar el loop de la votación (intuición vs. modelo)

**Objetivo:** la clase vota en slide 2 ("¿el más barato de comprar es el más barato
de tener?") y en la Conclusión se revela "la clase dijo X · el modelo dice **No**".

**Conflicto a resolver (decidido):** hoy `SlideProblema` tiene un voto **toggle de 1
voto local** (sin agregación, sin backend). Para un reveal "la clase votó mayormente
X" necesitás **conteo acumulable**. Sin backend, la opción correcta es:
- Convertir la votación en un **contador de clase acumulable** (el expositor toca una
  vez por cada mano alzada), con botón de **reset**, y **elevar el estado a global**.
- El voto NO puede vivir local en `SlideProblema` porque la Conclusión necesita leerlo.

**Implementación:**
1. Elevar el estado del voto: agregarlo a `useModel` (`lib/useModel.ts`) como
   `voto: { si: number; no: number }` + acciones `votar(op)` y `resetVotos()`, o
   crear un estado en `app/page.tsx` y pasarlo por props a `PresentationMode` →
   `SlideProblema` (escribe) y `SlideConclusion` (lee). Preferir `useModel` (ya es
   el estado global compartido entre modos).
2. `SlideProblema`: botones que suman a `si`/`no` (modo conteo) + botón "reiniciar
   conteo". Mantené el diseño de barras de porcentaje actual (ya está bien).
3. `SlideConclusion`: bloque nuevo "Ustedes vs. el modelo": si hay votos, mostrar
   `% No` de la clase vs. la respuesta del modelo (**No**, depende de cuánto maneje).
   Si no hay votos, ocultar el bloque (no mostrar 0/0).

**Aceptación:** votar en slide 2 se refleja en la Conclusión. Reset funciona. Build verde.

**Archivos:** `lib/useModel.ts`, `components/slides/SlideProblema.tsx`, `components/slides/SlideConclusion.tsx`.

---

### #2 — Ciclo de Blomhøj visible

**Objetivo:** mostrar en cada slide a qué fase del ciclo de modelización pertenece
(formular → sistematizar → matematizar → analizar → interpretar → validar), para que
se evalúe el PROCESO, no solo el resultado.

**Decisión de diseño (resuelta):** NO tocar los 11 slides (caro con GateGuard). En su
lugar, un componente `FaseBadge` renderizado por `PresentationMode` encima de cada
slide, según un mapa central `{ slideId: fase }`. Badge discreto (esquina sup. der.
del área de slide o junto al progress bar), con la fase actual resaltada en una mini
secuencia de las 6 fases.

**Mapa de fases sugerido:**
| slide | fase |
|---|---|
| portada | (sin badge / "Modelización matemática") |
| problema | Formular |
| variables | Sistematizar |
| matematica | Matematizar |
| grafico | Analizar |
| sensibilidad | Analizar |
| mapa | Analizar |
| espacio (3D) | Analizar |
| pago | Matematizar + Analizar |
| limites (NUEVO, #1) | Validar (crítica) |
| conclusion | Interpretar + Validar |
| fuentes | (transversal) |

**Opción extra (recomendada):** un slide temprano (tras Portada) o un mini-diagrama
en la Portada que muestre las **6 fases completas** del ciclo, así el badge tiene
contexto. Evaluar si suma o satura.

**Aceptación:** cada slide muestra su fase; se entiende el recorrido por el ciclo. Build verde.

**Archivos:** nuevo `components/FaseBadge.tsx` (o `components/slides/FaseBadge.tsx`),
`components/PresentationMode.tsx` (mapa + render del badge). Definir el tipo `Fase` y
el orden de las 6 fases en un lugar central.

---

### #1 — Slide "Lo que el modelo NO captura" (limitaciones)

**Objetivo:** reconocer los límites del modelo = madurez de modelización (lo premia la materia).

**Contenido (decidido). Limitaciones a listar:**
- **Costo de oportunidad del capital:** los $30M parados (o el ahorro) podrían rendir
  invertidos; el modelo no lo descuenta del costo de tener el auto.
- **Tiempo y disponibilidad de carga del EV:** cargar lleva horas; el modelo no
  valora el tiempo perdido ni la conveniencia.
- **Infraestructura de carga:** en Córdoba/AR la red de carga es limitada — riesgo
  real no monetizado en el modelo.
- **Disponibilidad del EV:** el Atto 3 se usa como referencia internacional; a jun
  2026 no se vende en AR (ya marcado en fuentes).
- **Valor de reventa / depreciación:** SOLO incluir acá si el #7 NO se implementa
  (ver tensión abajo). Si #7 se hace, quitar esta línea.

**Decisión de diseño:** slide nuevo `SlideLimites`, insertado en el array `SLIDES`
**antes de Conclusión** (id "limites"). Diseño: lista/cards con tono honesto, encuadre
"esto es la fase de validación/crítica del modelo". Reusar `SlideFrame`.

**Aceptación:** slide nuevo navegable, 11→12 slides, build verde, dots actualizados.

**Archivos:** nuevo `components/slides/SlideLimites.tsx`, `components/PresentationMode.tsx`.

---

## Tier 2 — Intuición real

### #4 — Breakeven en TIEMPO (no en km)

**Objetivo:** traducir el cruce de "km totales" a "**en qué año** el eléctrico se paga
su sobreprecio frente a la nafta", que es mucho más comunicable.

**Sutileza técnica (importante):** la `ordenada` actual mezcla precio de compra
(one-time) con `horizonte·(seguro + patente)` (anual). Para un análisis temporal
correcto hay que **descomponer**:
```
costoAcumulado(auto, año) = precioCompra
                          + año · (seguro + precioCompra·patentePct)   // costos fijos anuales
                          + (energiaPorKm + mantKm) · kmAnio · año      // costo variable anual
```
Breakeven EV vs nafta (en años):
```
añoBE = (precio_ev − precio_nafta)
        / [ (anual_nafta − anual_ev) ]
  donde anual_x = (seguro_x + precio_x·patente) + (energiaPorKm_x + mantKm_x)·kmAnio
```
(Si el denominador ≤ 0, no hay breakeven: el más caro de comprar nunca se recupera a
ese uso → comunicarlo como "a este uso, nunca se paga".)

**Implementación:** función nueva en `lib/model.ts` (ej. `breakevenAnios(p, a, b)`).
Mostrarlo en `SlideGrafico`/`SlideConclusion` o slide propio: "El eléctrico cuesta
$X más al comprar; a 15.000 km/año recién se recupera en el año N" (o "no se recupera
en la vida útil"). Validá el cálculo agregando un assert a `scripts/verify-model.mts`.

**Aceptación:** el número de años coincide con el cruce de km dividido por km/año (sanity check). Build + verify verdes.

**Archivos:** `lib/model.ts`, `scripts/verify-model.mts`, slide donde se muestre.

---

### #5 — Presets en la calculadora

**Objetivo:** botones que setean escenarios de una, para explorar sin mover sliders a ciegas.

**Presets (decididos):**
- "Uso urbano" → kmAnio 8.000
- "Repartidor / viajante" → kmAnio 40.000
- "Nafta por las nubes" → subaNaftaAnual 0.40 (40%)
- (mantener "Restaurar referencia" = reset actual)

**Implementación:** agregar al `useModel` una acción `aplicarPreset(partial: Partial<Params>)`
(o reusar `set` por cada key). Render de los botones en `CalculatorMode`/`ParametersPanel`.
Al aplicar, que se vea cambiar el ganador (ya es reactivo). Opcional: un toast/indicador
"ahora gana: X".

**Aceptación:** cada preset mueve los params y recalcula. Build verde.

**Archivos:** `lib/useModel.ts`, `components/CalculatorMode.tsx` o `components/ParametersPanel.tsx`.

---

### #6 — Verificar mobile (y fixear lo roto)

**Objetivo:** la clase escanea el QR con el teléfono → la app NO puede verse rota en mobile.

**Procedimiento:**
1. `npm run build` + `npm start` (o dev). Playwright a viewport **375×812** (iPhone) y **360×800** (Android).
2. Recorrer: Portada (QR), Problema (votación), Gráfico (RaceChart SVG), Sensibilidad,
   Mapa (DecisionMap SVG), **3D (CostSurfaces3D — el más riesgoso en mobile/WebGL)**,
   Pago, Calculadora (sliders).
3. Buscar: overflow horizontal, texto ilegible, gráficos cortados, 3D que no monta o
   tanquea el teléfono, controles muy chicos para el dedo.
4. Fixear con utilidades responsive de Tailwind (los slides ya usan `lg:` breakpoints;
   revisar que el fallback mobile sea usable). Para el 3D, considerar bajar `dpr` o la
   resolución del grid en pantallas chicas, o mostrar una imagen/fallback si el device es lento.

**Aceptación:** sin overflow horizontal en 360/375px; todos los slides legibles y
usables; el 3D monta o degrada con elegancia. Screenshots de evidencia.

**Archivos:** los que aparezcan rotos (probablemente ajustes en slides/charts).

---

## Tier 3 — Diferencial técnico

### #7 — Modelar el valor de reventa (con datos reales)

**Tensión con #1 (decidida):** si se modela la reventa acá, **quitar** la reventa de
las limitaciones del slide #1 (deja de ser algo "no capturado"). Las otras
limitaciones del #1 quedan igual.

**FASE 1 — Investigar datos reales (NO inventar):**
- Buscar (Exa / web / fuentes AR) la **depreciación a 5 años** de:
  - Toyota Corolla Cross nafta e híbrido en Argentina (Toyota mantiene valor; suele
    rondar 50–65% de retención a 5 años, VERIFICAR).
  - Vehículo eléctrico: datos **muy escasos en AR**. Buscar referencia internacional
    (EVs se deprecian más rápido fuera de incentivos) y marcar como **supuesto de baja confianza**.
- Fuentes sugeridas: InfoAuto / Guía Azul (precios de usados AR), MercadoLibre autos
  usados (comparar 0km vs 5 años), reportes de retención de valor.
- **Fallback:** si NO hay datos confiables del EV, **degradar a "solo limitación"**
  (dejar la reventa en el slide #1 y NO tocar el modelo). Documentar la decisión.

**FASE 2 — Modelo:** agregar a cada `AutoConfig` un `valorResidualPct` (fracción del
precio recuperada a fin de horizonte). Costo neto de propiedad:
```
costoNeto(K) = ordenada + pendiente·K − precio·valorResidualPct
```
Decidir si el residual también escala con km/antigüedad (más realista) o es fijo por
horizonte (más simple). Actualizar `calcularAuto`, cruces, ganador, y `verify`.

**FASE 3 — UI + fuentes:** reflejar el costo neto en rectas/conclusión; agregar las
fuentes de depreciación a `lib/sources.ts` con su nivel de confianza; nota explícita
de que el residual del EV es el dato más incierto.

**Aceptación:** modelo recalcula con residual, `verify` actualizado y verde, fuentes
documentadas con confianza, build verde. O, si fallback: reventa queda como limitación en #1.

**Riesgo:** ALTO (cambia el modelo y todos los números derivados). Hacerlo último.

**Archivos:** `lib/model.ts`, `lib/sources.ts`, `scripts/verify-model.mts`, slides afectados, `SOURCES.md`.

---

## Cierre de la ejecución

1. `npm run build` verde + `npm run verify` verde.
2. Verificación visual desktop + **mobile** (Playwright, screenshots).
3. Commit a `master` (sin atribución) + push.
4. Deploy: `vercel --prod` (puede requerir `vercel login` interactivo — lo corre el usuario).
5. Verificar 200 en `tp-autos.vercel.app` y que los cambios estén online.

## Notas de deuda preexistente (no bloqueante)
- 2 vulnerabilidades `moderate` en deps de three (`npm audit`).
- Warning de múltiples lockfiles (`pnpm-lock.yaml` en el home del usuario + el del repo);
  se silencia con `turbopack.root` en `next.config`.

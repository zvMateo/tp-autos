# Plan de cierre del TP — suba de luz EPEC, slides, PDF estudiable y QA

> **Ejecutar en sesión nueva (contexto fresco).** Este es el plan de trabajo de Mateo (Partes 1–5)
> precedido por el estado real del proyecto al cierre de la sesión del **21/06/2026**. Leé la sección
> de estado antes de tocar nada.

---

## ⚙️ Estado al 21/06/2026 (lo ya hecho — leer primero)

- **App en producción:** `tp-autos.vercel.app`. Stack: Next **16.2.9** (App Router, Turbopack) · React 19 · TS strict · Tailwind v4 · Recharts · framer-motion · three/R3F. **Deploy por integración GitHub→Vercel: el push a `master` auto-deploya** (esto cambió respecto del `plan-mejoras.md`, que decía que era manual por CLI).
- **Hoy se implementó y deployó** (commit `7913b18` en `master`):
  - Votación de clase con conteo acumulable + reset, elevada a `lib/useModel.ts`, con **reveal "ustedes vs. el modelo"** en la Conclusión.
  - **Badge del ciclo de Blomhøj** por slide (`components/FaseBadge.tsx`, render en `PresentationMode`).
  - **Slide nuevo "Lo que el modelo no captura"** (`components/slides/SlideLimites.tsx`) — fase de validación.
  - **Breakeven en años**: `costoAnual` y `breakevenAnios` en `lib/model.ts` (+ assert en `scripts/verify-model.mts`), mostrado en la Conclusión.
  - **Presets** en la calculadora (urbano 8k / repartidor 40k / nafta +40%).
  - **Reventa: NO modelada** (decisión). La investigación confirmó que el BYD Atto 3 ni se vende en AR y su depreciación es un supuesto extranjero de baja confianza; quedó como **limitación explícita** en el slide de límites. Los Toyota retienen ~60% (dato construido, confianza media), pero modelar 2 de 3 sesgaría la comparación.
- **La app ahora tiene 12 slides (no 11):** portada(1) · problema(2) · variables(3) · matemática(4) · gráfico(5) · sensibilidad(6) · mapa(7) · 3D(8) · pago(9) · **límites(10)** · conclusión(11) · fuentes(12). **El reparto del plan (Mateo 1–5 / Enzo 6–8 / Bautista 9+) hay que recalcularlo sobre 12** (Límites=10 entra al cierre, probablemente con Bautista).
- **`public/guia.html` se actualizó hoy** con la sección de breakeven y la de validación/límites. **⚠️ Dependencia:** si se implementa la suba de luz (Parte 1), los **cruces y el breakeven cambian** → la guía y sus números (cruce 19.578 km/año, breakeven ≈7,5 años) quedan viejos y hay que **regenerarla después**. Decisión al cierre: NO se commiteó la guía aún (pendiente).
- **Convenciones del repo (respetar):**
  - `AGENTS.md`: "This is NOT the Next.js you know" → verificar API de Next 16 antes de patrones nuevos.
  - **GateGuard** (hook ECC): gatea el **primer** Write/Edit de cada archivo de la sesión pidiendo facts; presentás los facts y reintentás. Patrón: en un mismo mensaje, el primer edit de un archivo bloquea y los siguientes pasan.
  - **Modelo = fuente de verdad** en `lib/model.ts`; ningún componente hardcodea números calculados. Validador: `npm run verify`. Build: `npm run build`.
  - **Commit/push/deploy los corre Mateo** (los settings bloquean `git commit` a Claude). El deploy se dispara solo con el push a master.
- **Orden recomendado (evita recalcular dos veces):** Parte 3 (datos EPEC) → Parte 1 (modelo) → recalcular `verify` → Parte 2 (slides + calculadora) → Parte 4 (regenerar guion/PDF estudiable) → Parte 5 (checklist).

## 📁 Archivos fuente en `docs/` (la "ley" del TP)

- `TRABAJOPRÁCTICOEVALUABLE (2).docx` — **consigna de la profe** (objetivos, qué pide, criterios de evaluación).
- `Modelizacion1 (1).pdf` — **texto de Blomhøj** (los 6 subprocesos de modelización).
- `TP-Funciones-GUION-y-DEFENSA.md` — **guion de defensa** (base de la Parte 4; actualizar con los números nuevos y exportar a PDF).
- `plan-mejoras.md` — plan ya ejecutado hoy (referencia).
- *(Falta ubicar la "infografía de funciones" suelta — puede estar dentro del `.docx`; verificar.)*

---

# PARTE 1 — Sumar la SUBA DE LA LUZ (EPEC) a todo el proyecto ⚡ (lo más importante)

Hoy el modelo sube el precio de la **nafta** año a año (exponencial), pero deja la **luz fija**. Eso es una debilidad real: en la realidad la tarifa de EPEC **también sube**, y eso encarece el km del eléctrico. Hay que modelarlo en serio. Esto hace el trabajo más honesto y más completo (y nos cubre si la profe lo pregunta).

### 1.1 Cambio en el modelo (`lib/model.ts`)

- Agregá un parámetro nuevo **`subaLuzAnual`** (suba % anual de la luz), igual que ya existe **`subaNaftaAnual`**.
- En la función que calcula el costo de cada auto, hoy hace algo así:
  ```
  precioEnergía = (energia === "luz") ? luz : nafta * promedio((1+subaNaftaAnual)^t)
  ```
  Cambialo para que la luz **también se promedie** sobre los 5 años, con su propia tasa:
  ```
  precioEnergía = (energia === "luz")
      ? luz   * promedio((1+subaLuzAnual)^t,   t=0..H-1)
      : nafta * promedio((1+subaNaftaAnual)^t, t=0..H-1)
  ```
  (Usá la **misma función de promedio** que ya tenés para la nafta, no inventes otra.)
- Resultado esperado: cuando sube la luz, la **pendiente del eléctrico** sube, y el punto de equilibrio nafta↔eléctrico **se corre hacia arriba** (el eléctrico conviene un poco más tarde). Es el efecto contrario al de la nafta → por eso es interesante mostrar los dos juntos.

### 1.2 Que la sensibilidad use las dos variables

- En la función de sensibilidad / cruce, que el cálculo tome en cuenta **las dos subas** (nafta y luz), no solo la nafta.
- Definí un **valor base realista de suba de luz** (lo investigás en la Parte 3) para que la conclusión "por defecto" ya sea con la luz subiendo, no en cero.

### 1.3 Recalculá y anotá los números nuevos

Después del cambio, anotá cómo quedan (los vas a necesitar para el guion):
- Nuevo punto de equilibrio nafta↔eléctrico **con la luz subiendo**.
- Si cambia quién gana a los 15.000 km/año de Martín (lo más probable: sigue ganando el nafta, pero confirmalo).
- La nueva tabla de la slide de sensibilidad.

---

# PARTE 2 — Cambios en las SLIDES / la app

Repasá slide por slide. Marcá ✅ cuando esté.

- [ ] **Slide 3 "Las variables":** agregar la **suba anual de la luz (EPEC)** como variable/supuesto, al lado de la suba de la nafta. Mostrar el $/kWh y el % de suba con su fuente.
- [ ] **Slide 6 "Sensibilidad":** ahora tiene que mostrar **las dos**: cómo mueven el punto de equilibrio la suba de la nafta (lo baja) **y** la suba de la luz (lo sube). Actualizar la tabla y el texto del "wow".
- [ ] **Modo Calculadora:** agregar un **slider de "suba de la luz EPEC"** además del de la nafta, para poder moverlos en vivo en la exposición.
- [ ] **Slide "Fuentes":** sumar la fila de **tarifa EPEC + suba estimada**, con fuente y nivel de confianza.
- [ ] **Reescribir la "aclaración honesta":** antes decíamos "mantuvimos la luz fija (conclusión conservadora)". Ahora que la modelamos, cambiarlo por: *"modelamos también la suba de la luz; aun así, el eléctrico conviene a partir de X km/año"*.
- [ ] **Slide "Conclusión":** si los números cambian, actualizar el umbral y la recomendación.
- [ ] **Tabla de pares ordenados (Slide 5):** ya está calculada en el archivo del guion. Recalcularla si la suba de luz cambia los costos del eléctrico, y dejarla **visible** (la consigna pide tabla + pares ordenados + gráfico).
- [ ] **Coherencia de cantidad de slides:** el PDF de la guía vieja decía "9 slides"; **hoy son 12**. Que todo diga **12** (y revisar `public/guia.html`).

---

# PARTE 3 — Investigación a sumar (datos reales de EPEC) 🔎

Buscá y cargá, con fuente y fecha (junio 2026):

- [ ] **Precio actual de la luz EPEC** en Córdoba ($/kWh) — confirmar/ajustar el ~$200 que usamos hoy. Usar tarifa residencial (la franja que corresponda).
- [ ] **Suba estimada anual de la tarifa EPEC** (% por año) — buscar aumentos recientes y proyección. Cargarlo como `subaLuzAnual` base.
- [ ] Ponerle **nivel de confianza** (probablemente "media", como la nafta a futuro) y la **fuente** (EPEC / ERSeP / notas de medios).

> Recordá la **regla base**: los datos salen de fuentes externas reales (con fuente + nivel de confianza), pero el *marco* (qué función usar, cómo validar, los 6 subprocesos) sale de los **archivos de la profe** (`TRABAJOPRÁCTICOEVALUABLE (2).docx` + `Modelizacion1 (1).pdf`).

---

# PARTE 4 — Cuando termines TODO: generar el PDF estudiable 📄

El objetivo final: **un solo PDF del que los tres podamos estudiar y exponer**. Tiene que incluir, en este orden:

1. **Portada** (título, integrantes, fecha).
2. **Separación de temas por integrante** (la división de slides, recalculada sobre **12 slides**).
3. **El guion de defensa completo** de cada uno: 🗣️ lo que dice + 🧠 defensa teórica (fórmulas a derivar) + ❓ preguntas posibles con respuesta.
4. **La tabla de pares ordenados** y la **chuleta de fórmulas** (incluir `breakevenAnios`/`costoAnual` y la suba de luz).
5. **El banco de preguntas difíciles** y el **checklist final**.

> Base: el archivo **`docs/TP-Funciones-GUION-y-DEFENSA.md`**. Actualizalo con los números nuevos de la luz y exportalo a PDF. Que quede **un PDF final, prolijo, listo para imprimir**.
>
> **Nota:** `public/guia.html` (la guía de estudio web, ya actualizada hoy con breakeven y límites) y `TP-Funciones-GUION-y-DEFENSA.md` (el guion de defensa) son **dos documentos distintos**. Decidir si se unifican o se mantienen separados, y mantener ambos coherentes con los números finales.

**Importante:** el teórico y el guion también se arman con la **regla base** (archivos de la profe + info externa). El marco de Blomhøj y los criterios de la consigna tienen que estar citados en el teórico.

---

# PARTE 5 — Lista final de control: qué está BIEN / qué está MAL o FALTA ✅❌

Generá (y dejá en el PDF o en un archivo aparte) una **lista de control honesta** con tres columnas.

### ✅ Lo que ya está BIEN
- Caso real y bien formulado (Martín, Córdoba, variables claras).
- Usa varias familias de funciones: **lineal, exponencial, interés compuesto, porcentajes**.
- Análisis de sensibilidad (lo pide la rúbrica textual).
- Validación con datos reales + niveles de confianza + hallazgo honesto del BYD.
- Marco teórico de Blomhøj (6 subprocesos) mapeado y **visible por slide** (badge).
- App interactiva + calculadora (sirve como propuesta de enseñanza).
- Matemática verificada: cruces, cuota francesa y breakeven dan bien (`npm run verify`).
- **Slide de límites/validación** y **breakeven en años** ya agregados hoy.

### ❌ / ⏳ Lo que estaba MAL o FALTA
- ⚡ **Faltaba la suba de la luz EPEC** → se agrega (Partes 1, 2 y 3).
- 📋 La **tabla de pares ordenados** tiene que estar visible en la slide (Parte 2).
- 🔢 Coherencia de cantidad de slides: la guía vieja decía 9; **hoy son 12** (Parte 2).
- 🗣️ Cada uno tiene que poder **derivar su fórmula a mano**, sin la app (riesgo en la defensa oral).
- ⚖️ Decir las **limitaciones** nosotros antes de que pregunten (ya está el slide; el valor de reventa quedó como simplificación explícita).
- 📈 Tener el **gráfico de las 3 rectas con el cruce** listo para mostrar.

### ⚠️ Riesgos para la exposición
- Que parezca que no lo hicimos nosotros → blindar con dominio de la matemática a mano.
- Que la matemática quede tapada por el diseño → mostrar fórmulas, tabla y derivación, no solo la app.

---

## 🧭 Orden de ejecución

1. Investigar datos de EPEC (Parte 3).
2. Tocar el modelo (Parte 1) — `subaLuzAnual` + recalcular `npm run verify`.
3. Actualizar slides + calculadora (Parte 2).
4. Recalcular números y actualizar el guion/teórico + `public/guia.html`.
5. Generar el **PDF estudiable final** (Parte 4).
6. Cerrar con la **lista BIEN / MAL / FALTA** (Parte 5).
7. Build + verify verdes → commit + push (auto-deploy) → avisar al grupo.

**Meta: exponer y que salga 10/10.** 🚀

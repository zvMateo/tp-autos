# ¿Qué auto conviene? — App de presentación del TP

Aplicación web interactiva para exponer en clase el TP de modelización: **qué auto comprar
(nafta / híbrido / eléctrico) según cuánto se maneje, y cómo pagarlo**. Tiene dos modos:

- **Presentación** — 12 slides a pantalla completa (incluye «Fuentes y confiabilidad»), navegables con el teclado (←/→/Espacio).
- **Calculadora** — dashboard con sliders que recalculan todos los gráficos y resultados en vivo.

Toda la matemática vive en `lib/model.ts` (fuente de verdad). Nada se hardcodea en la UI:
todo deriva de los parámetros. El modelo está validado contra la tabla de referencia del brief
con `scripts/verify-model.mts`.

Los **datos son reales** (Córdoba, junio 2026) y están documentados en [`SOURCES.md`](./SOURCES.md)
y en la diapositiva «Fuentes y confiabilidad», con nivel de confianza y enlace por cada dato.
Datos verificables (nafta, luz, precios, consumos, patente, tasas) vs. supuestos del modelo
(seguro, mantenimiento/km, premisas del caso) están marcados como tales.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Recharts · framer-motion ·
Radix Slider. 100% client-side, sin backend. Deploya en Vercel sin configuración extra.

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run verify     # valida el modelo contra la tabla de referencia del brief
```

## Navegación de la presentación

- `→` / `Espacio` / `PageDown` → siguiente slide
- `←` / `PageUp` → slide anterior
- `Home` / `End` → primera / última
- Los dots de la barra inferior también navegan (y son clickeables).

Mientras un slider o input está enfocado, las flechas controlan ese control (no cambian de slide).

## Parámetros editables (modo Calculadora)

Cada uno recalcula gráficos y resultados al instante. **"Restaurar referencia"** vuelve a los `defaults`.

### Uso y energía
- **Kilómetros por año** — cuánto maneja Martín; mueve la línea vertical y decide el ganador.
- **Años que lo tiene** — horizonte del análisis (eje de las rectas = km totales).
- **Precio de la nafta** ($/L) — afecta el costo por km de nafta e híbrido.
- **Precio de la luz** ($/kWh) — afecta el costo por km del eléctrico.
- **Suba anual de la nafta** (%) — capa exponencial; inclina las rectas y **baja** el punto de cruce.
- **Suba anual de la luz (EPEC)** (%) — capa exponencial sobre el eléctrico; **sube** el punto de cruce (efecto opuesto a la nafta).
- **Patente** (% anual del valor) — parte del costo fijo (ordenada).

### Autos (nafta / híbrido / eléctrico)
- **Precio** — precio de compra de cada auto (en millones).
- **Consumo** — L/100km (nafta/híbrido) o kWh/100km (eléctrico).

### Pago (sobre el auto nafta)
- **Precio del auto objetivo** — lo que se quiere comprar.
- **Ahorro disponible** — plata que ya tiene Martín.
- **TNA crédito prendario** (%) — tasa nominal anual del crédito.
- **Plazo del prendario** (meses) — cantidad de cuotas (sistema francés).
- **TNA plazo fijo** (%) — rendimiento si espera y ahorra.
- **Inflación anual del auto** (%) — cuánto sube el precio del auto si espera.

## El modelo (resumen)

- Recta de costo por auto: `C(K) = ordenada + pendiente·K`, con `K` = km totales.
  - `pendiente = energía/km + mantenimiento/km`
  - `ordenada = precio + horizonte·(seguro + precio·patente)`
- Punto de equilibrio: `K* = (ordenada_b − ordenada_a) / (pendiente_a − pendiente_b)`.
- Sensibilidad: precio efectivo de cada energía = `precio₀ · mean((1+r)^t, t = 0..horizonte−1)`, con su propia tasa de suba (nafta y luz).
- Finanzas: cuota francesa, plazo fijo capitalizado mensual, escenario "esperar".

## Estructura

```
app/            layout + page (shell con el toggle de modo)
lib/            model.ts (fuente de verdad) · format.ts · autos.ts · useModel.ts
components/     CalculatorMode · PresentationMode · paneles · CarCard
components/ui/  Slider · NumberField · CountUp · ModeToggle
components/charts/  CostLinesChart (G1) · SensitivityChart (G2) · FinanceChart (G3)
components/slides/  las 12 slides + SlideFrame
lib/sources.ts  fuentes + confianza por dato (alimenta la slide «Fuentes»)
SOURCES.md      tabla de fuentes para revisión
scripts/        verify-model.mts (asserts contra la tabla del brief)
```

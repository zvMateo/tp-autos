# 🎤 Guion de exposición y defensa teórica — TP "¿Qué auto conviene?"

> **Para:** Mateo Zavala · Enzo Gaido · Bautista Defago
> **Final de Modelización Matemática — Funciones · Exposición 23/06/2026**
> **App:** tp-autos.vercel.app (modo Presentación + Calculadora)

---

## Cómo usar este documento

Cada uno estudia **su sección**. En cada una hay:
- 🗣️ **Lo que decís** → guion hablado (no hay que memorizarlo literal, sí dominar el hilo).
- 🧠 **Defensa teórica** → de dónde sale cada fórmula, para poder explicarla en el pizarrón.
- ❓ **Si te preguntan** → preguntas que puede hacer la profe, con la respuesta.

**Regla de oro:** la app impresiona, pero el 10 se gana cuando podés explicar la matemática **sin la app**, a mano. Estudien la defensa teórica más que el guion.

---

## 📊 División de slides recomendada

La app tiene **12 slides**. Reparto sugerido (la columna vertebral primero, la decisión financiera y la validación al final):

| Slides | Integrante | Tema | Familias de función |
|---|---|---|---|
| **1–5** Portada · El problema · Las variables · La matemática · El gráfico y el cruce | **Mateo** | El caso + modelo lineal + punto de equilibrio | **Lineal · Punto de equilibrio** |
| **6–8** Sensibilidad · Mapa de decisión · El costo en 3D | **Enzo** | Suba de nafta y de luz + sensibilidad + porcentajes | **Exponencial · Porcentajes** |
| **9, 10 y 12** Cómo lo paga · Lo que el modelo no captura · Fuentes | **Bautista** | Cómo pagarlo + límites + validación + marco teórico | **Interés compuesto** |
| **11** Conclusión | **Equipo** | Cierre: los tres dicen una línea | — |

**Tiempos sugeridos (exposición de ~12–15 min):** Mateo 5 min · Enzo 4 min · Bautista 4 min · Cierre 1–2 min.

> ⚠️ **Importante:** la app tiene **12 slides** (se sumó "Lo que el modelo no captura"). Si ven el número viejo "9" o "11" en algún lado, está desactualizado: son **12**.

---

# 🔵 MATEO — Slides 1 a 5 (la columna vertebral)

Tu parte es la base: planteás el problema y mostrás **por qué cada auto es una recta y por qué se cruzan**. Si esto queda claro, el resto del trabajo se sostiene.

### 🗣️ Lo que decís

> **(Slide 1 – Portada)** "Buenas. Nuestro trabajo se llama *¿Qué auto conviene y cómo pagarlo?*. Tomamos una decisión real y la modelamos con funciones: lineales, exponenciales, interés compuesto y porcentajes. Somos Mateo, Enzo y Bautista."
>
> **(Slide 2 – El problema)** "El caso: Martín, de Córdoba capital, tiene 30 millones ahorrados y usa el auto para trabajar, recorre 15.000 km por año y lo quiere tener 5 años. Duda entre tres autos —nafta, híbrido y eléctrico— y entre tres formas de pago. La pregunta central que guía todo el trabajo es: **¿el auto más barato de comprar es el más barato de tener?**"
>
> **(Slide 3 – Las variables)** "Estos son los tres autos con datos reales de junio 2026. Lo clave es separar dos cosas: lo que pagás **una vez o fijo** (el precio, el seguro, la patente) y lo que pagás **por cada kilómetro** (la energía y el mantenimiento). La energía tiene dos precios: la nafta a $2.084 el litro y la luz de EPEC a $220 el kWh."
>
> **(Slide 4 – La matemática)** "El costo total de tener el auto durante los 5 años es una función lineal: **C(K) = ordenada + pendiente por K**, donde K son los kilómetros totales. La **ordenada** es el costo fijo: lo que pagás aunque no muevas el auto. La **pendiente** es lo que cuesta cada kilómetro. El eléctrico arranca más caro —ordenada de 84 millones— pero su kilómetro es baratísimo: **42 pesos contra 142 del nafta**."
>
> **(Slide 5 – El gráfico y el cruce)** "Como cada auto tiene distinta ordenada y distinta pendiente, las rectas **se cruzan**. El cruce es el **punto de equilibrio**: la cantidad de km donde dos autos cuestan lo mismo. Entre nafta y eléctrico, ese punto está en **20.200 km por año**. ¿Qué significa? Que por debajo de eso conviene el nafta, y por encima conviene el eléctrico. Y acá está la respuesta a nuestra pregunta: a los 15.000 km de Martín gana el nafta, por muy poco —apenas 178 mil pesos menos que el híbrido—. Así que **NO: el más barato de comprar no es siempre el más barato de tener; depende de cuánto manejes.**"

*(Tip: mostrá el gráfico de la app y movés el slider de km/año en vivo; la línea vertical se corre y cambia quién gana.)*

### 🧠 Defensa teórica (dominar a fondo)

**Por qué es una función lineal:** porque el costo por kilómetro es **constante** (cada km cuesta lo mismo). Una magnitud que crece a **tasa de cambio constante** se representa con una recta.

**La fórmula, término por término:**

```
C(K) = b + m · K          (K = km totales en 5 años = km/año × 5)

b (ordenada) = precio + horizonte × (seguro + precio × patente%)
m (pendiente) = (consumo/100 × precio_energía) + mantenimiento_por_km
```

- **b** = costo fijo: lo pagás aunque el auto quede en el garaje.
- **m** = costo variable por km: energía + mantenimiento.

**Las tres rectas reales (jun 2026):**

| Auto | Recta C(K) |
|---|---|
| Nafta | 74.335.600 + 142,1·K |
| Híbrido | 76.458.250 + 116,2·K |
| Eléctrico | 84.450.000 + 42,0·K |

**De dónde sale el punto de equilibrio (saber derivarlo en el pizarrón):**
Dos autos cuestan lo mismo cuando sus rectas se igualan:

```
b_a + m_a·K = b_b + m_b·K
b_a − b_b = m_b·K − m_a·K
K* = (b_b − b_a) / (m_a − m_b)
```

Nafta vs eléctrico: K* = (84.450.000 − 74.335.600) / (142,1 − 42,0) = 10.114.400 / 100,1 ≈ **101.000 km totales** → ÷5 años = **20.200 km/año**. ✓

**El número final:** a 15.000 km/año (75.000 km totales) → Nafta $84,99M < Híbrido $85,17M < Eléctrico $87,60M.

### ❓ Si te preguntan

- **"¿Por qué lineal y no otra función?"** → Porque el costo por km es constante; a tasa constante, recta.
- **"¿Qué representan b y m?"** → b = lo fijo (precio + seguro + patente). m = lo que suma cada km.
- **"¿Por qué se cruzan las rectas?"** → Porque el eléctrico arranca más arriba (b mayor) pero sube más despacio (m menor). Tarde o temprano lo alcanza.
- **"Mostrame cómo hallás el cruce."** → Igualás las dos funciones y despejás K (la fórmula de arriba).
- **"¿Por encima de 20.200 siempre gana el eléctrico?"** → Sí, frente al nafta; frente al híbrido el cruce es a 21.535.

---

## 📋 Tabla de pares ordenados (para la Slide 5 — Mateo)

Esto es lo que la consigna pide explícitamente: **tabla, pares ordenados y gráfico**. Cada fila es un par (km/año, costo total a 5 años). En **negrita**, el auto que gana en esa fila. *(La misma tabla está visible en la app, en la slide "La matemática".)*

| km/año | km totales (K) | Nafta | Híbrido | Eléctrico | Gana |
|---:|---:|---:|---:|---:|:--|
| 0 | 0 | **$74.335.600** | $76.458.250 | $84.450.000 | Nafta |
| 5.000 | 25.000 | **$77.888.700** | $79.363.250 | $85.499.500 | Nafta |
| 10.000 | 50.000 | **$81.441.800** | $82.268.250 | $86.549.000 | Nafta |
| 15.000 | 75.000 | **$84.994.900** | $85.173.250 | $87.598.500 | Nafta *(Martín)* |
| 20.000 | 100.000 | $88.548.000 | **$88.078.250** | $88.648.000 | Híbrido |
| 25.000 | 125.000 | $92.101.100 | $90.983.250 | **$89.697.500** | Eléctrico |
| 30.000 | 150.000 | $95.654.200 | $93.888.250 | **$90.747.000** | Eléctrico |

*(Costos = total de tener el auto durante los 5 años. K = km/año × 5. Calculados con las rectas C(K) de arriba.)*

**Los tres puntos de cruce (pares ordenados donde dos rectas se igualan):**

| Cruce | km totales | km/año |
|:--|---:|---:|
| Nafta = Híbrido | 81.880 | **16.376** |
| Nafta = Eléctrico | 100.999 | **20.200** |
| Híbrido = Eléctrico | 107.677 | **21.535** |

> 🔑 **Lectura fina (esto luce mucho si lo decís):** la tabla revela **tres zonas**, no dos:
> - **Hasta ~16.376 km/año → gana el Nafta** (es el caso de Martín: 15.000).
> - **Entre 16.376 y 21.535 km/año → gana el Híbrido** (una franja intermedia que solo aparece al mirar la tabla completa).
> - **Más de ~21.535 km/año → gana el Eléctrico.**
>
> A 15.000 km/año el nafta le gana al híbrido por apenas **$178.350** ($85.173.250 − $84.994.900). Tan poco que un cambio chico (manejar un poco más, o que suba la nafta) ya da vuelta el resultado → conecta directo con la parte de Enzo.

---

# 🟠 ENZO — Slides 6 a 8 (el "wow": cómo todo se mueve)

Tu parte muestra que la conclusión de Mateo **no es fija**: depende del precio de la energía. Acá entran la exponencial, los porcentajes y el análisis de sensibilidad (que la rúbrica pide textual). Lo nuevo y fuerte: modelamos la suba de **las dos** energías (nafta y luz), que empujan el cruce en sentidos opuestos.

### 🗣️ Lo que decís

> **(Slide 6 – Sensibilidad)** "Mateo mostró que hoy gana el nafta. Pero ¿qué pasa si la energía sube? El precio no sube una cantidad fija: sube un **porcentaje cada año**, y eso es una función **exponencial**. Tenemos dos sliders. **Si sube la nafta**, la recta del nafta se inclina más y el punto de equilibrio **se desploma**: hoy está en 20.200 km/año; con +25% queda en ~11.100; con +50%, en ~6.560; con +100%, en ~2.660. O sea, si la nafta se dispara, al eléctrico le conviene mucho antes. **Pero también modelamos la suba de la LUZ**, que viene subiendo ~32% al año: ahí el efecto es al revés, el cruce **sube**: con la luz +50% el eléctrico recién conviene pasando los ~47.000 km/año, y si la luz se disparara más de ~70% al año, al eléctrico no le conviene a ningún uso. Las dos energías mueven el umbral en sentidos opuestos: por eso modelamos las dos y no congelamos ninguna."
>
> **(Slide 7 – Mapa de decisión)** "Este mapa resume todo: combina los km por año con la suba de la nafta y pinta qué auto gana en cada combinación. Es una forma de ver de un vistazo dónde conviene cada uno."
>
> **(Slide 8 – El costo en 3D)** "Y acá lo mismo en tres dimensiones: el costo según los kilómetros y la suba de la energía. La superficie deja ver cómo el eléctrico se vuelve más conveniente a medida que sube la nafta, y menos a medida que sube la luz."
>
> "Una aclaración honesta: antes manteníamos la luz fija y decíamos que eso hacía la conclusión **conservadora** a favor del eléctrico. Ahora modelamos la suba de **las dos** energías con datos reales. Aun así, a precios de hoy gana el nafta hasta ~20.200 km/año: la conclusión **no depende de congelar una variable**."

### 🧠 Defensa teórica

**Por qué exponencial y no lineal:** el precio de la energía sube un **porcentaje sobre el valor del año anterior**, no una cantidad fija. Eso es crecimiento **compuesto** → exponencial. Vale igual para la nafta y para la luz.

```
precio_energía(t) = precio₀ · (1 + r)^t      (r = suba anual de esa energía)
```

**Por qué se usa un precio "promedio":** como el costo por km cambia cada año, para mantener **una sola recta** por auto tomamos el precio **promedio efectivo** sobre los 5 años:

```
precio_efectivo = precio₀ · (1/H) · Σ (1+r)^t   para t = 0,1,...,H−1
```

Ese precio efectivo entra en la **pendiente**. La nafta (y el híbrido, que también usa nafta) usa la suba de la nafta; el eléctrico usa la suba de la luz. Por eso, al subir la suba de la nafta las rectas de nafta/híbrido se inclinan y el cruce con el eléctrico **baja**; al subir la suba de la luz, la recta del eléctrico se inclina y el cruce **sube**.

**Los porcentajes que aparecen solos:**
- **Patente** = 3,0% anual del valor del auto → es parte de la **ordenada** (costo fijo).
- **Inflación del auto** ≈ 15%/año → cuánto sale el auto si Martín espera (lo usa Bautista).
- **Intereses del prendario** = 117% sobre lo pedido → también un porcentaje (lo ve Bautista).
- **Suba de la luz EPEC** ≈ 32%/año → interanual real de la tarifa (apenas sobre la inflación REM ~30,5%).

**Cálculo de porcentaje (base):** `parte = base × porcentaje`. Ej.: patente = precio × 0,03.

### ❓ Si te preguntan

- **"¿Qué es un análisis de sensibilidad?"** → Ver cuánto **cambia la respuesta del modelo** cuando variás un parámetro (acá, la suba de la nafta o de la luz). Sirve para saber qué tan **robusta** es la conclusión.
- **"¿Por qué la energía es exponencial?"** → Porque sube un % sobre el valor anterior; si fuera una cantidad fija sería lineal.
- **"¿Por qué promedian el precio en vez de usar el de cada año?"** → Para mantener el modelo en una sola recta por auto; es una **simplificación declarada**. Con el promedio el resultado es prácticamente el mismo y mucho más claro.
- **"¿No es trampa mantener la luz fija?"** → Ya **no** la mantenemos fija: modelamos la suba de las dos energías. Subir la nafta adelanta al eléctrico; subir la luz lo atrasa. Mostramos las dos para que la conclusión no dependa de congelar ninguna.
- **"¿De dónde sacaron el 32% de la luz?"** → Del aumento interanual real de la tarifa plena de EPEC (dato de la propia empresa, vía La Voz/Ente Regulador), que quedó apenas por encima de la inflación esperada (REM 30,5%).

---

# 🟢 BAUTISTA — Slides 9, 10 y 12 (cómo pagarlo, los límites y por qué confiar)

Tu parte cierra el trabajo: el interés compuesto del crédito, las limitaciones que reconocemos nosotros, la honestidad de los datos y el marco teórico de Blomhøj (material de la cátedra → suma mucho).

### 🗣️ Lo que decís

> **(Slide 9 – Cómo lo paga)** "Ya sabemos qué auto. Ahora, ¿cómo lo paga? A Martín le faltan **25,9 millones** (el auto sale 55,9 y tiene 30). Tiene tres opciones."
>
> "**Opción 1: crédito prendario**, con el sistema francés, que es **interés compuesto**. Con una tasa del 45% anual a 48 meses, la cuota le da **1.173.000 pesos por mes**. Si suma todas las cuotas, termina pagando **56,3 millones** por financiar 25,9. O sea: **los intereses, 117%, son MÁS que la plata que pidió.**"
>
> "**Opción 2: esperar y ahorrar** en un plazo fijo, que también es interés compuesto. Si pone los 30 millones a un año al 19%, junta 36,2 millones. Pero el auto, con 15% de inflación, pasa a costar 64,3 millones. Entonces el faltante **creció**: pasó de 25,9 a 28,1 millones. **Esperar no lo acerca al auto.**"
>
> "**Opción 3: contado** es siempre lo más barato, pero solo le alcanza si junta la diferencia."
>
> **(Slide 10 – Lo que el modelo no captura)** "Antes de cerrar, lo que dejamos afuera a propósito, para ser honestos. No modelamos el **valor de reventa** a los 5 años: el BYD Atto 3 ni se vende en Argentina, así que su depreciación sería un supuesto de baja confianza; y modelar la reventa de solo dos de los tres autos sesgaría la comparación. Tampoco descontamos a valor presente. Son simplificaciones **declaradas**, no errores tapados."
>
> **(Slide 12 – Fuentes)** "Por último, validación. Cada dato tiene **fuente y nivel de confianza**: separamos lo verificable de lo estimado. La nafta a 2.084 el litro y el plazo fijo al 19% son datos de alta confianza. La luz de EPEC a ~220 el kWh es una proyección a junio 2026 sobre el último cuadro oficial (confianza media), y su suba de ~32% anual sale del interanual real de la tarifa. Y un hallazgo honesto que suma: el BYD Atto 3 todavía no se vende en Argentina a junio 2026, así que usamos un precio de referencia; los eléctricos chinos que sí se venden son más baratos, así que nuestra conclusión a favor del eléctrico es **conservadora**."
>
> **(Marco teórico)** "Todo esto sigue el modelo de Blomhøj, que vimos en clase: los **6 subprocesos de modelización**. Formulamos el problema, sistematizamos las variables, las pasamos a lenguaje matemático, analizamos, interpretamos y validamos con datos reales. No inventamos números: recorrimos todo el ciclo."

### 🧠 Defensa teórica

**El faltante (gap):** `gap = precio − ahorro = 55.944.000 − 30.000.000 = 25.944.000`.

**Crédito prendario — sistema francés (interés compuesto):**

```
cuota = gap · i / (1 − (1 + i)^(−n))
i = TNA/12 = 0,45/12 = 0,0375 (3,75% mensual)   ;   n = 48 meses
```

→ cuota ≈ **$1.173.346** · total = ×48 = **$56.320.599** · intereses = $30.376.599 = **117%** del gap.

**Esperar — plazo fijo (interés compuesto):**

```
capital_final = ahorro · (1 + TNA/12)^meses     (TNA = 19%)
```

A 1 año: 30M·(1+0,19/12)^12 ≈ **$36.223.530**. Pero el auto sube 15% → **$64.335.600**. Faltante = **$28.112.070** (creció).

**Blomhøj — los 6 subprocesos mapeados a nuestro trabajo:**

| Subproceso | En nuestro trabajo |
|---|---|
| (a) Formular el problema | ¿Qué auto le conviene a Martín y cómo pagarlo? |
| (b) Sistematizar variables | Precio, consumo, km/año, energía, patente, seguro, tasas |
| (c) Matematizar | Las 3 rectas C(K), la exponencial de la nafta y la luz, la cuota francesa |
| (d) Analizar | Resolver cruces, sensibilidad de las dos energías, comparar formas de pago |
| (e) Interpretar | "Conviene el nafta hasta ~20.200 km/año; arriba, el eléctrico" |
| (f) Validar | Comparar con datos reales 2026 + reconocer límites |

### ❓ Si te preguntan

- **"¿Diferencia entre interés simple y compuesto?"** → Simple: el interés se calcula **siempre sobre el capital inicial**. Compuesto: los intereses se **suman al capital y generan nuevos intereses** ("interés sobre interés").
- **"¿Por qué el sistema francés?"** → Es el de cuota fija; cada cuota paga el interés del saldo más una parte de capital. Al principio se paga más interés que capital.
- **"Si el plazo fijo rinde 19%, ¿por qué no conviene esperar?"** → Porque el auto sube 15% **partiendo de un valor mucho más alto** que el ahorro. En pesos, el faltante crece más rápido de lo que rinde el ahorro.
- **"¿Cómo validaron el modelo?"** → Contrastando cada dato con fuentes reales (YPF, BCRA, EPEC/ERSeP, La Voz, km77) y viendo si la conclusión se sostiene. Marcamos el nivel de confianza de cada dato y declaramos los límites.

---

# 🤝 CIERRE DE EQUIPO — Slide 11 (Conclusión)

Los tres dicen una línea cada uno (rápido, mirando al público):

> **Mateo:** "A su uso actual, 15.000 km al año, hoy le conviene el **nafta** —gana por poco—."
>
> **Enzo:** "Pero si manejara más de ~20.200 km al año, o si la nafta se dispara, conviene el **eléctrico** —y eso se sostiene aunque también suba la luz—."
>
> **Bautista:** "Y para pagarlo: contado es lo más barato, el prendario suma 117% de intereses, y esperar no alcanza."
>
> **Cierre (cualquiera):** "La idea de fondo es que **las funciones no son temas sueltos: viven dentro de una decisión real.**"

---

# 📐 Chuleta de fórmulas (todos)

| Concepto | Fórmula |
|---|---|
| Costo total (lineal) | C(K) = b + m·K |
| Ordenada (fijo) | b = precio + H·(seguro + precio·patente%) |
| Pendiente (por km) | m = (consumo/100)·precio_energía + mant/km |
| Punto de equilibrio | K* = (b_b − b_a) / (m_a − m_b) |
| Energía sube (exponencial) | p(t) = p₀·(1+r)^t — vale para nafta **y** luz |
| Precio efectivo (promedio) | p_ef = p₀·(1/H)·Σ (1+r)^t, t = 0..H−1 |
| Porcentaje | parte = base · % |
| Costo anual de tener | costoAnual = (seguro + precio·patente) + (energía/km + mant/km)·km_año |
| Breakeven temporal (años) | t* = (precio_b − precio_a) / (costoAnual_a − costoAnual_b) |
| Cuota francesa | cuota = gap·i / (1 − (1+i)^(−n)) ; i = TNA/12 |
| Interés compuesto (plazo fijo) | C_final = C·(1+r)^t |

> **Breakeven en años (lo nuevo):** el eléctrico arranca más caro pero gasta menos por año. El sobreprecio del eléctrico ($7,06M) se recupera en **t* ≈ 7,9 años** al uso de Martín — más que los 5 años del horizonte, por eso a 5 años todavía no conviene.

---

# 🛡️ Banco de preguntas difíciles (las que pueden hundirte)

1. **"¿Esto lo hicieron ustedes o lo bajaron de algún lado?"** → "Sí, lo armamos nosotros: el caso es nuestro, los datos los buscamos con fuente, y la matemática la podemos derivar a mano." *(Y demostralo: derivá K* en el pizarrón.)*
2. **"¿Qué le falta a su modelo?"** → "Lo decimos nosotros en la slide de límites: no descontamos el **valor de reventa** a los 5 años (el EV de referencia ni se vende acá, sería un supuesto de baja confianza), ni descontamos a valor presente. La suba de la luz, que antes era una falta, ahora **sí la modelamos**." *(Reconocer límites = más puntos.)*
3. **"¿Por qué eligieron esos tres autos?"** → "Misma gama (Corolla Cross nafta/híbrido + un eléctrico de referencia) para que la comparación sea justa. El eléctrico equivalente exacto no se vende acá: eso mismo es parte del hallazgo."
4. **"Si cambio un dato, ¿se cae todo?"** → "No: la app recalcula con las mismas fórmulas. Probémoslo en vivo." *(Mové un slider —nafta o luz—.)*
5. **"¿Dónde está cada tipo de función?"** → Lineal: el costo total. Exponencial: la suba de la nafta y de la luz. Interés compuesto: el crédito y el plazo fijo. Porcentajes: patente, seguro, inflación del auto.
6. **"¿Por qué la luz sube el cruce y la nafta lo baja?"** → Porque la luz es el combustible del eléctrico: si sube, encarece el km del eléctrico y necesita más km para convenir (cruce sube). La nafta es el combustible del nafta: si sube, encarece su km y el eléctrico conviene antes (cruce baja).

---

# 📋 PARTE 5 — Lista de control honesta (BIEN / MAL-FALTA / RIESGOS)

### ✅ Lo que ya está BIEN
- Caso real y bien formulado (Martín, Córdoba, variables claras).
- Usa varias familias de funciones: **lineal, exponencial, interés compuesto, porcentajes**.
- Análisis de sensibilidad de **las dos** energías (la rúbrica lo pide textual).
- Validación con datos reales + niveles de confianza + hallazgo honesto del BYD.
- Marco teórico de Blomhøj (6 subprocesos) mapeado y **visible por slide** (badge).
- App interactiva + calculadora (sirve como propuesta de enseñanza).
- Matemática verificada: cruces, cuota francesa y breakeven dan bien (`npm run verify`, 19/19).
- Slide de límites/validación + breakeven en años + **suba de luz EPEC** ya integrados.
- Tabla de pares ordenados **visible en la app** (slide "La matemática").

### ⏳ Lo que estaba MAL o FALTABA (y su estado)
- ⚡ **Suba de la luz EPEC** → ✅ **HECHO**: modelada (parámetro `subaLuzAnual`, slider y curva propia, fuente con confianza media).
- 📋 **Tabla de pares ordenados visible** → ✅ **HECHO**: en la slide "La matemática" y en este guion.
- 🔢 **Coherencia de cantidad de slides** → ✅ **HECHO**: todo dice **12** (app, README, guion).
- 🗣️ **Derivar la fórmula a mano** → ⏳ **A PRACTICAR cada uno** (riesgo en la defensa oral).
- ⚖️ **Decir las limitaciones antes de que pregunten** → ✅ slide de límites; la reventa quedó como simplificación explícita.
- 📈 **Gráfico de las 3 rectas con el cruce** → ✅ listo (slides "El gráfico" y "Sensibilidad").

### ⚠️ Riesgos para la exposición
- Que parezca que no lo hicimos nosotros → blindar con dominio de la matemática **a mano**.
- Que la matemática quede tapada por el diseño → mostrar fórmulas, tabla y derivación, no solo la app.
- Números nuevos (cruce **20.200**, breakeven **7,9 años**, luz **$220** / +32%): que los tres digan los mismos. **No leer números viejos** (19.578 / 7,5 años / $200).

---

# ✅ Checklist antes de exponer

- [ ] Cada uno puede **derivar su fórmula clave a mano**, sin la app.
- [ ] Tener una **tabla de pares ordenados** visible (está en la app y en este guion). *(La consigna lo pide.)*
- [ ] Practicar mover los **sliders en vivo** (nafta **y** luz) sin trabarse.
- [ ] Tener a mano la **slide de fuentes** por si preguntan por un dato.
- [ ] Probar la app en el **proyector y en el celu (QR)** antes de empezar.
- [ ] Decir las **limitaciones** nosotros, antes de que las pregunten.
- [ ] Ensayar el **cierre coral** (las tres líneas + frase final).
- [ ] Repasar la diferencia **interés simple vs compuesto** (cae seguro).
- [ ] Todos memorizan los **números finales**: cruce 20.200 km/año · ventaja nafta $178.350 · breakeven 7,9 años · luz $220 (+32%/año).

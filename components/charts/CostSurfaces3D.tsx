"use client";

/**
 * CostSurfaces3D — el mapa de decisión, pero en 3D.
 *
 * Eje X  = km/año (cuánto maneja Martín)
 * Eje Z  = suba anual de la nafta (la capa exponencial)
 * Eje Y  = costo total al horizonte ($)  → ALTURA
 *
 * Cada auto es una superficie z = C(km, suba). El eléctrico es un plano
 * (no depende de la nafta); nafta e híbrido se curvan hacia arriba con la
 * inflación. La superficie que queda MÁS ABAJO en un punto es el auto que
 * conviene ahí: el heatmap 2D (DecisionMap) es exactamente esto visto desde
 * arriba. Las intersecciones entre superficies son las curvas de equilibrio.
 *
 * Todo deriva de lib/model.ts (misma fuente de verdad que el resto de la app).
 */

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { AUTO_KEYS, calcularAuto, type AutoKey, type Params } from "@/lib/model";

// --- Rangos del barrido y escala de la escena ---------------------------------
const KM_MAX = 40_000; // km/año máximo del eje X
const R_MAX = 1; // 100% de suba anual de la nafta (eje Z)
const SEG = 36; // resolución del grid (SEG+1 vértices por lado)
const SIZE = 4.2; // lado de la base en unidades de escena
const HEIGHT = 3; // altura máxima (costo) en unidades de escena

/** Fallbacks sRGB aproximados de los tokens OKLCH (solo si el canvas falla). */
const FALLBACK: Record<AutoKey | "ink" | "accent", string> = {
  nafta: "#c8553d",
  hibrido: "#cf9344",
  electrico: "#34a27c",
  ink: "#39342d",
  accent: "#4d6fc7",
};

/**
 * Resuelve una CSS var de color (oklch en este proyecto) a un `rgb()` que THREE
 * entiende. Pinta un pixel con ese color y lo lee de vuelta: el navegador hace
 * la conversión oklch → sRGB, así el 3D queda con el MISMO color que la app.
 *
 * Nota: NO sirve leer `ctx.fillStyle` directo — Chrome lo normaliza a `lab()`,
 * que THREE.Color rechaza ("Unknown color model"). getImageData siempre da RGB.
 */
function resolveColor(cssVar: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  if (!raw) return fallback;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return fallback;
  try {
    ctx.fillStyle = raw; // acepta oklch()/cualquier color CSS soportado
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return fallback;
  }
}

interface Escala {
  costoMin: number;
  costoSpan: number;
}

/** Costo total de un auto a (km/año, suba) dados, con el resto de params fijo. */
function costoEn(params: Params, key: AutoKey, kmAnio: number, suba: number): number {
  return calcularAuto({ ...params, kmAnio, subaNaftaAnual: suba }, key).costoTotal;
}

/** Min/Max de costo sobre las 3 superficies (las funciones son monótonas: basta evaluar esquinas). */
function calcularEscala(params: Params): Escala {
  let lo = Infinity;
  let hi = -Infinity;
  for (const key of AUTO_KEYS) {
    for (const km of [0, KM_MAX]) {
      for (const r of [0, R_MAX]) {
        const c = costoEn(params, key, km, r);
        if (c < lo) lo = c;
        if (c > hi) hi = c;
      }
    }
  }
  return { costoMin: lo, costoSpan: hi - lo || 1 };
}

/** Construye la geometría de una superficie z = C(km, suba) normalizada a la escena. */
function buildSurface(params: Params, key: AutoKey, escala: Escala): THREE.BufferGeometry {
  const cols = SEG + 1;
  const positions = new Float32Array(cols * cols * 3);
  for (let j = 0; j < cols; j++) {
    const suba = (j / SEG) * R_MAX;
    for (let i = 0; i < cols; i++) {
      const kmA = (i / SEG) * KM_MAX;
      const costo = costoEn(params, key, kmA, suba);
      const o = (j * cols + i) * 3;
      positions[o] = (i / SEG - 0.5) * SIZE; // X
      positions[o + 1] = ((costo - escala.costoMin) / escala.costoSpan) * HEIGHT; // Y (altura)
      positions[o + 2] = (j / SEG - 0.5) * SIZE; // Z
    }
  }
  const index: number[] = [];
  for (let j = 0; j < SEG; j++) {
    for (let i = 0; i < SEG; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = (j + 1) * cols + i;
      const d = c + 1;
      index.push(a, c, b, b, c, d);
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geom.setIndex(index);
  geom.computeVertexNormals();
  return geom;
}

/** Posición 3D de un punto (km, suba, costo) en el espacio de la escena. */
function puntoEscena(km: number, suba: number, costo: number, escala: Escala): [number, number, number] {
  const kmN = Math.min(km, KM_MAX) / KM_MAX;
  const subaN = Math.min(suba, R_MAX) / R_MAX;
  return [
    (kmN - 0.5) * SIZE,
    ((costo - escala.costoMin) / escala.costoSpan) * HEIGHT,
    (subaN - 0.5) * SIZE,
  ];
}

interface Colores {
  nafta: string;
  hibrido: string;
  electrico: string;
  ink: string;
  accent: string;
}

function Superficies({ params, escala, colores }: { params: Params; escala: Escala; colores: Colores }) {
  const geoms = useMemo(
    () => AUTO_KEYS.map((key) => ({ key, geom: buildSurface(params, key, escala) })),
    [params, escala],
  );
  // Liberar geometrías viejas al recalcular.
  useEffect(() => () => geoms.forEach(({ geom }) => geom.dispose()), [geoms]);

  return (
    <>
      {geoms.map(({ key, geom }) => (
        <group key={key}>
          <mesh geometry={geom}>
            <meshStandardMaterial
              color={colores[key]}
              transparent
              opacity={0.62}
              side={THREE.DoubleSide}
              roughness={0.55}
              metalness={0.05}
            />
          </mesh>
          {/* malla sutil encima para leer la curvatura */}
          <lineSegments>
            <wireframeGeometry args={[geom]} />
            <lineBasicMaterial color={colores[key]} transparent opacity={0.18} />
          </lineSegments>
        </group>
      ))}
    </>
  );
}

/** Esfera en el punto donde está hoy Martín, sobre cada superficie; la ganadora resaltada. */
function MarcadorMartin({ params, escala, colores }: { params: Params; escala: Escala; colores: Colores }) {
  const ganadora = useMemo(() => {
    let best: AutoKey = "nafta";
    let bestCosto = Infinity;
    for (const key of AUTO_KEYS) {
      const c = costoEn(params, key, params.kmAnio, params.subaNaftaAnual);
      if (c < bestCosto) {
        bestCosto = c;
        best = key;
      }
    }
    return best;
  }, [params]);

  const tallo = useMemo(() => {
    const costo = costoEn(params, ganadora, params.kmAnio, params.subaNaftaAnual);
    const [x, y, z] = puntoEscena(params.kmAnio, params.subaNaftaAnual, costo, escala);
    const g = new THREE.BufferGeometry();
    g.setFromPoints([new THREE.Vector3(x, 0, z), new THREE.Vector3(x, y, z)]);
    return g;
  }, [params, ganadora, escala]);

  useEffect(() => () => tallo.dispose(), [tallo]);

  return (
    <>
      {AUTO_KEYS.map((key) => {
        const costo = costoEn(params, key, params.kmAnio, params.subaNaftaAnual);
        const [x, y, z] = puntoEscena(params.kmAnio, params.subaNaftaAnual, costo, escala);
        const esGanadora = key === ganadora;
        return (
          <mesh key={key} position={[x, y, z]}>
            <sphereGeometry args={[esGanadora ? 0.1 : 0.055, 24, 24]} />
            <meshStandardMaterial
              color={colores[key]}
              emissive={colores[key]}
              emissiveIntensity={esGanadora ? 0.6 : 0.2}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      <lineSegments geometry={tallo}>
        <lineBasicMaterial color={colores.accent} transparent opacity={0.7} />
      </lineSegments>
    </>
  );
}

/** Piso-guía y etiquetas de los ejes. */
function Ejes({ ink }: { ink: string }) {
  const half = SIZE / 2;
  return (
    <group>
      <gridHelper args={[SIZE, 8, ink, ink]} position={[0, 0, 0]} />
      <Text position={[0, -0.45, half + 0.35]} fontSize={0.26} color={ink} anchorX="center" anchorY="middle">
        km / año →
      </Text>
      <Text
        position={[-half - 0.35, -0.45, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.26}
        color={ink}
        anchorX="center"
        anchorY="middle"
      >
        suba de la nafta →
      </Text>
      <Text
        position={[-half - 0.45, HEIGHT / 2, -half]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.26}
        color={ink}
        anchorX="center"
        anchorY="middle"
      >
        costo total ↑
      </Text>
    </group>
  );
}

function Escena({ params, colores }: { params: Params; colores: Colores }) {
  const escala = useMemo(() => calcularEscala(params), [params]);
  const grupo = useRef<THREE.Group>(null);
  const [interactuado, setInteractuado] = useState(false);

  // rotación de presentación lenta hasta que el usuario toca la escena
  useFrame((_, delta) => {
    if (!interactuado && grupo.current) grupo.current.rotation.y += delta * 0.18;
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 4]} intensity={1.1} />
      <directionalLight position={[-4, 3, -5]} intensity={0.4} />
      <group ref={grupo}>
        <Superficies params={params} escala={escala} colores={colores} />
        <MarcadorMartin params={params} escala={escala} colores={colores} />
        <Ejes ink={colores.ink} />
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.05}
        onStart={() => setInteractuado(true)}
      />
    </>
  );
}

export function CostSurfaces3D({ params }: { params: Params }) {
  const [colores, setColores] = useState<Colores | null>(null);

  // Resolver los colores OKLCH → hex recién en el cliente, ya montado.
  useEffect(() => {
    setColores({
      nafta: resolveColor("--car-nafta", FALLBACK.nafta),
      hibrido: resolveColor("--car-hibrido", FALLBACK.hibrido),
      electrico: resolveColor("--car-electrico", FALLBACK.electrico),
      ink: resolveColor("--ink", FALLBACK.ink),
      accent: resolveColor("--accent", FALLBACK.accent),
    });
  }, []);

  if (!colores) {
    return <div className="grid h-full w-full place-items-center text-sm text-faint">Preparando el espacio 3D…</div>;
  }

  return (
    <Canvas camera={{ position: [6.5, 5, 7], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <Escena params={params} colores={colores} />
    </Canvas>
  );
}

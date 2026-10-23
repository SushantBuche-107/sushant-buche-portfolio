import { Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { usePageVisible } from "@/hooks/usePageVisible";

/* -------------------------------------------------------------------------- */
/*  Palette (matches SceneFallback + the HeroVisual chips)                     */
/*  cyan = API contracts, indigo = event flow, emerald = data layer            */
/* -------------------------------------------------------------------------- */
const INDIGO = "#6366F1";
const INDIGO_LIGHT = "#818CF8";
const CYAN = "#06B6D4";
const CYAN_LIGHT = "#67E8F9";
const EMERALD = "#34D399";

type EnergyRef = { current: number };

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

// Deterministic RNG so the scene looks identical on every load.
function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Graph {
  nodes: THREE.Vector3[];
  curves: THREE.QuadraticBezierCurve3[];
  spokeCount: number;
}

/** A service mesh: every node is wired to the core, and to its two nearest peers. */
function buildGraph(nodeCount: number): Graph {
  const rng = createRng(7);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const up = new THREE.Vector3(0, 1, 0);

  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < nodeCount; i += 1) {
    const y = 1 - ((i + 0.5) / nodeCount) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = i * golden;
    const radius = 2.35 + rng() * 0.75;
    nodes.push(
      new THREE.Vector3(Math.cos(theta) * ring, y * 0.78, Math.sin(theta) * ring).multiplyScalar(radius),
    );
  }

  const curves: THREE.QuadraticBezierCurve3[] = [];

  // Spokes: core -> node
  for (const node of nodes) {
    const dir = node.clone().normalize();
    const start = dir.clone().multiplyScalar(1.55);
    const bend = new THREE.Vector3()
      .crossVectors(dir, up)
      .normalize()
      .multiplyScalar(0.32 * (rng() > 0.5 ? 1 : -1));
    const control = start.clone().add(node).multiplyScalar(0.5).add(bend);
    curves.push(new THREE.QuadraticBezierCurve3(start, control, node.clone()));
  }
  const spokeCount = curves.length;

  // Peers: node <-> its two nearest neighbours, arched outward
  const seen = new Set<string>();
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        const b = nodes[j];
        const control = a.clone().add(b).multiplyScalar(0.5 * 1.22);
        curves.push(new THREE.QuadraticBezierCurve3(a.clone(), control, b.clone()));
      });
  });

  return { nodes, curves, spokeCount };
}

const CURVE_SEGMENTS = 22;

function buildLineData(graph: Graph): { positions: Float32Array; colors: Float32Array } {
  const total = graph.curves.length * CURVE_SEGMENTS;
  const positions = new Float32Array(total * 6);
  const colors = new Float32Array(total * 6);
  const spokeStart = new THREE.Color(CYAN);
  const spokeEnd = new THREE.Color(INDIGO);
  const peer = new THREE.Color(INDIGO_LIGHT).multiplyScalar(0.7);
  const tmp = new THREE.Color();
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();

  graph.curves.forEach((curve, ci) => {
    const isSpoke = ci < graph.spokeCount;
    for (let s = 0; s < CURVE_SEGMENTS; s += 1) {
      const t0 = s / CURVE_SEGMENTS;
      const t1 = (s + 1) / CURVE_SEGMENTS;
      curve.getPoint(t0, p0);
      curve.getPoint(t1, p1);
      const o = (ci * CURVE_SEGMENTS + s) * 6;
      positions[o] = p0.x;
      positions[o + 1] = p0.y;
      positions[o + 2] = p0.z;
      positions[o + 3] = p1.x;
      positions[o + 4] = p1.y;
      positions[o + 5] = p1.z;

      for (let end = 0; end < 2; end += 1) {
        const t = end === 0 ? t0 : t1;
        if (isSpoke) tmp.copy(spokeStart).lerp(spokeEnd, t);
        else tmp.copy(peer);
        colors[o + end * 3] = tmp.r;
        colors[o + end * 3 + 1] = tmp.g;
        colors[o + end * 3 + 2] = tmp.b;
      }
    }
  });

  return { positions, colors };
}

/* -------------------------------------------------------------------------- */
/*  Glow points: one soft, additive sprite shader reused for nodes, pulses,    */
/*  and dust. Sizes are in world units so they scale with perspective.         */
/* -------------------------------------------------------------------------- */

const GLOW_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScale;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float twinkle = 0.7 + 0.3 * sin(uTime * 1.6 + aPhase * 6.2831);
    gl_PointSize = max(aSize * uScale * twinkle / -mv.z, 0.0);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vTwinkle = twinkle;
  }
`;

const GLOW_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = pow(1.0 - d * 2.0, 2.4);
    float core = smoothstep(0.14, 0.0, d);
    vec3 col = mix(vColor, vec3(1.0), core * 0.8);
    gl_FragColor = vec4(col, (glow * 0.9 + core) * uOpacity * vTwinkle);
    #include <colorspace_fragment>
  }
`;

interface GlowPointsProps {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
  opacity?: number;
  dynamic?: boolean;
  positionRef?: React.RefObject<THREE.BufferAttribute | null>;
  sizeRef?: React.RefObject<THREE.BufferAttribute | null>;
}

function GlowPoints({
  positions,
  colors,
  sizes,
  phases,
  opacity = 0.9,
  dynamic = false,
  positionRef,
  sizeRef,
}: GlowPointsProps): React.ReactElement {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScale: { value: 1000 }, uOpacity: { value: opacity } }),
    [opacity],
  );

  useFrame((state) => {
    const m = material.current;
    if (!m) return;
    const camera = state.camera as THREE.PerspectiveCamera;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uScale.value =
      (state.size.height * state.viewport.dpr) /
      (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  });

  const usage = dynamic ? THREE.DynamicDrawUsage : THREE.StaticDrawUsage;

  return (
    <points frustumCulled={!dynamic}>
      <bufferGeometry>
        <bufferAttribute ref={positionRef} attach="attributes-position" args={[positions, 3]} usage={usage} />
        <bufferAttribute ref={sizeRef} attach="attributes-aSize" args={[sizes, 1]} usage={usage} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={GLOW_VERTEX}
        fragmentShader={GLOW_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*  Network: edges, nodes, and the data packets that travel along them         */
/* -------------------------------------------------------------------------- */

const PULSE_SIZE = 0.17;

function Pulses({
  graph,
  count,
  energy,
}: {
  graph: Graph;
  count: number;
  energy: EnergyRef;
}): React.ReactElement {
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const sizeRef = useRef<THREE.BufferAttribute>(null);
  const point = useMemo(() => new THREE.Vector3(), []);

  const sim = useMemo(() => {
    const rng = createRng(21);
    const palette = [CYAN_LIGHT, INDIGO_LIGHT, EMERALD, CYAN_LIGHT].map((c) => new THREE.Color(c));
    const edge = new Uint16Array(count);
    const progress = new Float32Array(count);
    const speed = new Float32Array(count);
    const direction = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      edge[i] = Math.floor(rng() * graph.curves.length);
      progress[i] = rng();
      speed[i] = 0.16 + rng() * 0.22;
      direction[i] = rng() > 0.4 ? 1 : -1;
      phases[i] = rng();
      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return {
      edge,
      progress,
      speed,
      direction,
      colors,
      phases,
      positions: new Float32Array(count * 3),
      sizes: new Float32Array(count),
    };
  }, [graph, count]);

  /* eslint-disable react-hooks/immutability -- The pulse buffers are mutable render-loop state. */
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05) * energy.current;
    const { edge, progress, speed, direction, positions, sizes } = sim;
    const surge = Math.min(1.6, 0.9 + (energy.current - 1) * 0.25);

    for (let i = 0; i < count; i += 1) {
      let p = progress[i] + step * speed[i] * direction[i];
      if (p > 1 || p < 0) {
        edge[i] = Math.floor(Math.random() * graph.curves.length);
        p = direction[i] > 0 ? 0 : 1;
      }
      progress[i] = p;
      graph.curves[edge[i]].getPoint(p, point);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
      sizes[i] = PULSE_SIZE * Math.sin(Math.PI * p) * surge;
    }

    if (positionRef.current) positionRef.current.needsUpdate = true;
    if (sizeRef.current) sizeRef.current.needsUpdate = true;
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <GlowPoints
      dynamic
      positions={sim.positions}
      sizes={sim.sizes}
      colors={sim.colors}
      phases={sim.phases}
      positionRef={positionRef}
      sizeRef={sizeRef}
      opacity={1}
    />
  );
}

function Network({
  isMobile,
  energy,
}: {
  isMobile: boolean;
  energy: EnergyRef;
}): React.ReactElement {
  const group = useRef<THREE.Group>(null);
  const graph = useMemo(() => buildGraph(isMobile ? 10 : 18), [isMobile]);
  const lines = useMemo(() => buildLineData(graph), [graph]);

  const nodeData = useMemo(() => {
    const rng = createRng(11);
    const palette = [CYAN_LIGHT, INDIGO_LIGHT, CYAN_LIGHT, INDIGO_LIGHT, EMERALD].map(
      (c) => new THREE.Color(c),
    );
    const count = graph.nodes.length;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    graph.nodes.forEach((node, i) => {
      const c = palette[i % palette.length];
      positions[i * 3] = node.x;
      positions[i * 3 + 1] = node.y;
      positions[i * 3 + 2] = node.z;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.18 + rng() * 0.09;
      phases[i] = rng();
    });
    return { positions, colors, sizes, phases };
  }, [graph]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const step = Math.min(delta, 0.05);
    g.rotation.y += step * 0.07 * energy.current;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.07;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lines.colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={isMobile ? 0.42 : 0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <GlowPoints {...nodeData} opacity={isMobile ? 0.9 : 0.95} />
      <Pulses graph={graph} count={isMobile ? 16 : 38} energy={energy} />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Core: faceted crystal + fresnel shell with a scanner line                  */
/* -------------------------------------------------------------------------- */

const SHELL_VERTEX = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying vec3 vPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;

const SHELL_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying vec3 vPos;
  void main() {
    float fres = pow(1.0 - max(dot(normalize(vNormalV), normalize(vViewDir)), 0.0), 2.6);
    float band = 0.5 + 0.5 * sin(vPos.y * 3.0 + uTime * 0.8);
    float scanY = sin(uTime * 0.6) * 1.2;
    float scan = smoothstep(0.045, 0.0, abs(vPos.y - scanY));
    float alpha = fres * (0.75 + 0.25 * sin(uTime * 1.2)) + scan * 0.3;
    gl_FragColor = vec4(mix(uColorA, uColorB, band), alpha);
    #include <colorspace_fragment>
  }
`;

function Core({ energy }: { energy: EnergyRef }): React.ReactElement {
  const coreMaterial = useRef<THREE.MeshPhysicalMaterial>(null);
  const shellMaterial = useRef<THREE.ShaderMaterial>(null);
  const heart = useRef<THREE.Mesh>(null);
  const lattice = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  const shellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(CYAN) },
      uColorB: { value: new THREE.Color(INDIGO_LIGHT) },
    }),
    [],
  );

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const surge = Math.max(0, energy.current - 1);

    if (group.current) group.current.rotation.y += step * 0.18;
    if (lattice.current) {
      lattice.current.rotation.y -= step * 0.1;
      lattice.current.rotation.x += step * 0.04;
    }
    if (heart.current) heart.current.scale.setScalar(0.74 + Math.sin(t * 1.8) * 0.025 + surge * 0.05);
    if (shellMaterial.current) shellMaterial.current.uniforms.uTime.value = t;
    if (coreMaterial.current) coreMaterial.current.emissiveIntensity = 0.38 + surge * 0.35;
  });

  return (
    <group ref={group}>
      <Float speed={1.15} rotationIntensity={0.22} floatIntensity={0.38}>
        <mesh>
          <icosahedronGeometry args={[1.42, 1]} />
          <meshPhysicalMaterial
            ref={coreMaterial}
            color="#0F172A"
            emissive="#312E81"
            emissiveIntensity={0.38}
            metalness={0.7}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.2}
            flatShading
            transparent
            opacity={0.94}
          />
        </mesh>
        <mesh scale={1.014}>
          <icosahedronGeometry args={[1.42, 1]} />
          <meshBasicMaterial color={INDIGO_LIGHT} wireframe transparent opacity={0.2} />
        </mesh>
        <mesh ref={heart} scale={0.74}>
          <icosahedronGeometry args={[1.42, 1]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.07} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.5, 48, 48]} />
          <shaderMaterial
            ref={shellMaterial}
            vertexShader={SHELL_VERTEX}
            fragmentShader={SHELL_FRAGMENT}
            uniforms={shellUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={lattice}>
          <icosahedronGeometry args={[1.95, 1]} />
          <meshBasicMaterial color={INDIGO} wireframe transparent opacity={0.11} depthWrite={false} />
        </mesh>
      </Float>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Orbits: rings with satellites, and a ring of bits                          */
/* -------------------------------------------------------------------------- */

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  satellite,
  opacity,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  satellite: string;
  opacity: number;
}): React.ReactElement {
  const spin = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.z += Math.min(delta, 0.05) * speed;
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.006, 8, 180]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <group ref={spin}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={satellite} />
        </mesh>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial
            color={satellite}
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

function Orbits(): React.ReactElement {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += Math.min(delta, 0.05) * 0.06;
  });

  return (
    <group ref={group}>
      <OrbitRing radius={2.5} tilt={[Math.PI / 2.15, 0.2, 0.1]} speed={0.42} color={INDIGO} satellite={CYAN_LIGHT} opacity={0.38} />
      <OrbitRing radius={2.2} tilt={[Math.PI / 1.7, 0.9, 0.2]} speed={-0.55} color={CYAN} satellite={INDIGO_LIGHT} opacity={0.26} />
      <OrbitRing radius={1.95} tilt={[Math.PI / 2.6, -0.5, 1.1]} speed={0.7} color={INDIGO_LIGHT} satellite={EMERALD} opacity={0.2} />
    </group>
  );
}

/** A ring of tiny bars, like a memory dump or a barcode, slowly turning. */
function BitRing({ count }: { count: number }): React.ReactElement {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const rng = createRng(33);
    const dummy = new THREE.Object3D();
    const on = new THREE.Color(CYAN_LIGHT);
    const off = new THREE.Color(INDIGO);

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const bit = rng() > 0.55;
      const height = bit ? 0.16 + rng() * 0.2 : 0.05 + rng() * 0.05;
      dummy.position.set(Math.cos(angle) * 3.05, 0, Math.sin(angle) * 3.05);
      dummy.rotation.set(0, -angle, 0);
      dummy.scale.set(1, height, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, bit ? on : off);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y -= Math.min(delta, 0.05) * 0.09;
  });

  return (
    <group rotation={[0.42, 0, 0.12]}>
      <group ref={group}>
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
          <boxGeometry args={[0.05, 1, 0.03]} />
          <meshBasicMaterial transparent opacity={0.85} />
        </instancedMesh>
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ambient: dust, pointer light, click shockwave, camera parallax             */
/* -------------------------------------------------------------------------- */

function Dust({ count }: { count: number }): React.ReactElement {
  const group = useRef<THREE.Group>(null);

  const data = useMemo(() => {
    const rng = createRng(5);
    const palette = [CYAN_LIGHT, INDIGO_LIGHT, "#E0E7FF"].map((c) => new THREE.Color(c));
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const radius = 3.4 + rng() * 3.4;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.8;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.03 + rng() * 0.05;
      phases[i] = rng();
    }
    return { positions, colors, sizes, phases };
  }, [count]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += Math.min(delta, 0.05) * 0.02;
  });

  return (
    <group ref={group}>
      <GlowPoints {...data} opacity={0.6} />
    </group>
  );
}

/** A cyan light that follows the pointer, so the crystal's facets catch it. */
function PointerLight(): React.ReactElement {
  const light = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const l = light.current;
    if (!l) return;
    const k = Math.min(1, delta * 4);
    l.position.x += (state.pointer.x * 4.5 - l.position.x) * k;
    l.position.y += (state.pointer.y * 3.5 - l.position.y) * k;
  });

  return <pointLight ref={light} position={[0, 0, 3.6]} intensity={14} distance={11} color={CYAN_LIGHT} />;
}

/** Click or tap the scene: a ripple leaves the core and the whole mesh surges. */
function Shockwave({ energy }: { energy: EnergyRef }): React.ReactElement {
  const gl = useThree((s) => s.gl);
  const clock = useThree((s) => s.clock);
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const startedAt = useRef(-10);

  useEffect(() => {
    const element = gl.domElement;
    const onDown = (): void => {
      startedAt.current = clock.elapsedTime;
      energy.current = 3.4;
    };
    element.addEventListener("pointerdown", onDown);
    return () => element.removeEventListener("pointerdown", onDown);
  }, [gl, clock, energy]);

  useFrame(() => {
    const m = mesh.current;
    const mat = material.current;
    if (!m || !mat) return;
    const age = clock.elapsedTime - startedAt.current;
    if (age > 1.8) {
      m.visible = false;
      return;
    }
    const p = age / 1.8;
    m.visible = true;
    m.scale.setScalar(1.6 + (1 - Math.pow(1 - p, 3)) * 2.6);
    mat.opacity = (1 - p) * 0.55;
  });

  return (
    <mesh ref={mesh} visible={false}>
      <ringGeometry args={[0.97, 1, 96]} />
      <meshBasicMaterial
        ref={material}
        color={CYAN_LIGHT}
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function CameraRig({ children }: { children: React.ReactNode }): React.ReactElement {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const step = Math.min(delta, 0.05);
    const targetY = state.pointer.x * 0.16;
    const targetX = -state.pointer.y * 0.1;

    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, step * 2.4);
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, step * 2.4);
  });

  return <group ref={group}>{children}</group>;
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                      */
/* -------------------------------------------------------------------------- */

function System({ isMobile }: { isMobile: boolean }): React.ReactElement {
  // 1 = calm. Spikes on click, then eases back. Drives pulses, spin, and core glow.
  const energy = useRef(1);

  useFrame((_, delta) => {
    energy.current += (1 - energy.current) * Math.min(1, Math.min(delta, 0.05) * 1.6);
  });

  return (
    <>
      <ambientLight intensity={isMobile ? 0.48 : 0.55} />
      <directionalLight position={[4, 5, 6]} intensity={isMobile ? 1.0 : 1.2} color="#E0E7FF" />
      <pointLight position={[4, 2, 3]} intensity={isMobile ? 12 : 16} distance={14} color={CYAN} />
      <pointLight position={[-5, -2, 2]} intensity={isMobile ? 9 : 12} distance={14} color={INDIGO} />
      <PointerLight />

      <CameraRig>
        <Dust count={isMobile ? 80 : 220} />
        <Orbits />
        <BitRing count={isMobile ? 28 : 64} />
        <Network isMobile={isMobile} energy={energy} />
        <Core energy={energy} />
      </CameraRig>

      <Shockwave energy={energy} />
    </>
  );
}

export default function HeroScene({
  isMobile = false,
  active = true,
}: {
  isMobile?: boolean;
  active?: boolean;
}): React.ReactElement {
  const pageVisible = usePageVisible();
  const shouldRender = pageVisible && active;

  return (
    <Canvas
      className="h-full w-full"
      frameloop={shouldRender ? "always" : "never"}
      dpr={[1, isMobile ? 1.0 : 1.5]}
      camera={{ position: [0, 0.16, isMobile ? 9.6 : 9], fov: isMobile ? 42 : 40, near: 0.1, far: 40 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      }}
      shadows={false}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0x000000), 0);
      }}
    >
      <System isMobile={isMobile} />
    </Canvas>
  );
}

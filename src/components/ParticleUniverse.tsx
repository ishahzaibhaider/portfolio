"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";
import { INTRO } from "../lib/introTiming";

const COUNT = 9000;
const RINGS = 6;
const SPHERE_R = 2.1;
const EMBER = new THREE.Color("#ff5a1f");
const BONE = new THREE.Color("#e9e6df");

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
const easeInOutQuart = (x: number) =>
  x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

interface Formation {
  spawn: Float32Array; // rings enter from here
  ring: Float32Array; // galaxy-ring loading formation
  scatter: Float32Array; // dispersed explosion cloud
  sphere: Float32Array; // collided sphere
  ambient: Float32Array; // final resting field (fills viewport)
  driftF: Float32Array; // drift frequency per axis
  driftP: Float32Array; // drift phase per axis
  amp: Float32Array; // drift amplitude per particle
  ringDelay: Float32Array; // wave stagger per particle
  colors: Float32Array;
  sprite: THREE.Texture;
}

function buildFormation(): Formation {
  const rand = mulberry32(161);
  const spawn = new Float32Array(COUNT * 3);
  const ring = new Float32Array(COUNT * 3);
  const scatter = new Float32Array(COUNT * 3);
  const sphere = new Float32Array(COUNT * 3);
  const ambient = new Float32Array(COUNT * 3);
  const driftF = new Float32Array(COUNT * 3);
  const driftP = new Float32Array(COUNT * 3);
  const amp = new Float32Array(COUNT);
  const ringDelay = new Float32Array(COUNT);
  const colors = new Float32Array(COUNT * 3);

  // Galaxy-disc tilt applied to the ring plane
  const tiltX = 1.12;
  const cx = Math.cos(tiltX);
  const sx = Math.sin(tiltX);
  const tiltZ = 0.32;
  const cz = Math.cos(tiltZ);
  const sz = Math.sin(tiltZ);

  const GOLDEN = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    const o = i * 3;

    // Sphere: Fibonacci distribution for even coverage
    const sy = 1 - (i / (COUNT - 1)) * 2;
    const sr = Math.sqrt(1 - sy * sy);
    const sth = GOLDEN * i;
    const jit = 1 + (rand() - 0.5) * 0.06;
    sphere[o] = Math.cos(sth) * sr * SPHERE_R * jit;
    sphere[o + 1] = sy * SPHERE_R * jit;
    sphere[o + 2] = Math.sin(sth) * sr * SPHERE_R * jit;

    // Ring: assign to a ring, place around it, tilt into a galaxy disc
    const k = i % RINGS;
    ringDelay[i] = k * 0.14;
    const rr = 0.85 + k * 0.46 + (rand() - 0.5) * 0.06;
    const a = rand() * Math.PI * 2;
    let rx = Math.cos(a) * rr;
    let ry = Math.sin(a) * rr;
    let rz = (rand() - 0.5) * 0.06;
    // rotate around Z then X for the tilted disc look
    let tx = rx * cz - ry * sz;
    let ty = rx * sz + ry * cz;
    rx = tx;
    ry = ty;
    ty = ry * cx - rz * sx;
    const tz = ry * sx + rz * cx;
    ring[o] = rx;
    ring[o + 1] = ty;
    ring[o + 2] = tz;

    // Spawn: rings fly in from a larger scaled copy of themselves
    spawn[o] = rx * 2.4 + (rand() - 0.5) * 0.3;
    spawn[o + 1] = ty * 2.4 + (rand() - 0.5) * 0.3;
    spawn[o + 2] = tz * 2.4 + (rand() - 0.5) * 0.3;

    // Scatter: explosion shell in a random direction
    const dz = rand() * 2 - 1;
    const dth = rand() * Math.PI * 2;
    const dr = Math.sqrt(1 - dz * dz);
    const dist = 4.2 + rand() * 1.9;
    scatter[o] = Math.cos(dth) * dr * dist;
    scatter[o + 1] = dz * dist * 0.72;
    scatter[o + 2] = Math.sin(dth) * dr * dist;

    // Ambient: wide flattened field that fills the whole viewport frame
    ambient[o] = (rand() - 0.5) * 14;
    ambient[o + 1] = (rand() - 0.5) * 9;
    ambient[o + 2] = (rand() - 0.5) * 4;

    // Per-particle drift
    driftF[o] = 0.18 + rand() * 0.4;
    driftF[o + 1] = 0.18 + rand() * 0.4;
    driftF[o + 2] = 0.14 + rand() * 0.35;
    driftP[o] = rand() * Math.PI * 2;
    driftP[o + 1] = rand() * Math.PI * 2;
    driftP[o + 2] = rand() * Math.PI * 2;
    amp[i] = 0.06 + rand() * 0.12;

    // Colour: mostly bone, a scatter of ember
    const isEmber = rand() < 0.16;
    const c = isEmber ? EMBER : BONE;
    const dim = isEmber ? 0.95 : 0.28 + rand() * 0.5;
    colors[o] = c.r * dim;
    colors[o + 1] = c.g * dim;
    colors[o + 2] = c.b * dim;
  }

  return { spawn, ring, scatter, sphere, ambient, driftF, driftP, amp, ringDelay, colors, sprite: makeSprite() };
}

function Field({ reduce }: { reduce: boolean }) {
  const geom = useRef<THREE.BufferGeometry>(null);
  const points = useRef<THREE.Points>(null);
  const t0 = useRef<number | null>(null);
  const spin = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const f = useMemo(buildFormation, []);

  // Start positions: rings' spawn (or ambient when reduced motion)
  const initial = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    arr.set(reduce ? f.ambient : f.spawn);
    return arr;
  }, [f, reduce]);

  useFrame((state, delta) => {
    const g = geom.current;
    const p = points.current;
    if (!g || !p) return;
    const pos = g.attributes.position.array as Float32Array;
    const mat = p.material as THREE.PointsMaterial;

    if (reduce) {
      // Static, gentle: no cinematic. Fill with ambient once.
      if (t0.current === null) {
        pos.set(f.ambient);
        g.attributes.position.needsUpdate = true;
        mat.opacity = 0.72;
        t0.current = 0;
      }
      return;
    }

    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - t0.current;

    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.04;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.04;

    for (let i = 0; i < COUNT; i++) {
      const o = i * 3;
      let x: number, y: number, z: number;

      if (t < INTRO.revealAt) {
        // Rings arrive in staggered waves
        const local = clamp01((t - f.ringDelay[i]) / 1.15);
        const e = easeOutCubic(local);
        x = f.spawn[o] + (f.ring[o] - f.spawn[o]) * e;
        y = f.spawn[o + 1] + (f.ring[o + 1] - f.spawn[o + 1]) * e;
        z = f.spawn[o + 2] + (f.ring[o + 2] - f.spawn[o + 2]) * e;
      } else if (t < INTRO.disperse) {
        // Rings burst apart into a scatter cloud
        const e = easeOutQuart(clamp01((t - INTRO.revealAt) / (INTRO.disperse - INTRO.revealAt)));
        x = f.ring[o] + (f.scatter[o] - f.ring[o]) * e;
        y = f.ring[o + 1] + (f.scatter[o + 1] - f.ring[o + 1]) * e;
        z = f.ring[o + 2] + (f.scatter[o + 2] - f.ring[o + 2]) * e;
      } else if (t < INTRO.sphere) {
        // Rapid collision inward into a sphere
        const e = easeInOutQuart(clamp01((t - INTRO.disperse) / (INTRO.sphere - INTRO.disperse)));
        x = f.scatter[o] + (f.sphere[o] - f.scatter[o]) * e;
        y = f.scatter[o + 1] + (f.sphere[o + 1] - f.scatter[o + 1]) * e;
        z = f.scatter[o + 2] + (f.sphere[o + 2] - f.scatter[o + 2]) * e;
      } else {
        // Sphere falls apart into the ambient field, then drifts
        const e = easeOutCubic(clamp01((t - INTRO.sphere) / (INTRO.fall - INTRO.sphere)));
        const dx = Math.sin(t * f.driftF[o] + f.driftP[o]) * f.amp[i];
        const dy = Math.cos(t * f.driftF[o + 1] + f.driftP[o + 1]) * f.amp[i];
        const dz = Math.sin(t * f.driftF[o + 2] + f.driftP[o + 2]) * f.amp[i];
        const ax = f.ambient[o] + dx * e;
        const ay = f.ambient[o + 1] + dy * e;
        const az = f.ambient[o + 2] + dz * e;
        x = f.sphere[o] + (ax - f.sphere[o]) * e;
        y = f.sphere[o + 1] + (ay - f.sphere[o + 1]) * e;
        z = f.sphere[o + 2] + (az - f.sphere[o + 2]) * e;
      }

      pos[o] = x;
      pos[o + 1] = y;
      pos[o + 2] = z;
    }
    g.attributes.position.needsUpdate = true;

    // Opacity: bright through the cinematic, settle to a clearly-visible ambient
    const fade = clamp01((t - INTRO.fall) / 1.4);
    mat.opacity = 0.96 - fade * 0.22;

    // Motion: fast spin during formation, slow drift for ambient
    const formingSpin = t < INTRO.sphere ? 0.5 : 0.045;
    spin.current += delta * formingSpin;
    p.rotation.y = spin.current + pointer.current.x * 0.18;
    p.rotation.x = -0.12 + pointer.current.y * 0.12;
  });

  return (
    <points ref={points}>
      <bufferGeometry ref={geom}>
        <bufferAttribute attach="attributes-position" args={[initial, 3]} />
        <bufferAttribute attach="attributes-color" args={[f.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.062}
        map={f.sprite}
        vertexColors
        transparent
        opacity={reduce ? 0.72 : 0.96}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function ParticleUniverse() {
  const reduce = useReducedMotion();
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 52 }}
        dpr={[1, 1.6]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <Field reduce={!!reduce} />
      </Canvas>
    </div>
  );
}

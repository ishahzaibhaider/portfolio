"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";

const COUNT = 5200;
const EMBER = new THREE.Color("#ff5a1f");
const BONE = new THREE.Color("#e9e6df");

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

// Deterministic pseudo-random so the cloud is identical every load
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Swarm({ still }: { still: boolean }) {
  const points = useRef<THREE.Points>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { positions, colors, sprite } = useMemo(() => {
    const rand = mulberry32(161);
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // Particles ride a torus knot path with noise, forming a tangled "signal"
      const t = rand() * Math.PI * 2;
      const p = 2;
      const q = 3;
      const r = 1.6 + Math.cos(q * t) * 0.55;
      const spread = 0.32 + rand() * 0.38;
      const jx = (rand() - 0.5) * spread;
      const jy = (rand() - 0.5) * spread;
      const jz = (rand() - 0.5) * spread;
      pos[i * 3] = r * Math.cos(p * t) + jx;
      pos[i * 3 + 1] = r * Math.sin(p * t) + jy;
      pos[i * 3 + 2] = Math.sin(q * t) * 0.9 + jz;

      const isEmber = rand() < 0.16;
      const c = isEmber ? EMBER : BONE;
      const dim = isEmber ? 0.9 : 0.28 + rand() * 0.5;
      col[i * 3] = c.r * dim;
      col[i * 3 + 1] = c.g * dim;
      col[i * 3 + 2] = c.b * dim;
    }
    return { positions: pos, colors: col, sprite: makeSprite() };
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x, 0.04);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y, 0.04);
    if (!still) {
      points.current.rotation.y += delta * 0.08;
      points.current.rotation.z += delta * 0.015;
    }
    points.current.rotation.x = -0.4 + pointer.current.y * 0.12;
    points.current.position.x = pointer.current.x * 0.25;
  });

  return (
    <points ref={points} rotation={[-0.4, 0, 0.3]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        map={sprite}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      eventSource={document.body}
    >
      <Swarm still={!!reduce} />
    </Canvas>
  );
}

"use client";
import { useEffect, useRef } from "react";
import type { ArtStyle } from "../data/projects";

const INK = "#131315";
const BONE = "rgba(233, 230, 223, 0.55)";
const BONE_DIM = "rgba(233, 230, 223, 0.16)";
const EMBER = "#ff5a1f";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Painter = (ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number) => void;

const flowfield: Painter = (ctx, w, h, rand) => {
  ctx.lineWidth = 1;
  for (let i = 0; i < 130; i++) {
    let x = rand() * w;
    let y = rand() * h;
    const ember = rand() < 0.12;
    ctx.strokeStyle = ember ? EMBER : rand() < 0.5 ? BONE : BONE_DIM;
    ctx.globalAlpha = ember ? 0.9 : 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 42; s++) {
      const angle = Math.sin(x * 0.006) * Math.cos(y * 0.008) * Math.PI * 2;
      x += Math.cos(angle) * 6;
      y += Math.sin(angle) * 6;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

const circuit: Painter = (ctx, w, h, rand) => {
  const step = 34;
  ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) {
    let x = Math.floor(rand() * (w / step)) * step;
    let y = Math.floor(rand() * (h / step)) * step;
    const ember = rand() < 0.14;
    ctx.strokeStyle = ember ? EMBER : BONE_DIM;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const segments = 3 + Math.floor(rand() * 5);
    for (let s = 0; s < segments; s++) {
      if (rand() < 0.5) x += (rand() < 0.5 ? -1 : 1) * step;
      else y += (rand() < 0.5 ? -1 : 1) * step;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = ember ? EMBER : BONE;
    ctx.beginPath();
    ctx.arc(x, y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
};

const waveform: Painter = (ctx, w, h, rand) => {
  const rows = 26;
  for (let r = 0; r < rows; r++) {
    const y = (h / rows) * r + h / rows / 2;
    const ember = rand() < 0.12;
    ctx.strokeStyle = ember ? EMBER : r % 3 === 0 ? BONE : BONE_DIM;
    ctx.lineWidth = ember ? 1.4 : 1;
    const freq = 0.008 + rand() * 0.02;
    const amp = 4 + rand() * 26;
    const phase = rand() * Math.PI * 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const env = Math.sin((x / w) * Math.PI);
      const yy = y + Math.sin(x * freq + phase) * amp * env;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
};

const orbit: Painter = (ctx, w, h, rand) => {
  const cx = w * 0.5;
  const cy = h * 0.5;
  for (let i = 0; i < 22; i++) {
    const rx = 30 + rand() * (w * 0.42);
    const ry = rx * (0.25 + rand() * 0.5);
    const rot = rand() * Math.PI;
    const ember = rand() < 0.18;
    ctx.strokeStyle = ember ? EMBER : BONE_DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    ctx.stroke();
    const t = rand() * Math.PI * 2;
    const px = cx + Math.cos(t) * rx * Math.cos(rot) - Math.sin(t) * ry * Math.sin(rot);
    const py = cy + Math.cos(t) * rx * Math.sin(rot) + Math.sin(t) * ry * Math.cos(rot);
    ctx.fillStyle = ember ? EMBER : BONE;
    ctx.beginPath();
    ctx.arc(px, py, ember ? 3 : 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
};

const grid: Painter = (ctx, w, h, rand) => {
  const cols = 14;
  const rows = 9;
  const cw = w / cols;
  const ch = h / rows;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const v = rand();
      if (v < 0.42) continue;
      const x = c * cw;
      const y = r * ch;
      if (v > 0.92) {
        ctx.fillStyle = EMBER;
        ctx.fillRect(x + 3, y + 3, cw - 6, ch - 6);
      } else if (v > 0.74) {
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 3, y + 3, cw - 6, ch - 6);
      } else {
        ctx.fillStyle = BONE_DIM;
        ctx.fillRect(x + cw / 2 - 1.5, y + ch / 2 - 1.5, 3, 3);
      }
    }
  }
};

const painters: Record<ArtStyle, Painter> = { flowfield, circuit, waveform, orbit, grid };

export default function GenerativeArt({ style, seed, className }: { style: ArtStyle; seed: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const draw = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, width, height);
      painters[style](ctx, width, height, mulberry32(seed));
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [style, seed]);

  return <canvas ref={ref} className={className ?? "absolute inset-0 h-full w-full"} aria-hidden="true" />;
}

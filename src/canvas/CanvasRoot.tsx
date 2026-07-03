"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { animate, motion, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { WORLD_W, WORLD_H, walkStops } from "../data/canvas";
import Clusters from "./Clusters";
import { TopBar, Minimap, WalkDock, ZoomControls } from "./Chrome";

const PAD = 140;
const MAX_S = 1.35;

export default function CanvasRoot({ onListView }: { onListView: () => void }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const s = useMotionValue(0.6);
  const surface = useRef<HTMLDivElement>(null);
  const anims = useRef<AnimationPlaybackControls[]>([]);
  const [walkIdx, setWalkIdx] = useState<number | null>(null);
  const [introDone, setIntroDone] = useState(false);

  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;
  const minScale = () => Math.max(0.13, Math.min(vw() / WORLD_W, vh() / WORLD_H) * 0.92);

  const clampS = (v: number) => Math.min(MAX_S, Math.max(minScale(), v));
  const clampX = (v: number, sc = s.get()) => {
    const lo = vw() - WORLD_W * sc - PAD;
    const hi = PAD;
    return lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v));
  };
  const clampY = (v: number, sc = s.get()) => {
    const lo = vh() - WORLD_H * sc - PAD;
    const hi = PAD;
    return lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v));
  };

  const stopAnims = () => {
    anims.current.forEach((a) => a.stop());
    anims.current = [];
  };

  const flyToPoint = useCallback(
    (cx: number, cy: number, fitW: number, instant = false) => {
      stopAnims();
      const portraitBoost = vh() > vw() ? 1.25 : 1;
      const ts = clampS((Math.min(vw(), vh() * 1.45) / fitW) * portraitBoost);
      const tx = clampX(vw() / 2 - cx * ts, ts);
      const ty = clampY(vh() / 2 - cy * ts, ts);
      if (instant || reduce) {
        s.set(ts);
        x.set(tx);
        y.set(ty);
        return;
      }
      const opts = { duration: 1.15, ease: [0.22, 1, 0.36, 1] as const };
      anims.current = [animate(x, tx, opts), animate(y, ty, opts), animate(s, ts, opts)];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduce]
  );

  // Intro: whole wall first, then settle on the hero cluster
  useEffect(() => {
    const hero = walkStops[0];
    if (reduce) {
      flyToPoint(hero.cx, hero.cy, hero.fitW, true);
      setIntroDone(true);
      return;
    }
    const all = minScale();
    s.set(all);
    x.set(clampX((vw() - WORLD_W * all) / 2, all));
    y.set(clampY((vh() - WORLD_H * all) / 2, all));
    const t = window.setTimeout(() => {
      flyToPoint(hero.cx, hero.cy, hero.fitW);
      setIntroDone(true);
    }, 1400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestures
  useEffect(() => {
    const el = surface.current;
    if (!el) return;

    const pointers = new Map<number, { px: number; py: number }>();
    let mode: "pan" | "pinch" | null = null;
    let start = { x: 0, y: 0, px: 0, py: 0 };
    let pinch0 = { dist: 1, s: 1, mx: 0, my: 0, wx: 0, wy: 0 };
    let moved = false;
    let vel = { vx: 0, vy: 0, t: 0, lx: 0, ly: 0 };

    const onDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { px: e.clientX, py: e.clientY });
      stopAnims();
      if (pointers.size === 1) {
        mode = "pan";
        moved = false;
        start = { x: x.get(), y: y.get(), px: e.clientX, py: e.clientY };
        vel = { vx: 0, vy: 0, t: performance.now(), lx: e.clientX, ly: e.clientY };
      } else if (pointers.size === 2) {
        mode = "pinch";
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.px - b.px, a.py - b.py);
        const mx = (a.px + b.px) / 2;
        const my = (a.py + b.py) / 2;
        pinch0 = {
          dist,
          s: s.get(),
          mx,
          my,
          wx: (mx - x.get()) / s.get(),
          wy: (my - y.get()) / s.get(),
        };
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { px: e.clientX, py: e.clientY });
      if (mode === "pan" && pointers.size === 1) {
        const dx = e.clientX - start.px;
        const dy = e.clientY - start.py;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        x.set(clampX(start.x + dx));
        y.set(clampY(start.y + dy));
        const now = performance.now();
        const dt = Math.max(1, now - vel.t);
        vel.vx = ((e.clientX - vel.lx) / dt) * 16;
        vel.vy = ((e.clientY - vel.ly) / dt) * 16;
        vel.t = now;
        vel.lx = e.clientX;
        vel.ly = e.clientY;
      } else if (mode === "pinch" && pointers.size === 2) {
        moved = true;
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.px - b.px, a.py - b.py);
        const mx = (a.px + b.px) / 2;
        const my = (a.py + b.py) / 2;
        const ns = clampS((pinch0.s * dist) / pinch0.dist);
        s.set(ns);
        x.set(clampX(mx - pinch0.wx * ns, ns));
        y.set(clampY(my - pinch0.wy * ns, ns));
      }
    };

    const release = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (mode === "pan" && pointers.size === 0) {
        if (moved && !reduce) {
          const px = clampX(x.get() + vel.vx * 14);
          const py = clampY(y.get() + vel.vy * 14);
          const opts = { duration: 0.8, ease: [0.17, 0.67, 0.3, 0.98] as const };
          anims.current = [animate(x, px, opts), animate(y, py, opts)];
        }
        mode = null;
      } else if (pointers.size === 1) {
        const [only] = [...pointers.values()];
        mode = "pan";
        moved = true;
        start = { x: x.get(), y: y.get(), px: only.px, py: only.py };
      } else if (pointers.size === 0) {
        mode = null;
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopAnims();
      if (e.ctrlKey || e.metaKey) {
        const ns = clampS(s.get() * Math.exp(-e.deltaY * 0.0024));
        const wx = (e.clientX - x.get()) / s.get();
        const wy = (e.clientY - y.get()) / s.get();
        s.set(ns);
        x.set(clampX(e.clientX - wx * ns, ns));
        y.set(clampY(e.clientY - wy * ns, ns));
      } else {
        x.set(clampX(x.get() - e.deltaX));
        y.set(clampY(y.get() - e.deltaY));
      }
    };

    const onDbl = (e: MouseEvent) => {
      const ns = clampS(s.get() * (e.shiftKey ? 0.55 : 1.7));
      const wx = (e.clientX - x.get()) / s.get();
      const wy = (e.clientY - y.get()) / s.get();
      const opts = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
      stopAnims();
      anims.current = [
        animate(s, ns, opts),
        animate(x, clampX(e.clientX - wx * ns, ns), opts),
        animate(y, clampY(e.clientY - wy * ns, ns), opts),
      ];
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("dblclick", onDbl);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("dblclick", onDbl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const startWalk = () => {
    setWalkIdx(0);
    const st = walkStops[0];
    flyToPoint(st.cx, st.cy, st.fitW);
  };
  const goWalk = (i: number) => {
    if (i < 0 || i >= walkStops.length) {
      setWalkIdx(null);
      return;
    }
    setWalkIdx(i);
    const st = walkStops[i];
    flyToPoint(st.cx, st.cy, st.fitW);
  };

  const zoomBy = (f: number) => {
    const ns = clampS(s.get() * f);
    const wx = (vw() / 2 - x.get()) / s.get();
    const wy = (vh() / 2 - y.get()) / s.get();
    const opts = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };
    stopAnims();
    anims.current = [
      animate(s, ns, opts),
      animate(x, clampX(vw() / 2 - wx * ns, ns), opts),
      animate(y, clampY(vh() / 2 - wy * ns, ns), opts),
    ];
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-ink" style={{ touchAction: "none", overscrollBehavior: "none" }}>
      <div ref={surface} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <motion.div
          className="absolute left-0 top-0 will-change-transform"
          style={{ width: WORLD_W, height: WORLD_H, x, y, scale: s, transformOrigin: "0 0" }}
        >
          <Clusters flyTo={flyToPoint} />
        </motion.div>
      </div>

      <TopBar
        onHome={() => flyToPoint(walkStops[0].cx, walkStops[0].cy, walkStops[0].fitW)}
        onWalk={startWalk}
        onContact={() => {
          const c = walkStops[walkStops.length - 1];
          flyToPoint(c.cx, c.cy, c.fitW);
        }}
        onListView={onListView}
      />
      <Minimap x={x} y={y} s={s} onJump={(cx, cy) => flyToPoint(cx, cy, 1900)} />
      <ZoomControls onIn={() => zoomBy(1.45)} onOut={() => zoomBy(0.7)} />
      {walkIdx !== null && (
        <WalkDock
          idx={walkIdx}
          onPrev={() => goWalk(walkIdx - 1)}
          onNext={() => goWalk(walkIdx + 1)}
          onClose={() => setWalkIdx(null)}
        />
      )}
      {!introDone && <div className="pointer-events-none fixed inset-0" />}
    </div>
  );
}

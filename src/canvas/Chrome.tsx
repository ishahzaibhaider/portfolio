"use client";
import { motion, useTransform, type MotionValue } from "motion/react";
import { X, CaretLeft, CaretRight, Plus, Minus, PersonSimpleWalk, Rows } from "@phosphor-icons/react";
import { WORLD_W, WORLD_H, walkStops } from "../data/canvas";

const MINI_W = 168;
const MINI_H = Math.round((MINI_W * WORLD_H) / WORLD_W);

export function TopBar({
  onHome,
  onWalk,
  onContact,
  onListView,
}: {
  onHome: () => void;
  onWalk: () => void;
  onContact: () => void;
  onListView: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between p-4">
      <button
        type="button"
        onClick={onHome}
        className="pointer-events-auto rounded-full border border-bone/15 bg-ink-3/80 px-4 py-2 text-sm font-semibold text-bone backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
      >
        Shahzaib Rizvi
      </button>
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onWalk}
          className="inline-flex items-center gap-2 rounded-full border border-bone/15 bg-ink-3/80 px-4 py-2 text-sm text-bone backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
        >
          <PersonSimpleWalk size={16} />
          <span className="hidden sm:inline">Guided walk</span>
        </button>
        <button
          type="button"
          onClick={onContact}
          className="rounded-full border border-bone/15 bg-ink-3/80 px-4 py-2 text-sm text-bone backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
        >
          Contact
        </button>
        <button
          type="button"
          onClick={onListView}
          aria-label="Switch to the plain list view"
          title="Plain list view"
          className="rounded-full border border-bone/15 bg-ink-3/80 p-2.5 text-bone-2 backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
        >
          <Rows size={16} />
        </button>
      </div>
    </div>
  );
}

export function Minimap({
  x,
  y,
  s,
  onJump,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  s: MotionValue<number>;
  onJump: (cx: number, cy: number) => void;
}) {
  const rectX = useTransform([x, s], ([xv, sv]) => ((-(xv as number) / (sv as number)) / WORLD_W) * MINI_W);
  const rectY = useTransform([y, s], ([yv, sv]) => ((-(yv as number) / (sv as number)) / WORLD_H) * MINI_H);
  const rectW = useTransform(s, (sv) => Math.min(MINI_W, (window.innerWidth / (WORLD_W * sv)) * MINI_W));
  const rectH = useTransform(s, (sv) => Math.min(MINI_H, (window.innerHeight / (WORLD_H * sv)) * MINI_H));

  return (
    <button
      type="button"
      aria-label="Jump to a spot on the canvas"
      className="fixed bottom-4 right-4 z-40 hidden overflow-hidden rounded-lg border border-bone/15 bg-ink-3/80 backdrop-blur-md sm:block"
      style={{ width: MINI_W, height: MINI_H }}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const cx = ((e.clientX - r.left) / MINI_W) * WORLD_W;
        const cy = ((e.clientY - r.top) / MINI_H) * WORLD_H;
        onJump(cx, cy);
      }}
    >
      {walkStops.map((st) => (
        <span
          key={st.key}
          className="absolute h-1.5 w-1.5 rounded-full bg-bone/40"
          style={{ left: (st.cx / WORLD_W) * MINI_W - 3, top: (st.cy / WORLD_H) * MINI_H - 3 }}
        />
      ))}
      <motion.span
        className="absolute rounded-[3px] border border-ember/80 bg-ember/10"
        style={{ left: rectX, top: rectY, width: rectW, height: rectH }}
      />
    </button>
  );
}

export function ZoomControls({ onIn, onOut }: { onIn: () => void; onOut: () => void }) {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex overflow-hidden rounded-full border border-bone/15 bg-ink-3/80 backdrop-blur-md">
      <button
        type="button"
        onClick={onOut}
        aria-label="Zoom out"
        className="p-3 text-bone-2 transition-colors hover:text-ember"
      >
        <Minus size={16} />
      </button>
      <button
        type="button"
        onClick={onIn}
        aria-label="Zoom in"
        className="border-l border-line p-3 text-bone-2 transition-colors hover:text-ember"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

export function WalkDock({
  idx,
  onPrev,
  onNext,
  onClose,
}: {
  idx: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const stop = walkStops[idx];
  const last = idx === walkStops.length - 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-4 left-1/2 z-40 w-[min(480px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-bone/15 bg-ink-3/90 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[11px] text-bone-3">
          {idx + 1} / {walkStops.length}
        </span>
        <button type="button" onClick={onClose} aria-label="End the walk" className="p-1 text-bone-2 hover:text-bone">
          <X size={15} />
        </button>
      </div>
      <div className="px-4 py-3">
        <p className="font-semibold text-bone">{stop.title}</p>
        <p className="mt-1 text-sm leading-snug text-bone-2">{stop.line}</p>
      </div>
      <div className="flex items-center justify-between border-t border-line px-2 py-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={idx === 0}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-bone-2 transition-colors hover:text-bone disabled:opacity-30"
        >
          <CaretLeft size={14} />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1 rounded-full bg-ember px-4 py-1.5 text-sm font-semibold text-ink transition-transform active:scale-[0.97]"
        >
          {last ? "Finish" : "Next"}
          {!last && <CaretRight size={14} />}
        </button>
      </div>
    </motion.div>
  );
}

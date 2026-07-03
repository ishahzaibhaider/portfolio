"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowsClockwise, CaretUp } from "@phosphor-icons/react";
import { personas, type Persona } from "../data/personas";

const PERSONA_KEYS: Persona[] = ["founder", "recruiter", "visitor"];

export default function AgentConsole({
  phase,
  lines,
  elapsed,
  persona,
  onRebuild,
}: {
  phase: "building" | "done";
  lines: string[];
  elapsed: number | null;
  persona: Persona;
  onRebuild: (p: Persona) => void;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence>
      {phase === "building" && (
        <motion.div
          key="log"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-40 rounded-xl border border-bone/15 bg-ink-3/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md sm:right-auto sm:w-[420px]"
        >
          <div className="border-b border-line px-4 py-2.5">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-bone-2">
              agent · building
            </span>
          </div>
          <div className="px-4 py-3 font-mono text-[13px] leading-relaxed" aria-live="polite">
            {lines.slice(-5).map((l, i) => (
              <p key={`${i}-${l}`} className="text-bone-2 last:text-bone">
                {l}
              </p>
            ))}
            <span className="tour-caret text-ember">_</span>
          </div>
        </motion.div>
      )}

      {phase === "done" && (
        <motion.div
          key="dock"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 z-40"
        >
          <AnimatePresence>
            {open && (
              <motion.div
                key="menu"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="mb-2 w-[260px] rounded-xl border border-bone/15 bg-ink-3/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md"
              >
                <p className="px-3 pb-2 pt-1 font-mono text-[11px] text-bone-3">
                  rebuild this page for
                </p>
                {PERSONA_KEYS.filter((p) => p !== persona).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onRebuild(p);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-bone transition-colors hover:bg-bone/5 hover:text-ember"
                  >
                    <ArrowsClockwise size={14} />
                    {personas[p].gateLabel}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full border border-bone/20 bg-ink-3/90 px-4 py-2 font-mono text-xs text-bone-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
          >
            agent · built in {elapsed ? `${elapsed.toFixed(1)}s` : "a blink"}
            <CaretUp size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

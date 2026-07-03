"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play, X } from "@phosphor-icons/react";

interface TourStep {
  sel: string | null;
  lines: string[];
}

const STEPS: TourStep[] = [
  {
    sel: null,
    lines: ["agent online.", "task: walk you through what he ships."],
  },
  {
    sel: '[data-tour="pink3"]',
    lines: [
      "Pink3. My cousins work here.",
      "Agents that click through a CRM so the users never have to.",
    ],
  },
  {
    sel: '[data-tour="retaj"]',
    lines: [
      "Retaj. 24 screens, four roles, two languages.",
      "Swipe the rail. Every screen is his.",
    ],
  },
  {
    sel: '[data-tour="tajseer"]',
    lines: ["Tajseer. Money moves through this one.", "Web, iOS, and Android, all live."],
  },
  {
    sel: '[data-tour="stores"]',
    lines: ["The store shelf.", "RealCrowd, TabibFinder, Sparkline, a VPN with real traffic."],
  },
  {
    sel: '[data-tour="index"]',
    lines: ["There are more. Seventy-plus.", "This page is the short list."],
  },
  {
    sel: '[data-tour="contact"]',
    lines: [
      "Tour complete.",
      "For transparency: I am scripted.",
      "The agents he builds for clients are not. Your move.",
    ],
  },
];

const TYPE_MS = 22;
const LINE_PAUSE_MS = 650;
const STEP_PAUSE_MS = 1600;

export default function AgentTour() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [typing, setTyping] = useState("");
  const cancelled = useRef(false);
  const timeouts = useRef<number[]>([]);

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      timeouts.current.push(window.setTimeout(resolve, ms));
    });

  const clearLive = () => {
    document.querySelectorAll('[data-tour-live="true"]').forEach((el) => {
      el.removeAttribute("data-tour-live");
    });
  };

  const stop = useCallback(() => {
    cancelled.current = true;
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
    clearLive();
    setActive(false);
    setLines([]);
    setTyping("");
  }, []);

  // The visitor grabbing the wheel or pressing Escape hands control back
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    const onTakeover = () => stop();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onTakeover, { passive: true });
    window.addEventListener("touchmove", onTakeover, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onTakeover);
      window.removeEventListener("touchmove", onTakeover);
    };
  }, [active, stop]);

  useEffect(() => stop, [stop]);

  const run = async () => {
    cancelled.current = false;
    setActive(true);
    setLines([]);

    for (const step of STEPS) {
      if (cancelled.current) return;
      clearLive();
      if (step.sel) {
        const el = document.querySelector(step.sel);
        if (el) {
          el.setAttribute("data-tour-live", "true");
          el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }
        await sleep(reduce ? 250 : 900);
      }
      for (const line of step.lines) {
        if (cancelled.current) return;
        if (reduce) {
          setLines((prev) => [...prev.slice(-3), line]);
        } else {
          for (let i = 1; i <= line.length; i++) {
            if (cancelled.current) return;
            setTyping(line.slice(0, i));
            await sleep(TYPE_MS);
          }
          setTyping("");
          setLines((prev) => [...prev.slice(-3), line]);
        }
        await sleep(LINE_PAUSE_MS);
      }
      await sleep(reduce ? 700 : STEP_PAUSE_MS);
    }
    await sleep(2400);
    if (!cancelled.current) stop();
  };

  return (
    <>
      <AnimatePresence>
        {!active && (
          <motion.button
            key="launch"
            type="button"
            onClick={run}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
            className="fixed bottom-6 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-bone/20 bg-ink-3/90 px-5 py-2.5 text-sm font-medium text-bone shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
          >
            <Play size={14} weight="fill" />
            Run the agent tour
          </motion.button>
        )}

        {active && (
          <motion.div
            key="console"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 right-4 z-40 rounded-xl border border-bone/15 bg-ink-3/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md sm:right-auto sm:w-[400px]"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-bone-2">tour agent</span>
              <button
                type="button"
                onClick={stop}
                aria-label="End the tour"
                className="rounded p-1 text-bone-2 transition-colors hover:text-bone"
              >
                <X size={16} />
              </button>
            </div>
            <div className="min-h-[110px] px-4 py-3 font-mono text-[13px] leading-relaxed" aria-live="polite">
              {lines.map((l, i) => (
                <p key={`${i}-${l}`} className="text-bone-2 last:text-bone">
                  {l}
                </p>
              ))}
              {typing && (
                <p className="text-bone">
                  {typing}
                  <span className="tour-caret text-ember">_</span>
                </p>
              )}
            </div>
            <p className="border-t border-line px-4 py-2 text-[11px] text-bone-3">
              Scroll or press Esc to take over
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

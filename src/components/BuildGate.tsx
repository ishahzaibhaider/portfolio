"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gateIntro, personas, type Persona } from "../data/personas";

const ease = [0.16, 1, 0.3, 1] as const;
const PERSONA_KEYS: Persona[] = ["founder", "recruiter", "visitor"];

export default function BuildGate({
  onChoose,
  onSkip,
}: {
  onChoose: (p: Persona) => void;
  onSkip: () => void;
}) {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<string[]>(reduce ? gateIntro : []);
  const [typing, setTyping] = useState("");
  const [ready, setReady] = useState(!!reduce);
  const cancelled = useRef(false);

  useEffect(() => {
    if (reduce) return;
    cancelled.current = false;
    const timeouts: number[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((r) => timeouts.push(window.setTimeout(r, ms)));

    (async () => {
      await sleep(600);
      const done: string[] = [];
      for (const line of gateIntro) {
        for (let i = 1; i <= line.length; i++) {
          if (cancelled.current) return;
          setTyping(line.slice(0, i));
          await sleep(24);
        }
        done.push(line);
        setLines([...done]);
        setTyping("");
        await sleep(420);
      }
      setReady(true);
    })();

    return () => {
      cancelled.current = true;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [reduce]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5">
      <div className="w-full max-w-xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-bone-3">
          shahzaibrizvi.com
        </p>
        <div className="mt-8 min-h-[76px] font-mono text-base leading-relaxed text-bone sm:text-lg">
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
          {typing && (
            <p>
              {typing}
              <span className="tour-caret text-ember">_</span>
            </p>
          )}
          {!typing && !ready && <span className="tour-caret text-ember">_</span>}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className={ready ? "" : "pointer-events-none opacity-0"}
        >
          <p className="mt-10 font-mono text-sm text-bone-2">so, who is asking?</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {PERSONA_KEYS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChoose(p)}
                className="rounded-full border border-bone/25 px-5 py-3 text-left text-base font-medium text-bone transition-colors hover:border-ember hover:text-ember sm:text-center"
              >
                {personas[p].gateLabel}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="mt-8 font-mono text-xs text-bone-3 underline-offset-4 transition-colors hover:text-bone hover:underline"
          >
            skip the show, just give me the page
          </button>
        </motion.div>
      </div>
    </div>
  );
}

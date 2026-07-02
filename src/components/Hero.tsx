"use client";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight } from "@phosphor-icons/react";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero({ revealed }: { revealed: boolean }) {
  const reduce = useReducedMotion();
  const enter = (delay: number) => {
    if (reduce) return {};
    return {
      initial: { opacity: 0, y: 36 },
      animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 },
      transition: { duration: 0.9, delay, ease },
    };
  };

  return (
    <section id="top" className="relative min-h-[100dvh] overflow-hidden">
      {/* Scrim keeps hero copy legible over the global particle field */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-5 pt-16 md:px-10">
        <motion.p {...enter(0.1)} className="font-mono text-xs uppercase tracking-[0.22em] text-bone-2">
          Syed Shahzaib Haider Rizvi · AI Engineer
        </motion.p>

        <motion.h1
          {...enter(0.22)}
          className="mt-6 max-w-5xl text-5xl font-bold leading-[0.95] tracking-tighter text-bone sm:text-6xl md:text-7xl lg:text-8xl"
        >
          AI systems that
          <br />
          actually <span className="text-ember">ship.</span>
        </motion.h1>

        <motion.p {...enter(0.36)} className="mt-8 max-w-xl text-lg leading-relaxed text-bone-2">
          Full-stack developer at Ideofuzion. Five years turning ideas into
          production apps, agents, and automation.
        </motion.p>

        <motion.div {...enter(0.48)} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-base font-semibold text-ink transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
          >
            See the work
            <ArrowDownRight
              size={18}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a>
          <a
            href="#contact"
            className="rounded-full border border-bone/25 px-6 py-3 text-base font-medium text-bone transition-colors hover:border-ember hover:text-ember"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}

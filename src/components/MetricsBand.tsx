"use client";
import { useRef, useEffect, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";
import Reveal from "./Reveal";

const metrics = [
  { value: 5, suffix: "+", label: "years shipping to production" },
  { value: 12, suffix: "", label: "products live for real users" },
  { value: 100, suffix: "+", label: "automation agents deployed" },
  { value: 4000, suffix: "+", label: "appointments through DocoMedo" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="font-mono text-5xl font-bold tracking-tight text-bone md:text-6xl">
      {display.toLocaleString()}
      <span className="text-ember">{suffix}</span>
    </span>
  );
}

export default function MetricsBand() {
  return (
    <section className="border-y border-line bg-ink-2">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 0.08}
            className="border-line px-5 py-12 sm:border-l sm:first:border-l-0 md:px-10"
          >
            <Counter value={m.value} suffix={m.suffix} />
            <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-bone-2">{m.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

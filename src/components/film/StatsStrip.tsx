"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { to: 5, suffix: " yrs", label: "shipping for clients" },
  { to: 70, suffix: "+", label: "products delivered" },
  { to: 7, suffix: "", label: "apps live in stores" },
  { to: 100, suffix: "+", label: "agents running at night" },
];

/**
 * The receipts, counted up once when they enter view. Sits between act
 * one and act two as a breath of plain fact between films.
 */
export default function StatsStrip() {
  const root = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(1);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const x = Math.min(1, (now - t0) / 1400);
          setT(1 - Math.pow(1 - x, 3));
          if (x < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={root}
      className="relative overflow-x-clip bg-[linear-gradient(180deg,#050b14_0%,#081220_100%)]"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-x-6 gap-y-10 px-7 py-[clamp(56px,9vh,104px)] md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="m-0 font-bold leading-none text-[#f2f4f1] text-[clamp(40px,4.6vw,64px)]">
              {Math.round(s.to * t)}
              <span className="text-mint">{s.suffix}</span>
            </p>
            <p className="m-0 mt-2.5 text-[12.5px] uppercase tracking-[0.16em] text-steel">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { chapters } from "../../data/climb";

interface Point {
  id: string;
  label: string;
  altitude: string;
  summit?: boolean;
}

const points: Point[] = [
  ...chapters.map((ch, i) => ({
    id: `ch-${i}`,
    label: ch.kicker.split("·")[1]?.trim() ?? ch.kicker,
    altitude: ch.altitude,
  })),
  { id: "contact", label: "The summit", altitude: "8,849 m", summit: true },
];

/**
 * The route card. A climber always knows which camp they are at and how
 * far the summit is; so does a visitor. Sits in the left margin on
 * desktop (the trail owns the right), on the right edge on mobile (the
 * trail owns the left). Hidden while the hero scene plays.
 */
export default function WaypointRail() {
  const [active, setActive] = useState(-1);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let ticking = false;
    const measure = () => {
      ticking = false;
      setShown(window.scrollY > window.innerHeight * 0.72);
      const mid = window.innerHeight * 0.5;
      let current = -1;
      points.forEach((p, i) => {
        const el = document.getElementById(p.id);
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (reduce) return;
    // images lazy-load during the glide and shift the layout under it,
    // so once the scroll settles, correct onto the target one time
    let timer = 0;
    const done = () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      if (Math.abs(el.getBoundingClientRect().top) > 10) {
        el.scrollIntoView({ behavior: "auto" });
      }
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(done, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    timer = window.setTimeout(done, 4000);
  };

  return (
    <nav
      aria-label="Journey waypoints"
      className={`fixed right-[7px] top-1/2 z-40 -translate-y-1/2 transition-opacity duration-700 lg:left-6 lg:right-auto ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative flex flex-col items-start gap-[22px] lg:gap-[26px]">
        <span
          aria-hidden
          className="absolute bottom-[6px] left-[5px] top-[6px] w-px bg-steel/20"
        />
        {points.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => jump(p.id)}
              aria-label={`${p.label}, ${p.altitude}`}
              aria-current={on ? "true" : undefined}
              className="group relative flex items-center gap-3"
            >
              {p.summit ? (
                <svg
                  viewBox="0 0 11 11"
                  className={`relative h-[11px] w-[11px] transition-all duration-500 ${
                    on ? "opacity-100" : "opacity-45 group-hover:opacity-80"
                  }`}
                >
                  <path d="M2 0 L2 11 M2 0 L9 2.6 L2 5.2" fill="none" stroke="#e0e1dd" strokeWidth="1.6" />
                  <path d="M2 0.8 L8 2.6 L2 4.4 Z" fill="#e0e1dd" />
                </svg>
              ) : (
                <span
                  className={`relative h-[11px] w-[11px] rounded-full border transition-all duration-500 ${
                    on
                      ? "border-arctic bg-arctic shadow-[0_0_12px_rgba(224,225,221,0.55)]"
                      : "border-steel/60 bg-deep group-hover:border-arctic/70"
                  }`}
                />
              )}
              <span
                className={`hidden whitespace-nowrap text-[11.5px] uppercase tracking-[0.16em] transition-all duration-500 lg:block ${
                  on
                    ? "translate-x-0 text-arctic opacity-90"
                    : "-translate-x-1 text-steel opacity-0 group-hover:translate-x-0 group-hover:opacity-80"
                }`}
              >
                {p.label} <span className="text-steel/80">· {p.altitude}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

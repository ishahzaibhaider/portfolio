"use client";
import { useEffect, useState } from "react";
import FilmSection from "./FilmSection";

const NAME = "SHAHZAIB RIZVI";

/** progress helper: 0 before `a`, 1 after `b`, linear between */
const span = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

/**
 * Act one. He walks the ridge with Amber while his name tracks in letter
 * by letter over the sky; the block clears as he sits and opens the
 * laptop, and the settled frame carries one quiet caption.
 */
export default function HeroFilm() {
  // the name tracks in once on arrival, on its own clock, and then stays: scrolling back to the
  // top (film at frame 0) must still show whose site this is
  const [intro, setIntro] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setIntro(1);
    let raf = 0;
    const t0 = performance.now() + 250;
    const tick = (now: number) => {
      const x = Math.min(1, Math.max(0, (now - t0) / 1600));
      setIntro(x);
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <FilmSection
      clip="arrival"
      frames={100}
      heightVh={320}
      focalX={0.62}
      eager
      auto
      reducedProgress={0.35}
      overlay={(p) => {
        // the name never leaves: as he sits, the block settles into a smaller title so a visitor who
        // only watches still knows whose site this is
        const settle = span(p, 0.5, 0.66);
        const introOut = 1 - settle;
        const captionIn = span(p, 0.78, 0.9);
        return (
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-x-0 top-[16vh] origin-top-left px-[6vw] text-left md:top-[18vh]"
              style={{ transform: `translateY(${-settle * 5}vh) scale(${1 - settle * 0.42})` }}
            >
              <p
                className="m-0 mb-4 text-[12px] uppercase tracking-[0.24em] text-arctic/85 md:text-[13px]"
                style={{ opacity: Math.max(span(p, 0.015, 0.06), intro) * introOut }}
              >
                AI engineer · Islamabad · five years, seventy products
              </p>
              <h1 className="m-0 font-bold leading-[0.94] tracking-[-0.01em] text-[#f2f4f1] [text-shadow:0_4px_40px_rgba(2,6,12,0.65)] text-[clamp(42px,10.5vw,158px)]">
                {(() => {
                  let li = 0;
                  return NAME.split(" ").map((word, wi) => {
                    const start = li;
                    li += word.length + 1;
                    return (
                      <span key={wi}>
                        <span className="inline-block whitespace-nowrap">
                          {word.split("").map((ch, i) => {
                            const k = (start + i) / NAME.length;
                            const t = Math.max(span(p, 0.03 + (start + i) * 0.012, 0.085 + (start + i) * 0.012), span(intro, k * 0.6, k * 0.6 + 0.4));
                            return (
                              <span
                                key={i}
                                className="inline-block"
                                style={{ opacity: t, transform: `translateY(${(1 - t) * 34}px)` }}
                              >
                                {ch}
                              </span>
                            );
                          })}
                        </span>{" "}
                      </span>
                    );
                  });
                })()}
              </h1>
              <p
                className="m-0 mt-5 max-w-[46ch] text-[15.5px] leading-relaxed text-arctic/90 md:text-[17px]"
                style={{ opacity: span(p, 0.24, 0.34) * introOut }}
              >
                I build products that ship: mobile apps, platforms, and AI
                agents that work while you sleep.
              </p>
            </div>

            <div
              className="absolute bottom-[9vh] left-[6vw] max-w-[38ch]"
              style={{ opacity: captionIn }}
            >
              <p className="m-0 text-[13.5px] uppercase tracking-[0.2em] text-arctic/80">
                He builds. She supervises.
              </p>
            </div>

            <div
              className="absolute bottom-[4.5vh] left-1/2 -translate-x-1/2"
              style={{ opacity: 1 - span(p, 0.04, 0.12) }}
            >
              <div className="h-9 w-[1.5px] bg-gradient-to-b from-arctic/0 via-arctic/70 to-arctic/0" />
            </div>
          </div>
        );
      }}
    />
  );
}

"use client";
import FilmSection from "./FilmSection";

const span = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

const PILLARS = [
  {
    num: "01",
    title: "Apps in the stores",
    line: "Seven live products with real users, from TabibFinder to Zero-Trace VPN.",
  },
  {
    num: "02",
    title: "Platforms that carry businesses",
    line: "RentRoyz, Tajseer, DocoMedo: systems where downtime costs somebody money.",
  },
  {
    num: "03",
    title: "Agents that operate software",
    line: "Pink3 and a hundred quiet bots doing the clicking themselves, all night.",
  },
];

/**
 * Act two. The night deepens while he works, Amber asleep against his
 * leg, and the three things he actually sells surface one at a time
 * over the film.
 */
export default function BuilderFilm() {
  return (
    <FilmSection
      clip="builder"
      frames={100}
      heightVh={300}
      focalX={0.45}
      overlay={(p) => (
        <div className="pointer-events-none absolute inset-0">
          <p
            className="absolute left-[6vw] top-[10vh] m-0 text-[12px] uppercase tracking-[0.24em] text-arctic/80 md:text-[13px]"
            style={{ opacity: span(p, 0.03, 0.1) * (1 - span(p, 0.88, 0.97)) }}
          >
            What I build
          </p>
          {PILLARS.map((pl, i) => {
            const a = 0.08 + i * 0.28;
            const t = span(p, a, a + 0.09) * (1 - span(p, a + 0.19, a + 0.27));
            return (
              <div
                key={pl.num}
                className="absolute left-[6vw] top-[15vh] max-w-[24ch] md:max-w-[34ch]"
                style={{
                  opacity: t,
                  transform: `translateY(${(1 - t) * 26}px)`,
                  visibility: t === 0 ? "hidden" : "visible",
                }}
              >
                <p className="m-0 mb-2 text-[13px] tracking-[0.18em] text-mint/90">{pl.num}</p>
                <h2 className="m-0 font-bold leading-[1.04] text-[#f2f4f1] [text-shadow:0_4px_36px_rgba(2,6,12,0.75)] text-[clamp(30px,4.4vw,58px)]">
                  {pl.title}
                </h2>
                <p className="m-0 mt-3.5 max-w-[40ch] text-[14.5px] leading-relaxed text-arctic/95 [text-shadow:0_2px_18px_rgba(2,6,12,0.9)] md:text-[16px]">
                  {pl.line}
                </p>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}

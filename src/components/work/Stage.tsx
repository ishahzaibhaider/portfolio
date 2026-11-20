"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "@phosphor-icons/react";
import { flagships, reelIcon } from "../../data/reels";
import Film, { FILM_DUR } from "./Film";
import { openWork, prefersReducedMotion, useOpenWork, useSmall } from "./open";

/**
 * The stage: five products to watch first. The film plays by itself (14 seconds, on its own clock), so how
 * fast somebody scrolls no longer decides whether they see it; the page holds still for a moment here while
 * it does. The visitor picks what plays; when a film ends the next one starts.
 */
export default function Stage() {
  const small = useSmall();
  const open = useOpenWork();
  const root = useRef<HTMLElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const [i, setI] = useState(0);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const touchX = useRef<number | null>(null);
  const r = flagships[i];
  const n = flagships.length;
  const go = (k: number) => setI(((k % n) + n) % n);

  useEffect(() => {
    const el = root.current!;
    const a = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "80% 0px" });
    const b = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    a.observe(el);
    b.observe(el);
    return () => { a.disconnect(); b.disconnect(); };
  }, []);

  useEffect(() => {
    bars.current.forEach((b) => b && (b.style.transform = "scaleX(0)"));
  }, [i]);

  const onTime = (t: number) => {
    const b = bars.current[i];
    if (b) b.style.transform = `scaleX(${Math.min(1, t / FILM_DUR)})`;
  };
  const next = useRef(0);
  useEffect(() => () => window.clearTimeout(next.current), [i]);
  const onEnded = () => {
    next.current = window.setTimeout(() => go(i + 1), 1800); // hold the end card, then move on
  };

  return (
    <section ref={root} id="stage" className="relative bg-deep md:h-[150vh]">
      <div className="relative flex min-h-[100svh] items-center overflow-hidden px-[var(--g)] py-[88px] md:sticky md:top-0 md:h-screen md:py-0">
        {/* the product's own colour lights the room while its film plays */}
        <div aria-hidden className="pointer-events-none absolute right-[-10%] top-1/2 h-[90%] w-[75%] -translate-y-1/2 rounded-full opacity-[0.12] blur-[120px] transition-[background] duration-700" style={{ background: r.glow }} />

        <div className="relative grid w-full items-center gap-[clamp(22px,4vw,64px)] md:grid-cols-[minmax(240px,0.36fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="m-0 mb-3 text-[12px] uppercase tracking-[0.22em] text-steel md:mb-4 md:text-[12.5px]">Start here · 14 seconds each</p>
            <h2 className="m-0 font-bold leading-[1.03] text-[#eef1ee] text-[clamp(30px,3.5vw,54px)]">Five to watch first.</h2>

            {/* desktop: the list is the remote */}
            <ol className="m-0 mt-7 hidden list-none p-0 md:block">
              {flagships.map((f, k) => {
                const on = k === i;
                return (
                  <li key={f.slug}>
                    <button type="button" onClick={() => go(k)} aria-current={on} className="group block w-full cursor-pointer border-0 bg-transparent p-0 py-[11px] text-left">
                      <span className="flex items-center gap-3">
                        <img src={reelIcon(f.slug)} alt="" className={`h-7 w-7 rounded-[8px] transition-opacity duration-300 ${on ? "opacity-100" : "opacity-45 group-hover:opacity-80"}`} />
                        <span className={`font-display text-[clamp(19px,1.7vw,25px)] font-bold leading-none tracking-[-0.01em] transition-colors duration-300 ${on ? "text-[#f4f6f3]" : "text-arctic/40 group-hover:text-arctic/75"}`}>{f.name}</span>
                        <span className={`ml-auto text-[12px] tabular-nums transition-colors ${on ? "text-arctic/60" : "text-arctic/25"}`}>{String(k + 1).padStart(2, "0")}</span>
                      </span>
                      <span className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}>
                        <span className="overflow-hidden">
                          <span className="block pt-3 text-[14.5px] leading-relaxed text-[#b9c3d2]">{f.line}</span>
                          <span className="mt-2 block text-[11px] uppercase tracking-[0.14em] text-steel">{f.meta}</span>
                        </span>
                      </span>
                      <span className="mt-[11px] block h-[2px] overflow-hidden rounded-full bg-arctic/10">
                        <span ref={(el) => { bars.current[k] = el; }} className="block h-full origin-left scale-x-0 bg-mint" style={{ opacity: on ? 1 : 0 }} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <button type="button" onClick={() => openWork(r.slug)} className="mt-6 hidden cursor-pointer items-center gap-2 rounded-[12px] border-0 bg-arctic px-5 py-3 text-[14.5px] font-bold text-deep transition-transform duration-300 hover:-translate-y-[2px] md:inline-flex">
              Open {r.name} <ArrowUpRight size={16} weight="bold" />
            </button>
          </div>

          <div className="min-w-0">
            <div
              className="group relative mx-auto w-full max-w-[calc((100svh-150px)*0.8)] md:max-w-[calc((100vh-170px)*16/9)]"
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current == null) return;
                const d = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (Math.abs(d) > 44) go(i + (d < 0 ? 1 : -1));
              }}
            >
              <button type="button" onClick={() => openWork(r.slug)} aria-label={`Open ${r.name}`} className="block w-full cursor-pointer border-0 bg-transparent p-0">
                <Film
                  key={`${r.slug}-${small}`}
                  slug={r.slug}
                  tall={small}
                  live={near && !open}
                  playing={inView && !paused && !open}
                  onTime={onTime}
                  onEnded={onEnded}
                  title={`${r.name}: product film`}
                  className={`stage-in relative w-full rounded-[18px] bg-[#0b1522] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10 md:rounded-[22px] ${small ? "aspect-[4/5]" : "aspect-[16/9]"}`}
                />
              </button>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play" : "Pause"}
                className="absolute bottom-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-[rgba(6,14,24,0.7)] text-arctic ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-[rgba(6,14,24,0.9)] md:bottom-4 md:right-4"
              >
                {paused ? <Play size={16} weight="fill" /> : <Pause size={16} weight="fill" />}
              </button>
            </div>

            {/* phones: icons are the remote, the words sit under the film */}
            <div className="mt-4 md:hidden">
              <div className="flex gap-2">
                {flagships.map((f, k) => (
                  <button key={f.slug} type="button" onClick={() => go(k)} aria-label={f.name} aria-current={k === i} className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0">
                    <img src={reelIcon(f.slug)} alt="" className={`mx-auto h-9 w-9 rounded-[10px] transition-opacity ${k === i ? "opacity-100" : "opacity-40"}`} />
                    <span className="mt-2 block h-[2px] overflow-hidden rounded-full bg-arctic/12">
                      {small && <span ref={(el) => { bars.current[k] = el; }} className="block h-full origin-left scale-x-0 bg-mint" style={{ opacity: k === i ? 1 : 0 }} />}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="m-0 font-display text-[21px] font-bold leading-tight text-[#f4f6f3]">{r.name}</p>
                  <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-[#b9c3d2]">{r.line}</p>
                </div>
                <button type="button" onClick={() => openWork(r.slug)} className="mt-0.5 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[12px] border-0 bg-arctic px-4 py-2.5 text-[14px] font-bold text-deep">
                  Open <ArrowUpRight size={15} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

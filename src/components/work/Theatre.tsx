"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowClockwise, ArrowLeft, ArrowRight, Pause, Play, X } from "@phosphor-icons/react";
import { work, reelIcon, bySlug } from "../../data/reels";
import { lockScroll } from "../../smooth";
import Film, { FILM_DUR, type FilmHandle } from "./Film";
import { closeWork, openWork, prefersReducedMotion, useOpenWork, useSmall } from "./open";

/**
 * A product, full screen: its film on a clean ground, the words in their own band beside or under it (never
 * on top of the picture), a bar you can drag, and the next product one key away. Opens from the wall, the
 * stage and the grid; the address changes, so it can be linked to and Back closes it.
 */
export default function Theatre() {
  const slug = useOpenWork();
  const small = useSmall();
  const r = slug ? bySlug(slug) : undefined;
  const film = useRef<FilmHandle>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);
  const idx = r ? work.indexOf(r) : -1;
  const step = (d: number) => openWork(work[(idx + d + work.length) % work.length].slug);

  useEffect(() => {
    if (!slug) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [!!slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPlaying(!prefersReducedMotion());
    setEnded(false);
    if (bar.current) bar.current.style.transform = "scaleX(0)";
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWork();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === " ") { e.preventDefault(); toggle(); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  });

  if (!r) return null;
  const toggle = () => {
    if (ended) { film.current?.restart(); setEnded(false); setPlaying(true); } else setPlaying((p) => !p);
  };
  const scrub = (clientX: number) => {
    const b = track.current!.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - b.left) / b.width));
    film.current?.seek(x * FILM_DUR);
    setEnded(false);
  };
  const tall = small;
  const nextR = work[(idx + 1) % work.length];

  return (
    <div role="dialog" aria-modal="true" aria-label={r.name} data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-[#040910]/[0.97] backdrop-blur-xl">
      <div aria-hidden className="pointer-events-none fixed left-1/2 top-[30%] h-[70%] w-[80%] -translate-x-1/2 rounded-full opacity-[0.14] blur-[140px]" style={{ background: r.glow }} />
      <div className="relative mx-auto flex min-h-full w-full max-w-[1500px] flex-col px-[max(16px,4vw)] pb-8 pt-4 md:pt-5">
        {/* top bar */}
        <div className="flex items-center justify-between gap-4">
          <p className="m-0 text-[12px] tabular-nums uppercase tracking-[0.18em] text-steel">{String(idx + 1).padStart(2, "0")} / {work.length}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => step(-1)} aria-label="Previous product" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-white/[0.06] text-arctic ring-1 ring-white/10 transition-colors hover:bg-white/[0.12]"><ArrowLeft size={17} /></button>
            <button type="button" onClick={() => step(1)} aria-label="Next product" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-white/[0.06] text-arctic ring-1 ring-white/10 transition-colors hover:bg-white/[0.12]"><ArrowRight size={17} /></button>
            <button type="button" onClick={closeWork} aria-label="Close" className="ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-arctic text-deep transition-transform hover:scale-105"><X size={17} weight="bold" /></button>
          </div>
        </div>

        <div className="mt-4 grid flex-1 items-center gap-[clamp(20px,3vw,48px)] md:mt-5 md:grid-cols-[minmax(0,1fr)_minmax(240px,300px)]">
          <div className="min-w-0">
            <div key={r.slug} className="stage-in mx-auto w-full max-w-[calc((100svh-250px)*0.8)] md:max-w-[calc((100vh-190px)*16/9)]">
              <div className={`relative overflow-hidden rounded-[16px] bg-[#0b1522] ring-1 ring-white/10 md:rounded-[20px] ${tall ? "aspect-[4/5]" : "aspect-[16/9]"}`}>
                {r.shots ? (
                  <div className="absolute inset-0 flex items-end justify-center gap-[4%] px-[6%] pt-[6%]" style={{ background: `radial-gradient(90% 80% at 50% 0%, ${r.glow}55 0%, #0b1522 70%)` }}>
                    {r.shots.web && (!tall || !r.shots.phones) && <img src={r.shots.web} alt={`${r.name} on the web`} className="w-[62%] self-end rounded-t-[10px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]" />}
                    {r.shots.phones?.slice(0, tall ? 1 : 2).map((p) => (
                      <img key={p} src={p} alt={`${r.name} screen`} className={`self-end rounded-t-[22px] object-cover object-top ring-[5px] ring-[#0b0d10] ${tall ? "w-[62%]" : "w-[20%]"}`} style={{ aspectRatio: "440 / 880" }} />
                    ))}
                  </div>
                ) : (
                  <Film ref={film} slug={r.slug} tall={tall} live playing={playing} onEnded={() => { setEnded(true); setPlaying(false); }}
                    onTime={(t) => bar.current && (bar.current.style.transform = `scaleX(${Math.min(1, t / FILM_DUR)})`)} className="absolute inset-0" title={`${r.name}: product film`} />
                )}
              </div>
              {!r.shots && (
                <div className="mt-3 flex items-center gap-3">
                  <button type="button" onClick={toggle} aria-label={ended ? "Play again" : playing ? "Pause" : "Play"} className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white/[0.08] text-arctic ring-1 ring-white/10 transition-colors hover:bg-white/[0.14]">
                    {ended ? <ArrowClockwise size={17} weight="bold" /> : playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
                  </button>
                  <div
                    ref={track}
                    role="slider" aria-label="Film position" aria-valuemin={0} aria-valuemax={FILM_DUR} aria-valuenow={0} tabIndex={0}
                    className="relative h-10 flex-1 cursor-pointer touch-none"
                    onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); setPlaying(false); scrub(e.clientX); }}
                    onPointerMove={(e) => e.buttons === 1 && scrub(e.clientX)}
                  >
                    <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/12">
                      <span ref={bar} className="block h-full origin-left scale-x-0 bg-mint" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* the words, in their own column */}
          <div key={`info-${r.slug}`} className="stage-in min-w-0 pb-4 md:pb-0">
            <div className="flex items-center gap-3.5">
              {(r.shots ? r.shots.icon : reelIcon(r.slug)) ? <img src={r.shots ? r.shots.icon : reelIcon(r.slug)} alt="" className="h-12 w-12 rounded-[13px]" /> : (
                <span className="flex h-12 w-12 items-center justify-center rounded-[13px] font-display text-[20px] font-bold text-white" style={{ background: r.glow }}>{r.name[0]}</span>
              )}
              <div className="min-w-0">
                <h2 className="m-0 font-bold leading-[1.05] text-[#f4f6f3] text-[clamp(26px,2.4vw,36px)]">{r.name}</h2>
                {r.state && <span className="mt-1.5 inline-block rounded-[6px] bg-[#f2b544]/15 px-1.5 py-[2px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#f2c56b]">{r.state}</span>}
              </div>
            </div>
            <p className="m-0 mt-5 text-[16px] leading-relaxed text-[#d3dae3] md:text-[17px]">{r.line}</p>
            <p className="m-0 mt-4 text-[11.5px] uppercase leading-relaxed tracking-[0.14em] text-steel">{r.meta}</p>
            <p className="m-0 mt-5 border-t border-arctic/10 pt-4 text-[13px] leading-relaxed text-arctic/55">
              {r.shots ? "Real screenshots from the shipped product." : "This film is code, not video: the real app was run, tapped through and captured, then drawn live in your browser."}
            </p>
            <button type="button" onClick={() => step(1)} className="group mt-6 flex w-full cursor-pointer items-center justify-between gap-3 rounded-[14px] border-0 bg-white/[0.05] px-4 py-3.5 text-left ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]">
              <span className="min-w-0">
                <span className="block text-[11px] uppercase tracking-[0.16em] text-steel">Next</span>
                <span className="mt-0.5 block truncate font-display text-[17px] font-bold text-[#eef1ee]">{nextR.name}</span>
              </span>
              <ArrowRight size={18} className="shrink-0 text-arctic transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

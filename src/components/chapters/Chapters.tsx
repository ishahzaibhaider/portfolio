"use client";
import { useEffect, useRef, useState } from "react";
import { reels, reelIcon } from "../../data/reels";

/**
 * One chapter per app. Each is a tall section with the app's film pinned full-screen; scrolling drives
 * the film frame by frame (dive in, real taps, cards lifting off the glass, end card) and scrolling
 * back rewinds it. Films are code (an iframe of the film page in ?scrub mode, ~0.6 MB each) and only
 * the chapters near the viewport are mounted. A chapter index stays on screen so nobody is forced
 * through all of them.
 */
const DUR = 14;

function useSmall() {
  const [small, setSmall] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setSmall(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return small;
}

function Chapter({ i, small, onActive }: { i: number; small: boolean; onActive: (i: number) => void }) {
  const r = reels[i];
  const sec = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = sec.current!;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "100% 0px" });
    const io2 = new IntersectionObserver(([e]) => e.isIntersecting && onActive(i), { threshold: 0, rootMargin: "-50% 0px -50% 0px" });
    io.observe(el);
    io2.observe(el);
    return () => { io.disconnect(); io2.disconnect(); };
  }, [i, onActive]);

  useEffect(() => setReady(false), [near, small]);
  useEffect(() => {
    const on = (e: MessageEvent) => e.data?.reel === "ready" && e.data.slug === r.slug && setReady(true);
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [r.slug]);

  // scroll → film time, eased so fast scrolls stay smooth
  useEffect(() => {
    if (!near) return;
    let raf = 0, shown = -1;
    const tick = () => {
      const el = sec.current!;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const prog = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const target = Math.min(1, prog / 0.9) * DUR;
      shown = shown < 0 ? target : shown + (target - shown) * 0.2;
      if (Math.abs(target - shown) < 0.002) shown = target;
      const w = frame.current?.contentWindow as (Window & { seek?: (t: number) => void }) | null;
      if (ready && w?.seek) w.seek(Math.min(DUR - 0.001, shown));
      setP((old) => (Math.abs(old - prog) > 0.004 ? prog : old));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [near, ready]);

  const infoIn = Math.min(1, p / 0.06) * (1 - Math.max(0, (p - 0.94) / 0.06));
  return (
    <section ref={sec} id={`chapter-${r.slug}`} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "#060e18" }}>
        <img
          src={`/reels/${r.slug}-${small ? "4x5" : "16x9"}.webp`}
          alt=""
          loading="lazy"
          className={`absolute inset-0 h-full w-full ${small ? "object-contain" : "object-cover"} transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
        />
        {near && (
          <iframe
            key={`${r.slug}-${small}`}
            ref={frame}
            src={`/reels/${r.slug}/film/index.html?fmt=${small ? "4x5" : "16x9"}&scrub`}
            title={`${r.name}: product film`}
            tabIndex={-1}
            className={`pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          />
        )}
        {/* chapter card: a small glass label, so the film keeps its own colours */}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-[520px]" style={{ opacity: infoIn, transform: `translateY(${(1 - infoIn) * 12}px)` }}>
          <div className="flex items-center gap-3.5 rounded-[18px] bg-[rgba(6,14,24,0.72)] p-3 pr-5 ring-1 ring-white/10 backdrop-blur-xl">
            <img src={reelIcon(r.slug)} alt="" className="h-11 w-11 shrink-0 rounded-[12px]" />
            <div className="min-w-0">
              <p className="m-0 text-[10.5px] uppercase tracking-[0.18em] text-arctic/65">
                {String(i + 1).padStart(2, "0")} · {r.meta}
              </p>
              <p className="m-0 mt-1 text-[13.5px] leading-snug text-[#e9edf1] md:text-[14.5px]">{r.line}</p>
            </div>
          </div>
        </div>
        {/* this chapter's progress */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-arctic/10">
          <div className="h-full origin-left bg-arctic/70" style={{ transform: `scaleX(${p})` }} />
        </div>
      </div>
    </section>
  );
}

export default function Chapters() {
  const small = useSmall();
  const [active, setActive] = useState(-1);
  const [shown, setShown] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { threshold: 0 });
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="relative">
      {reels.map((_, i) => (
        <Chapter key={reels[i].slug} i={i} small={small} onActive={setActive} />
      ))}
      {/* the chapter index: always there, jump anywhere */}
      <nav
        aria-label="Chapters"
        className={`fixed z-30 transition-opacity duration-500 ${shown ? "opacity-100" : "pointer-events-none opacity-0"} top-[60px] left-1/2 -translate-x-1/2 md:left-auto md:left-auto md:right-5 md:top-1/2 md:-translate-y-1/2 md:translate-x-0`}
      >
        <ul className="m-0 flex list-none gap-1.5 rounded-full bg-deep/70 p-1.5 ring-1 ring-arctic/15 backdrop-blur-md md:flex-col md:rounded-[22px]">
          {reels.map((r, i) => (
            <li key={r.slug}>
              <button
                type="button"
                onClick={() => document.getElementById(`chapter-${r.slug}`)?.scrollIntoView({ behavior: "smooth" })}
                className={`group relative flex items-center rounded-full p-1 transition-colors ${i === active ? "bg-arctic/15" : "hover:bg-arctic/10"}`}
                aria-label={r.name}
                aria-current={i === active}
              >
                <img src={reelIcon(r.slug)} alt="" className={`h-8 w-8 rounded-[9px] transition-opacity ${i === active ? "opacity-100" : "opacity-55 group-hover:opacity-100"}`} />
                <span className="pointer-events-none absolute right-[calc(100%+10px)] hidden whitespace-nowrap rounded-full bg-arctic px-3 py-1 text-[13px] font-semibold text-deep opacity-0 transition-opacity group-hover:opacity-100 md:block">
                  {r.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { reels, reelFilm, reelPoster, reelIcon } from "../../data/reels";

/**
 * The showreel. Each product's film is code, not video: it runs live inside the theater (an iframe of
 * the film page), drawn from the product's real screens at whatever resolution the screen has. Nothing
 * loads until the section is near; one film at a time; it pauses off-screen and moves on by itself when
 * a film ends. The rail shows where you are and lets you jump. Phones get the 4:5 cut and swipe.
 * Reduced-motion visitors see each film's first frame until they press play.
 */
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

export default function Showreel() {
  const small = useSmall();
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false); // close enough to start loading
  const [inView, setInView] = useState(false); // visible enough to play
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const reel = reels[active];
  const go = (i: number) => setActive((i + reels.length) % reels.length);
  const send = (reel: "play" | "pause" | "restart") => frame.current?.contentWindow?.postMessage({ reel }, "*");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduce(true);
      setPaused(true);
    }
    const el = root.current;
    if (!el) return;
    const ioNear = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "60% 0px" });
    const ioView = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    ioNear.observe(el);
    ioView.observe(el);
    return () => {
      ioNear.disconnect();
      ioView.disconnect();
    };
  }, []);

  // a new film: wait for it to say it is ready
  useEffect(() => setReady(false), [active, small]);

  // messages from the film: ready / progress / ended
  useEffect(() => {
    const on = (e: MessageEvent) => {
      const d = e.data;
      if (!d || typeof d.reel !== "string" || d.slug !== reels[active].slug) return;
      if (d.reel === "ready") setReady(true);
      if (d.reel === "progress" || d.reel === "ended") {
        bars.current.forEach((b, i) => {
          if (b) b.style.transform = `scaleX(${i < active ? 1 : i === active ? Math.min(1, d.t / d.dur) : 0})`;
        });
      }
      if (d.reel === "ended") window.setTimeout(() => go(active + 1), 500);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [active]);

  // play only while on screen and not paused by the visitor
  useEffect(() => {
    if (ready) send(inView && !paused ? "play" : "pause");
  }, [ready, inView, paused]);

  useEffect(() => {
    bars.current.forEach((b, i) => b && (b.style.transform = `scaleX(${i < active ? 1 : 0})`));
  }, [active]);

  const mountFilm = near && !(reduce && paused);

  return (
    <section
      ref={root}
      id="work"
      className="relative overflow-x-clip bg-[linear-gradient(180deg,#060e18_0%,#08111d_40%,#060e18_100%)] py-[clamp(64px,9vh,112px)]"
    >
      <div className="mx-auto max-w-[1240px] px-4 md:px-7">
        <p className="m-0 mb-3 text-[12.5px] uppercase tracking-[0.2em] text-steel">Selected work · in motion</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="m-0 max-w-[15ch] font-bold leading-[1.02] text-[#eef1ee] text-[clamp(34px,5.2vw,64px)]">
            Products you can watch.
          </h2>
          <p className="m-0 max-w-[44ch] text-[15.5px] leading-relaxed text-[#b9c3d2] md:text-right">
            These aren't videos. Each film runs live in your browser, built in code from the real app's real screens.
          </p>
        </div>

        {/* the theater */}
        <div className="relative mx-auto mt-9 md:mt-10" style={{ maxWidth: small ? undefined : "min(100%, calc(64vh * 16 / 9))" }}>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[10%] opacity-50 blur-[70px] transition-[background] duration-1000"
            style={{ background: `radial-gradient(50% 50% at 50% 50%, ${reel.glow} 0%, transparent 100%)` }}
          />
          <div
            className="relative overflow-hidden rounded-[18px] bg-ink ring-1 ring-arctic/12 shadow-[0_40px_120px_rgba(2,6,12,0.7)] md:rounded-[24px]"
            style={{ aspectRatio: small ? "4 / 5" : "16 / 9" }}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current == null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
              touchX.current = null;
            }}
          >
            <img
              src={reelPoster(reel.slug, small)}
              alt={`${reel.name}, first frame of its film`}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
            />
            {mountFilm && (
              <iframe
                key={`${reel.slug}-${small}`}
                ref={frame}
                src={reelFilm(reel.slug, small)}
                title={`${reel.name}: product film`}
                tabIndex={-1}
                className={`pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
              />
            )}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play film" : "Pause film"}
              className="group absolute inset-0 flex items-end justify-end p-4 md:p-5"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-deep/55 text-arctic backdrop-blur-md ring-1 ring-arctic/20 transition-opacity duration-300 ${
                  paused ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {paused ? (
                  <svg width="15" height="16" viewBox="0 0 15 16" fill="currentColor"><path d="M2 1.6v12.8c0 .8.9 1.3 1.6.9l10.4-6.4c.6-.4.6-1.4 0-1.8L3.6.7C2.9.3 2 .8 2 1.6z" /></svg>
                ) : (
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><rect x="1" y="1" width="4" height="14" rx="1.2" /><rect x="9" y="1" width="4" height="14" rx="1.2" /></svg>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* what is playing + the rail */}
        <div className="relative mt-7 grid gap-7 md:mt-9 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-12">
          <div key={reel.slug} className="stage-in flex items-start gap-4">
            <img src={reelIcon(reel.slug)} alt="" loading="lazy" width={56} height={56} className="h-12 w-12 shrink-0 rounded-[13px] md:h-14 md:w-14 md:rounded-[15px]" />
            <div className="min-w-0">
              <h3 className="m-0 text-[24px] font-bold leading-tight text-[#eef1ee] md:text-[28px]">{reel.name}</h3>
              <p className="m-0 mt-1.5 max-w-[56ch] text-[15px] leading-relaxed text-[#cfd6df]">{reel.line}</p>
              <p className="m-0 mt-2.5 text-[11px] uppercase tracking-[0.14em] text-steel">{reel.meta}</p>
            </div>
          </div>

          <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:max-w-[560px] md:flex-wrap md:justify-end md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {reels.map((r, i) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => go(i)}
                className={`relative flex shrink-0 snap-start items-center gap-2.5 overflow-hidden rounded-full py-2 pl-2 pr-4 text-[14px] ring-1 transition-colors duration-300 ${
                  i === active ? "bg-arctic/10 text-[#eef1ee] ring-arctic/30" : "text-steel ring-arctic/10 hover:text-arctic hover:ring-arctic/25"
                }`}
              >
                <img src={reelIcon(r.slug)} alt="" loading="lazy" width={26} height={26} className="h-[26px] w-[26px] rounded-[7px]" />
                {r.name}
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-arctic/10">
                  <span
                    ref={(e) => {
                      bars.current[i] = e;
                    }}
                    className="block h-full origin-left bg-arctic/80"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

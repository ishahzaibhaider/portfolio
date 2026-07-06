"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The scroll-scrubbed film. A tall section holds a sticky full-viewport
 * canvas; scroll progress through the section picks the frame. The drawn
 * frame chases the target with a short lerp so fast scrolls feel buttery
 * instead of strobing. Frames load in waves and the painter falls back to
 * the nearest loaded frame, so early scrubbing never shows a hole.
 *
 * With `auto`, the film starts playing by itself once its canvas is
 * pinned (10s, matching the source), and the first real scroll takes
 * over exactly where playback reached: the remaining scroll distance is
 * remapped onto the remaining film, so there is never a jump backward.
 */
interface FilmSectionProps {
  clip: "arrival" | "builder" | "closer";
  frames: number;
  heightVh: number;
  /** 0..1 horizontal focus kept in view when the cover crop cuts the frame */
  focalX?: number;
  /** load immediately instead of waiting for approach */
  eager?: boolean;
  /** play automatically when pinned; scroll picks up from the played point */
  auto?: boolean;
  /** which frame set small screens use; closer keeps the desktop film */
  mobileVariant?: "m" | "d";
  /** overlay progress shown to reduced-motion visitors */
  reducedProgress?: number;
  id?: string;
  overlay?: (progress: number) => ReactNode;
}

const AUTO_SECONDS = 10;

export default function FilmSection({
  clip,
  frames,
  heightVh,
  focalX = 0.5,
  eager = false,
  auto = false,
  mobileVariant = "m",
  reducedProgress = 1,
  id,
  overlay,
}: FilmSectionProps) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const rootEl = root.current;
    const canvas = canvasRef.current;
    if (!rootEl || !canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const small = window.innerWidth <= 640;
    const variant = small ? mobileVariant : "d";
    const dprCap = small ? 1.25 : 1.5;

    const imgs: (HTMLImageElement | null)[] = new Array(frames).fill(null);
    let drawn = -1;
    let displayed = 0;
    let raf = 0;
    let started = false;
    let disposed = false;

    // scrub state
    let scrollP = 0;
    let lastScrollP = -1;
    // autoplay state
    let playing = false;
    let autoP = 0;
    let anchored = false;
    let anchorScroll = 0;
    let anchorAuto = 0;
    let graceTimer = 0;
    let lastSet = -1;
    let lastTs = 0;

    const src = (i: number) =>
      `/film/${clip}/${variant}/${String(i + 1).padStart(3, "0")}.webp`;

    const nearestLoaded = (i: number) => {
      if (imgs[i]) return i;
      for (let d = 1; d < frames; d++) {
        if (imgs[i - d]) return i - d;
        if (imgs[i + d]) return i + d;
      }
      return -1;
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      drawn = -1;
    };

    const paint = (i: number) => {
      const idx = nearestLoaded(Math.max(0, Math.min(frames - 1, i)));
      if (idx < 0 || idx === drawn) return;
      drawn = idx;
      const img = imgs[idx]!;
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      const dx = Math.min(0, Math.max(cw - dw, -(dw - cw) * focalX));
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const load = (i: number, onload?: () => void) => {
      if (imgs[i] || i < 0 || i >= frames) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        imgs[i] = img;
        onload?.();
      };
      img.src = src(i);
    };

    const start = () => {
      if (started) return;
      started = true;
      load(0, () => {
        drawn = -1;
      });
      load(frames - 1);
      for (let i = 0; i < frames; i += 10) load(i);
      let next = 0;
      const trickle = () => {
        if (disposed) return;
        let dispatched = 0;
        while (next < frames && dispatched < 6) {
          if (!imgs[next]) {
            load(next, () => {
              drawn = -1;
            });
            dispatched++;
          }
          next++;
        }
        if (next < frames) window.setTimeout(trickle, 90);
      };
      trickle();
    };

    /** where the film actually is, given scroll and any autoplay handoff */
    const effective = (s: number) => {
      if (!anchored) return Math.max(s, autoP);
      if (s >= anchorScroll) {
        const denom = 1 - anchorScroll;
        return denom > 0
          ? anchorAuto + ((s - anchorScroll) * (1 - anchorAuto)) / denom
          : anchorAuto;
      }
      return anchorScroll > 0 ? (s * anchorAuto) / anchorScroll : anchorAuto;
    };

    const measure = () => {
      const rect = rootEl.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      scrollP = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      const pinned = rect.top <= 2 && rect.bottom >= window.innerHeight - 2;

      // the first real scroll while playing hands control to the scrollbar
      if (playing && lastScrollP >= 0 && Math.abs(scrollP - lastScrollP) > 0.002) {
        anchored = true;
        anchorScroll = scrollP;
        anchorAuto = autoP;
        playing = false;
      }
      lastScrollP = scrollP;

      if (auto && !reduce && !playing && !anchored && autoP < 1) {
        if (pinned && !graceTimer) {
          graceTimer = window.setTimeout(() => {
            graceTimer = 0;
            if (disposed || anchored) return;
            autoP = Math.max(autoP, scrollP);
            lastScrollP = scrollP;
            playing = true;
            start();
          }, 350);
        } else if (!pinned && graceTimer) {
          window.clearTimeout(graceTimer);
          graceTimer = 0;
        }
      }
    };

    size();
    measure();
    if (eager) start();

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "120% 0px" }
    );
    io.observe(rootEl);

    if (reduce) {
      setProgress(reducedProgress);
      start();
      const waitLast = () => {
        if (disposed) return;
        if (imgs[frames - 1]) paint(frames - 1);
        else window.setTimeout(waitLast, 120);
      };
      waitLast();
      const onResizeR = () => {
        size();
        paint(frames - 1);
      };
      window.addEventListener("resize", onResizeR);
      return () => {
        disposed = true;
        io.disconnect();
        window.removeEventListener("resize", onResizeR);
      };
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          measure();
        });
      }
    };
    const onResize = () => {
      size();
      measure();
      drawn = -1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const loop = (ts: number) => {
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.08) : 0;
      lastTs = ts;
      if (playing) autoP = Math.min(1, autoP + dt / AUTO_SECONDS);
      const eff = effective(scrollP);
      displayed += (eff - displayed) * 0.38;
      if (Math.abs(eff - displayed) < 0.0004) displayed = eff;
      paint(Math.round(displayed * (frames - 1)));
      if (Math.abs(eff - lastSet) > 0.002 || (eff !== lastSet && (eff === 0 || eff === 1))) {
        lastSet = eff;
        setProgress(eff);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (graceTimer) window.clearTimeout(graceTimer);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [clip, frames, focalX, eager, auto, mobileVariant, reducedProgress]);

  return (
    <section ref={root} id={id} style={{ height: `${heightVh}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-deep">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {/* film treatment: vignette + grain so type sits into the image */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_58%,rgba(2,6,12,0.55)_100%)]"
        />
        <div aria-hidden className="film-grain pointer-events-none absolute inset-0" />
        {overlay?.(progress)}
      </div>
    </section>
  );
}

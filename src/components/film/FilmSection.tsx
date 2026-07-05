"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The scroll-scrubbed film. A tall section holds a sticky full-viewport
 * canvas; scroll progress through the section picks the frame. The drawn
 * frame index chases the target with a short lerp so fast scrolls feel
 * buttery instead of strobing. Frames load in waves (first, then every
 * tenth, then the rest) and the painter falls back to the nearest loaded
 * frame, so early scrubbing never shows a hole.
 */
interface FilmSectionProps {
  clip: "arrival" | "builder" | "closer";
  frames: number;
  heightVh: number;
  /** 0..1 horizontal focus kept in view when the cover crop cuts 16:9 */
  focalX?: number;
  /** load immediately instead of waiting for approach */
  eager?: boolean;
  id?: string;
  overlay?: (progress: number) => ReactNode;
}

export default function FilmSection({
  clip,
  frames,
  heightVh,
  focalX = 0.5,
  eager = false,
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
    const variant = small ? "m" : "d";
    const dprCap = small ? 1.25 : 1.5;

    const imgs: (HTMLImageElement | null)[] = new Array(frames).fill(null);
    let drawn = -1;
    let displayed = 0;
    let target = 0;
    let raf = 0;
    let started = false;
    let disposed = false;

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
      const idx = nearestLoaded(i);
      if (idx < 0) return;
      const img = imgs[idx]!;
      if (idx === drawn) return;
      drawn = idx;
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
      // wave 1: the poster; wave 2: keyframes; wave 3: everything
      load(0, () => paint(Math.round(target * (frames - 1))));
      load(frames - 1);
      for (let i = 0; i < frames; i += 10) load(i);
      let next = 0;
      const trickle = () => {
        if (disposed) return;
        let dispatched = 0;
        while (next < frames && dispatched < 6) {
          if (!imgs[next]) {
            load(next, () => {
              drawn = -1; // let a better frame repaint
            });
            dispatched++;
          }
          next++;
        }
        if (next < frames) window.setTimeout(trickle, 90);
      };
      trickle();
    };

    const measure = () => {
      const rect = rootEl.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      target = p;
      setProgress(p);
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
      // no scrubbing: hold the settled final frame
      target = 1;
      setProgress(1);
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
      paint(Math.round(displayed * (frames - 1)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const loop = () => {
      displayed += (target - displayed) * 0.38;
      if (Math.abs(target - displayed) < 0.0004) displayed = target;
      paint(Math.round(displayed * (frames - 1)));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [clip, frames, focalX, eager]);

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

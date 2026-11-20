"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/**
 * One product film. Films are code, not video: an iframe of the film page (~0.6 MB) whose clock we drive
 * from here, so every place a film appears (the stage, a grid card, the full-screen view) can play, pause
 * and seek it the same way. Until `live` is set only the film's own first frame is shown, as a poster.
 */
export const FILM_DUR = 14;
export type FilmHandle = { seek: (t: number) => void; restart: () => void };

type Props = {
  slug: string;
  /** the 4:5 cut (phones, tall cards) instead of 16:9 */
  tall: boolean;
  live: boolean;
  playing: boolean;
  onTime?: (t: number) => void;
  onEnded?: () => void;
  onReady?: () => void;
  /** must position the film (relative with a size, or absolute inset-0) */
  className?: string;
  title?: string;
};

type FilmWindow = Window & { seek?: (t: number) => void };

const Film = forwardRef<FilmHandle, Props>(function Film({ slug, tall, live, playing, onTime, onEnded, onReady, className = "", title }, ref) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const t = useRef(0);
  const ended = useRef(false);
  const cb = useRef({ onTime, onEnded, onReady });
  cb.current = { onTime, onEnded, onReady };
  const fmt = tall ? "4x5" : "16x9";

  useEffect(() => {
    setReady(false);
    t.current = 0;
    ended.current = false;
  }, [slug, fmt, live]);

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || e.data?.reel !== "ready") return;
      setReady(true);
      cb.current.onReady?.();
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);

  const show = (x: number) => {
    const w = frame.current?.contentWindow as FilmWindow | null | undefined;
    w?.seek?.(Math.min(FILM_DUR - 0.001, Math.max(0, x)));
    cb.current.onTime?.(x);
  };

  useImperativeHandle(ref, () => ({
    seek: (x) => { t.current = Math.min(FILM_DUR, Math.max(0, x)); ended.current = false; show(t.current); },
    restart: () => { t.current = 0; ended.current = false; show(0); },
  }), []);

  useEffect(() => {
    if (!ready || !playing) return;
    let raf = 0, last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      if (!ended.current) {
        t.current += dt;
        if (t.current >= FILM_DUR) {
          t.current = FILM_DUR;
          ended.current = true;
          show(FILM_DUR);
          cb.current.onEnded?.();
        } else show(t.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, playing]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <img src={`/reels/${slug}-${fmt}.webp`} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {live && (
        <iframe
          key={`${slug}-${fmt}`}
          ref={frame}
          src={`/reels/${slug}/film/index.html?fmt=${fmt}&scrub`}
          title={title ?? `${slug}: product film`}
          tabIndex={-1}
          className={`pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
});

export default Film;

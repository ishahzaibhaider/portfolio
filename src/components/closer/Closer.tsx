"use client";
import { useEffect, useRef, useState } from "react";
import { LinkedinLogo, FileArrowDown, EnvelopeSimple } from "@phosphor-icons/react";
import atlas from "../../data/atlas.json";
import { contact } from "../../data/climb";

/**
 * The close. Every screen from the opening comes back: scrolling in gathers them from the dark into a
 * slow ring of light, and the ask sits in the middle of it. Same atlas, same canvas grammar as the sky.
 */
type Tile = { app: string; kind: "phone" | "wide"; s: number[]; l: number[] };
const TILES = (atlas.tiles as Tile[]).filter((t) => t.kind === "phone");
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export default function Closer() {
  const root = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const canvas = cv.current!, sec = root.current!, ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    let raf = 0, W = 0, H = 0, dpr = 1, near = false, shown = 0, last = 0;
    const rnd = (() => { let a = 99; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
    const seeds = TILES.map(() => ({ a: rnd() * Math.PI * 2, sx: rnd(), sy: rnd(), r: 0.82 + rnd() * 0.36, d: rnd() * 0.5 }));
    const size = () => {
      W = canvas.clientWidth; H = canvas.clientHeight; dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    };
    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near && !img.src) img.src = "/sky/atlas-l.webp";
    }, { rootMargin: "50% 0px" });
    io.observe(sec);
    size();
    window.addEventListener("resize", size);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!near || !img.complete || !img.naturalWidth) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const r = sec.getBoundingClientRect();
      const target = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height * 0.35));
      shown += (target - shown) * (reduce ? 1 : 1 - Math.exp(-dt * 6));
      setP((o) => (Math.abs(o - shown) > 0.004 ? shown : o));
      const gather = clamp((shown - 0.15) / 0.5);
      const t = now / 1000;
      const small = W < 768;
      const cx = W / 2, cy = H * (small ? 0.5 : 0.47), RX = Math.min(W * (small ? 0.7 : 0.44), 760), RY = Math.min(RX * (small ? 1.05 : 0.5), H * 0.42);
      const tw = small ? 26 : 38;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const items = TILES.map((T, i) => {
        const s = seeds[i];
        const ang = s.a + t * (reduce ? 0 : 0.06);
        const depth = Math.sin(ang); // -1 back … 1 front
        const rx = cx + Math.cos(ang) * RX * s.r, ry = cy + depth * RY * s.r;
        const e = 1 - Math.pow(1 - clamp((gather - s.d * 0.6) / 0.6), 3);
        const x = s.sx * W + (rx - s.sx * W) * e, y = s.sy * H + (ry - s.sy * H) * e;
        const k = (0.55 + 0.45 * (depth + 1) / 2) * (0.35 + 0.65 * e);
        return { T, x, y, k, depth, a: (0.25 + 0.75 * (depth + 1) / 2) * (0.3 + 0.7 * e) };
      }).sort((a, b) => a.depth - b.depth);
      for (const it of items) {
        const w = tw * it.k, h = w * 2.17, L = it.T.l;
        ctx.globalAlpha = it.a;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(img, L[0], L[1], L[2], L[3], it.x - w / 2, it.y - h / 2, w, h);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", size); };
  }, []);

  const k = clamp((p - 0.35) / 0.3);
  return (
    <section ref={root} id="contact" className="relative h-[160vh] bg-[#050b14]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(70%_60%_at_50%_50%,#0e2133_0%,#050b14_75%)]">
        <canvas ref={cv} className="absolute inset-0 h-full w-full" />
        {/* a pool of dark under the ask, so the ring never fights the type */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side_at_50%_50%,rgba(5,11,20,0.92)_0%,rgba(5,11,20,0.75)_55%,rgba(5,11,20,0)_100%)] [background-size:min(100%,1000px)_min(80%,640px)] bg-center bg-no-repeat" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[var(--g)] text-center" style={{ opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
          <p className="m-0 mb-4 text-[12px] uppercase tracking-[0.24em] text-arctic/75 md:text-[13px]">Seventy shipped · yours is next</p>
          <h2 className="m-0 max-w-[13ch] font-bold leading-[0.98] text-[#f4f6f3] [text-shadow:0_6px_40px_rgba(2,6,12,0.9)] text-[clamp(44px,8vw,112px)]">
            Have something to build?
          </h2>
          <p className="m-0 mt-5 max-w-[44ch] text-[15.5px] leading-relaxed text-[#cfd6df] [text-shadow:0_2px_18px_rgba(2,6,12,0.95)] md:text-[17px]">
            Tell me what needs to exist. If it can be built, you will get a working version faster than you expect.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3" style={{ pointerEvents: k > 0.6 ? "auto" : "none" }}>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 rounded-full bg-arctic px-6 py-3.5 text-[15px] font-bold text-deep shadow-[0_16px_44px_rgba(2,6,12,0.5)] transition-transform duration-300 hover:-translate-y-[3px]">
              <EnvelopeSimple size={18} weight="bold" /> Start a project
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-deep/50 px-5 py-3.5 text-[15px] text-arctic ring-1 ring-arctic/30 backdrop-blur-md transition-colors hover:ring-arctic">
              <LinkedinLogo size={18} /> LinkedIn
            </a>
            <a href={contact.resume} download className="inline-flex items-center gap-2 rounded-full bg-deep/50 px-5 py-3.5 text-[15px] text-arctic ring-1 ring-arctic/30 backdrop-blur-md transition-colors hover:ring-arctic">
              <FileArrowDown size={18} /> Resume
            </a>
          </div>
          <p className="m-0 mt-5 text-[13.5px] text-arctic/70">{contact.email}</p>
        </div>
      </div>
    </section>
  );
}

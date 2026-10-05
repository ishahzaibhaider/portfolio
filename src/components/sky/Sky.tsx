"use client";
import { useEffect, useRef, useState } from "react";
import atlas from "../../data/atlas.json";
import { chapterIds } from "../../data/reels";
import { goTo } from "../../smooth";

/**
 * The opening and the wall, one canvas, one idea: every light in this sky is a real screen from a
 * product he shipped (140 captures from 12 apps, packed in /sky/atlas-*.webp).
 *
 *   arrival   the screens fade in as stars, then fly into his name (on its own clock, so the name is
 *             there the moment the page loads, and stays there when you scroll back up)
 *   scroll    the name breaks apart; 140 of its tiles tilt and land on an isometric wall, one cluster
 *             per app; the rest drift off as stars
 *   explore   the wall drifts; drag it, hover an app to light it up, click to jump to its chapter
 *   dive      the camera falls into the wall and hands over to the first chapter
 *
 * Planes are orthographic (2D affine matrices), so every tile is one setTransform + drawImage.
 */

type Tile = { app: string; kind: "phone" | "wide"; s: number[]; l: number[] };
const TILES = atlas.tiles as Tile[];
const APPS = atlas.apps as { id: string; name: string }[];
const PHONE = TILES.map((t, i) => [t, i] as const).filter(([t]) => t.kind === "phone").map(([, i]) => i);

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeOut = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)); // expo: lands softly
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const mulberry = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const DEG = Math.PI / 180;
/** orthographic basis: rotate rz in-plane, then tilt rx back (screen y down) */
function basis(rx: number, rz: number) {
  const cx = Math.cos(rx * DEG), cz = Math.cos(rz * DEG), sz = Math.sin(rz * DEG);
  return { a: cz, b: sz * cx, c: -sz, d: cz * cx };
}

// phases of the section's scroll progress
const P_BREAK = 0.07, P_WALL = 0.36, P_DIVE = 0.86;

export default function Sky() {
  const root = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ app: string; name: string; x: number; y: number } | null>(null);
  const [prog, setProg] = useState(0);
  const [intro, setIntro] = useState(0);

  useEffect(() => {
    const canvas = cv.current!, sec = root.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const S = new Image(), Lg = new Image();
    let lgReady = false;
    S.src = "/sky/atlas-s.webp";
    S.decoding = "async";
    let disposed = false, raf = 0;
    let W = 0, H = 0, dpr = 1, small = false;

    // ---------------- layout (recomputed on resize)
    type Inst = { ti: number; sx: number; sy: number; ss: number; tw: number; nx: number; ny: number; nw: number; wall: number; delay: number; out: [number, number] };
    let inst: Inst[] = [];
    let slots: { x: number; y: number; w: number; h: number; app: string; ti: number }[] = [];
    let clusters: { app: string; name: string; x: number; y: number; w: number }[] = [];
    let wallW = 0, wallH = 0;
    let nameL: { text: string; x: number; y: number }[] = [], nameFs = 100;

    const build = async () => {
      W = window.innerWidth; H = window.innerHeight; small = W < 768;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      await document.fonts.load('800 200px "Bricolage Grotesque Variable"').catch(() => 0);

      // the wall: one cluster of columns per app, R rows each
      const R = small ? 4 : 5, cw = 120, ch = 261, g = 24, gapApp = 70;
      slots = []; clusters = [];
      let x = 0;
      for (const a of APPS) {
        const mine = TILES.map((t, i) => [t, i] as const).filter(([t]) => t.app === a.id);
        if (!mine.length) continue;
        const cols = Math.ceil(mine.length / R);
        clusters.push({ app: a.id, name: a.name, x, y: -64, w: cols * (cw + g) - g });
        mine.forEach(([t, i], k) => {
          const col = Math.floor(k / R), row = k % R;
          const cx = x + col * (cw + g), cy = row * (ch + g);
          if (t.kind === "wide") slots.push({ x: cx - 18, y: cy + ch / 2 - 49, w: cw + 36, h: 98, app: a.id, ti: i });
          else slots.push({ x: cx, y: cy, w: cw, h: ch, app: a.id, ti: i });
        });
        x += cols * (cw + g) - g + gapApp;
      }
      wallW = x - gapApp; wallH = R * (ch + g) - g;

      // the name, sampled from real type: each sample point becomes a tile
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d")!;
      const lines = ["SHAHZAIB", "RIZVI"];
      let fs = 100;
      o.font = `800 ${fs}px "Bricolage Grotesque Variable"`;
      const wide = Math.max(...lines.map((l) => o.measureText(l).width));
      fs = Math.min((W * (small ? 0.92 : 0.74)) / (wide / 100), (H * (small ? 0.3 : 0.5)) / 2 / 0.78);
      o.font = `800 ${fs}px "Bricolage Grotesque Variable"`;
      o.textBaseline = "alphabetic";
      o.fillStyle = "#fff";
      const lh = fs * 0.86, top = H * (small ? 0.36 : 0.44) - lh + fs * 0.36;
      nameFs = fs;
      nameL = lines.map((l, i) => ({ text: l, x: (W - o.measureText(l).width) / 2, y: top + i * lh }));
      nameL.forEach((n) => o.fillText(n.text, n.x, n.y));
      const data = o.getImageData(0, 0, W, H).data;
      const tw = Math.max(2.6, fs / (small ? 21 : 26)), th = tw * 2.17, dx = tw * 1.2, dy = th * 1.07;
      const pts: [number, number][] = [];
      for (let y = 0; y < H; y += dy) for (let xx = 0; xx < W; xx += dx) {
        const sx = Math.round(xx + dx / 2), sy = Math.round(y + dy / 2);
        if (data[(sy * W + sx) * 4 + 3] > 128) pts.push([sx, sy]);
      }
      // every name tile is a real screen; 140 of them (spread across the letters) are the wall's own screens
      const rnd = mulberry(7);
      const step = Math.max(1, pts.length / slots.length);
      const wallOf = new Map<number, number>();
      slots.forEach((_, j) => wallOf.set(Math.min(pts.length - 1, Math.floor(j * step)), j));
      inst = pts.map(([nx, ny], i) => {
        const wall = wallOf.has(i) ? wallOf.get(i)! : -1;
        const ti = wall >= 0 ? slots[wall].ti : PHONE[Math.floor(rnd() * PHONE.length)];
        const ang = rnd() * Math.PI * 2, far = 0.6 + rnd() * 0.8;
        return {
          ti, wall, nx, ny, nw: tw,
          sx: rnd() * W, sy: rnd() * H * 0.92, ss: 1.6 + rnd() * 2.6, tw: rnd() * 6.28,
          delay: (nx / W) * 0.55 + rnd() * 0.25,
          out: [Math.cos(ang) * W * far, Math.sin(ang) * H * far],
        };
      });
    };

    // ---------------- interaction
    let progT = 0, progShown = 0, introT = reduce ? 1 : 0;
    const t0 = performance.now();
    let pan = 0, vel = 0, drag = false, lastX = 0, moved = 0;
    let mouse: { x: number; y: number } | null = null, hoverApp: string | null = null;
    const wallOn = () => progShown > P_WALL - 0.04 && progShown < P_DIVE;

    const camera = (p: number) => {
      // wall plane transform at progress p (after the landing)
      const k0 = small ? 0.5 : 0.62;
      const dive = easeInOut(span(p, P_DIVE, 1));
      const k = k0 * (1 + (span(p, P_WALL, P_DIVE) * 0.12)) * (1 + dive * 2.4);
      const B = basis(52, -34);
      const drift = (p - P_WALL) * (small ? 900 : 1500);
      // the camera tracks along the wall as you scroll, plus the visitor's drag
      const cx = wallW * 0.14 + drift + pan, cy = wallH / 2;
      const ox = W * (small ? 0.5 : 0.56), oy = H * 0.56;
      return { B, k, cx, cy, ox, oy };
    };
    const projW = (cam: ReturnType<typeof camera>, x: number, y: number) => {
      const { B, k, cx, cy, ox, oy } = cam;
      const lx = x - cx, ly = y - cy;
      return [ox + k * (B.a * lx + B.c * ly), oy + k * (B.b * lx + B.d * ly)] as const;
    };
    const unproj = (cam: ReturnType<typeof camera>, sx: number, sy: number) => {
      const { B, k, cx, cy, ox, oy } = cam;
      const X = (sx - ox) / k, Y = (sy - oy) / k, det = B.a * B.d - B.b * B.c;
      return [cx + (B.d * X - B.c * Y) / det, cy + (-B.b * X + B.a * Y) / det] as const;
    };

    const onDown = (e: PointerEvent) => {
      if (!wallOn()) return;
      drag = true; lastX = e.clientX; moved = 0; vel = 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (drag) {
        const d = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(d);
        const k = camera(progShown).k;
        pan -= d / k / 0.85; vel = -d / k / 0.85;
      }
    };
    const onUp = () => { drag = false; };
    const onLeave = () => { mouse = null; drag = false; };
    const onClick = () => {
      if (moved > 6 || !hoverApp) return;
      goTo(chapterIds.includes(hoverApp) ? `chapter-${hoverApp}` : "more-work");
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    const measure = () => {
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progT = total > 0 ? clamp(-r.top / total) : 0;
    };
    window.addEventListener("scroll", measure, { passive: true });
    const onResize = () => { build().then(measure); };
    window.addEventListener("resize", onResize);

    // ---------------- paint
    let lastNow = 0;
    const draw = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(draw);
      const dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 0.016;
      lastNow = now;
      if (!S.complete || !inst.length) return;
      if (!lgReady && Lg.complete && Lg.naturalWidth) lgReady = true;
      const t = (now - t0) / 1000;
      introT = reduce ? 1 : clamp((t - 0.25) / 3.0);
      progShown += (progT - progShown) * (reduce ? 1 : 1 - Math.exp(-dt * 9));
      if (Math.abs(progT - progShown) < 1e-4) progShown = progT;
      const p = progShown;
      if (!drag) { pan += vel * dt * 60; vel *= Math.exp(-dt * 5); }
      pan = clamp(pan, -wallW * 0.1, wallW * 0.86);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cam = camera(p);
      const brk = span(p, P_BREAK, P_WALL), dive = span(p, P_DIVE, 1);

      // hover: which app is under the pointer on the wall
      hoverApp = null;
      if (mouse && wallOn() && brk >= 1) {
        const [lx, ly] = unproj(cam, mouse.x, mouse.y);
        const s = slots.find((q) => lx >= q.x - 12 && lx <= q.x + q.w + 12 && ly >= q.y - 12 && ly <= q.y + q.h + 12);
        hoverApp = s ? s.app : null;
      }

      for (let i = 0; i < inst.length; i++) {
        const q = inst[i], T = TILES[q.ti];
        // arrival: star → name
        const a = easeOut(clamp((introT - q.delay * 0.55) / 0.45));
        const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + q.tw);
        const sw = q.ss;
        let x = q.sx + (q.nx - q.sx) * a, y = q.sy + (q.ny - q.sy) * a;
        let w = sw + (q.nw - sw) * a;
        const crisp = clamp((introT - 0.82) / 0.18) * (1 - clamp(brk * 4));
        let alpha = (0.35 + 0.65 * a) * (a < 1 ? 0.6 + 0.4 * tw : 1) * clamp(introT * 4) * (1 - 0.62 * crisp);
        // gentle breathing while the name holds
        y += Math.sin(t * 0.8 + q.nx * 0.01) * 1.2 * a;
        let m = [w, 0, 0, w * 2.17, x - w / 2, y - (w * 2.17) / 2]; // flat tile: a,b,c,d,e,f (unit square → tile)
        if (brk > 0) {
          const u = easeInOut(clamp((brk - q.delay * 0.35) / 0.65));
          if (q.wall >= 0) {
            const sl = slots[q.wall];
            const [ex, ey] = projW(cam, sl.x, sl.y);
            const { B, k } = cam;
            const target = [B.a * k * sl.w, B.b * k * sl.w, B.c * k * sl.h, B.d * k * sl.h, ex, ey];
            m = m.map((v, j) => v + (target[j] - v) * u);
            const dim = hoverApp && sl.app !== hoverApp ? 0.22 : 1;
            alpha = alpha + (dim - alpha) * u;
          } else {
            m[4] += q.out[0] * u; m[5] += q.out[1] * u;
            alpha *= 1 - u;
          }
        }
        if (dive > 0) alpha *= 1 - easeInOut(dive) * (q.wall >= 0 ? 1 : 1);
        if (alpha < 0.01) continue;
        const onScreenW = Math.hypot(m[0], m[1]) * dpr;
        const useL = lgReady && onScreenW > 34;
        const r = useL ? T.l : T.s;
        ctx.globalAlpha = alpha;
        ctx.setTransform(m[0] * dpr / r[2], m[1] * dpr / r[2], m[2] * dpr / r[3], m[3] * dpr / r[3], m[4] * dpr, m[5] * dpr);
        ctx.drawImage(useL ? Lg : S, r[0], r[1], r[2], r[3], 0, 0, r[2], r[3]);
      }

      // his name in real type, over its own tiles
      const crispName = clamp((introT - 0.82) / 0.18) * (1 - clamp(brk * 4));
      if (crispName > 0.01) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalAlpha = crispName;
        ctx.font = `800 ${nameFs}px "Bricolage Grotesque Variable"`;
        ctx.textBaseline = "alphabetic";
        ctx.shadowColor = "rgba(116,198,157,0.35)";
        ctx.shadowBlur = 40;
        ctx.fillStyle = "#f4f6f3";
        for (const n of nameL) ctx.fillText(n.text, n.x, n.y + (1 - crispName) * 10);
        ctx.shadowBlur = 0;
      }

      // app names on the wall, along the top edge of each cluster
      if (brk > 0.85 && dive < 1) {
        const { B, k } = cam;
        ctx.globalAlpha = clamp((brk - 0.85) / 0.15) * (1 - dive);
        ctx.fillStyle = "#e0e1dd";
        ctx.font = `700 ${Math.round(44 * dpr)}px "Bricolage Grotesque Variable"`;
        for (const c of clusters) {
          const [ex, ey] = projW(cam, c.x, c.y);
          ctx.globalAlpha = clamp((brk - 0.85) / 0.15) * (1 - dive) * (hoverApp && c.app !== hoverApp ? 0.3 : 0.9);
          ctx.setTransform(B.a * k, B.b * k, B.c * k, B.d * k, ex * dpr, ey * dpr);
          ctx.fillText(c.name, 0, 0);
        }
      }
      ctx.globalAlpha = 1;

      setProg((old) => (Math.abs(old - p) > 0.003 ? p : old));
      setIntro((old) => (old !== introT && (introT === 1 || Math.abs(old - introT) > 0.02) ? introT : old));
      setHover((old) => {
        if (!hoverApp || !mouse) return old ? null : old;
        if (old && old.app === hoverApp && Math.abs(old.x - mouse.x) < 2 && Math.abs(old.y - mouse.y) < 2) return old;
        return { app: hoverApp, name: APPS.find((x) => x.id === hoverApp)!.name, x: mouse.x, y: mouse.y };
      });
      canvas.style.cursor = hoverApp ? (drag ? "grabbing" : "pointer") : wallOn() ? "grab" : "default";
    };

    build().then(() => {
      measure();
      raf = requestAnimationFrame(draw);
      // the wall's sharp sheet loads once the page is idle
      const load = () => (Lg.src = "/sky/atlas-l.webp");
      "requestIdleCallback" in window ? (window as any).requestIdleCallback(load) : setTimeout(load, 800);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const nameOut = span(prog, P_BREAK * 0.6, P_BREAK + 0.06);
  const wallIn = span(prog, P_WALL - 0.02, P_WALL + 0.06) * (1 - span(prog, P_DIVE, P_DIVE + 0.06));

  return (
    <section ref={root} id="top" className="relative h-[460vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#0f2236_0%,#081322_45%,#050b14_100%)]">
        {/* aurora + horizon glow: the night world he chose, drawn in CSS so it costs nothing */}
        <div aria-hidden className="pointer-events-none absolute inset-x-[-10%] top-[8%] h-[38%] opacity-[0.22] blur-[60px] bg-[radial-gradient(40%_60%_at_30%_50%,#74c69d_0%,transparent_70%),radial-gradient(35%_50%_at_70%_40%,#415a77_0%,transparent_70%)]" />
        <canvas ref={cv} className="absolute inset-0 h-full w-full touch-pan-y" />

        {/* arrival copy */}
        <div className="pointer-events-none absolute inset-x-[var(--g)] top-[15vh] text-center" style={{ opacity: Math.min(intro * 1.4, 1) * (1 - nameOut) }}>
          <p className="m-0 text-[12px] uppercase tracking-[0.26em] text-arctic/80 md:text-[13px]">AI engineer · product builder · Islamabad</p>
        </div>
        <div className="pointer-events-none absolute inset-x-[var(--g)] bottom-[13vh] text-center" style={{ opacity: span(intro, 0.75, 1) * (1 - nameOut) }}>
          <p className="mx-auto m-0 max-w-[40ch] text-[16px] leading-relaxed text-[#cfd6df] md:text-[19px]">
            Seventy products shipped. Every light in this sky is a real screen from one of them.
          </p>
          <p className="m-0 mt-6 text-[11.5px] uppercase tracking-[0.24em] text-steel">Scroll</p>
        </div>

        {/* the wall's copy, on a soft scrim so the screens never fight the type */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,20,0.92)_0%,rgba(5,11,20,0.6)_26%,rgba(5,11,20,0)_42%)] md:bg-[linear-gradient(90deg,rgba(5,11,20,0.94)_0%,rgba(5,11,20,0.7)_24%,rgba(5,11,20,0)_46%)]" style={{ opacity: wallIn }} />
        {/* the wall's copy */}
        <div className="pointer-events-none absolute left-[var(--g)] right-[var(--g)] top-[15vh] md:right-auto" style={{ opacity: wallIn, transform: `translateY(${(1 - wallIn) * 16}px)` }}>
          <p className="m-0 mb-3 text-[12px] uppercase tracking-[0.22em] text-steel">The work · 2021 to 2026</p>
          <h2 className="m-0 max-w-[16ch] font-bold leading-[1.02] text-[#eef1ee] text-[clamp(32px,4.4vw,58px)] [text-shadow:0_4px_30px_rgba(2,6,12,0.8)]">
            Twelve of the seventy, screen by screen.
          </h2>
          <p className="m-0 mt-4 inline-flex rounded-full bg-deep/60 px-4 py-2 text-[13px] text-arctic/90 ring-1 ring-arctic/15 backdrop-blur-sm">
            <span className="hidden md:inline">Drag the wall · hover an app · click to open it</span>
            <span className="md:hidden">Swipe the wall sideways · tap an app</span>
          </p>
        </div>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-full bg-arctic px-4 py-2 text-[14px] font-semibold text-deep shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
            style={{ left: hover.x, top: hover.y }}
          >
            {hover.name} {chapterIds.includes(hover.app) ? "· open →" : "· see it →"}
          </div>
        )}
      </div>
    </section>
  );
}

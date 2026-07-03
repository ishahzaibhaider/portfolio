"use client";
import { useEffect, useRef, useState } from "react";

/** Deterministic starfield, denser high in the sky and along the galaxy band. */
const STARS: Array<[number, number, number]> = [
  [3, 6, 0.5], [7, 12, 0.4], [11, 4, 0.6], [15, 18, 0.35], [19, 9, 0.5], [23, 15, 0.45], [27, 5, 0.6], [31, 11, 0.4],
  [35, 20, 0.5], [39, 7, 0.35], [43, 14, 0.55], [47, 3, 0.45], [51, 17, 0.4], [55, 9, 0.6], [59, 22, 0.35], [63, 6, 0.5],
  [67, 13, 0.45], [71, 4, 0.55], [75, 19, 0.4], [79, 10, 0.5], [83, 16, 0.6], [87, 7, 0.35], [91, 12, 0.5], [95, 5, 0.45],
  [9, 28, 0.3], [21, 33, 0.35], [33, 26, 0.3], [45, 31, 0.35], [57, 27, 0.3], [69, 34, 0.3], [81, 29, 0.35], [93, 25, 0.3],
  [5, 42, 0.25], [25, 46, 0.25], [49, 40, 0.28], [73, 44, 0.25], [89, 38, 0.28], [17, 52, 0.2], [61, 50, 0.22], [85, 55, 0.2],
  [12, 8, 0.55], [16, 6, 0.5], [20, 11, 0.45], [24, 8, 0.5], [28, 13, 0.4], [32, 9, 0.55], [36, 15, 0.4], [40, 11, 0.5],
];

const RIDGES = [
  { cls: "h-[66vh]", depth: 0.022, px: 4, fill: "#2a4463", d: "M0,330 L55,312 L120,265 L180,296 L250,220 L315,268 L385,190 L455,242 L525,165 L590,228 L665,135 L735,200 L800,158 L870,222 L940,172 L1010,246 L1080,192 L1150,260 L1220,212 L1290,278 L1355,248 L1440,298 L1440,660 L0,660 Z", vb: "0 0 1440 660" },
  { cls: "h-[58vh]", depth: 0.038, px: 6, fill: "#22395a", d: "M0,315 L68,292 L145,242 L215,278 L292,200 L368,252 L440,172 L512,226 L588,148 L662,212 L738,118 L812,186 L884,142 L956,206 L1030,158 L1102,230 L1176,178 L1250,246 L1322,198 L1440,262 L1440,580 L0,580 Z", vb: "0 0 1440 580" },
  { cls: "h-[50vh]", depth: 0.056, px: 9, fill: "#1c3049", d: "M0,295 L72,268 L152,214 L224,256 L304,178 L382,236 L455,162 L528,222 L606,138 L682,202 L752,168 L825,228 L905,152 L985,218 L1062,182 L1135,242 L1215,192 L1295,252 L1368,222 L1440,262 L1440,500 L0,500 Z", vb: "0 0 1440 500" },
  { cls: "h-[42vh]", depth: 0.078, px: 12, fill: "#152539", d: "M0,248 L82,222 L164,178 L244,212 L326,148 L406,198 L486,132 L566,182 L646,118 L726,172 L806,138 L886,192 L966,128 L1046,178 L1126,148 L1206,202 L1286,162 L1366,212 L1440,182 L1440,420 L0,420 Z", vb: "0 0 1440 420" },
  { cls: "h-[33vh]", depth: 0.104, px: 16, fill: "#101d2e", d: "M0,205 L92,182 L184,146 L274,176 L364,124 L452,162 L542,110 L630,152 L720,100 L808,146 L898,116 L986,160 L1076,126 L1164,166 L1254,136 L1342,172 L1440,150 L1440,330 L0,330 Z", vb: "0 0 1440 330" },
  { cls: "h-[24vh]", depth: 0.132, px: 20, fill: "#0b1626", d: "M0,152 L98,132 L196,104 L292,128 L390,88 L486,120 L582,80 L678,112 L774,72 L870,108 L966,84 L1062,120 L1158,92 L1254,124 L1350,100 L1440,118 L1440,240 L0,240 Z", vb: "0 0 1440 240" },
  { cls: "h-[16vh]", depth: 0.165, px: 26, fill: "#060f1b", d: "M0,102 L118,86 L236,64 L354,85 L472,56 L590,80 L708,50 L826,76 L944,46 L1062,72 L1180,54 L1298,80 L1440,64 L1440,170 L0,170 Z", vb: "0 0 1440 170" },
];

/* the sky paints first (stars alone), then the mountains rise back-to-front */
const riseDelay = ["delay-[1050ms]", "delay-[1200ms]", "delay-[1350ms]", "delay-[1500ms]", "delay-[1650ms]", "delay-[1800ms]", "delay-[1950ms]"];

export default function Scene() {
  const [on, setOn] = useState(false);
  const root = useRef<HTMLElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const starsBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setOn(true), reduce ? 0 : 200);
    if (reduce) return () => window.clearTimeout(t);

    let raf = 0;
    let tPX = 0, tPY = 0, cY = 0, cPX = 0, cPY = 0;
    const svgs = root.current
      ? Array.from(root.current.querySelectorAll<SVGElement>("[data-depth] svg"))
      : [];

    const onMove = (e: PointerEvent) => {
      tPX = (e.clientX / window.innerWidth - 0.5) * 2;
      tPY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const frame = () => {
      cY += ((window.scrollY || 0) - cY) * 0.1;
      cPX += (tPX - cPX) * 0.06;
      cPY += (tPY - cPY) * 0.06;
      svgs.forEach((svg) => {
        const holder = svg.parentElement!;
        const d = parseFloat(holder.dataset.depth!);
        const px = parseFloat(holder.dataset.px!);
        svg.style.transform = `translate(${-cPX * px}px, ${cY * d - cPY * px * 0.4}px)`;
      });
      if (moon.current) moon.current.style.transform = `translate(${cPX * 10}px, ${cY * 0.12 + cPY * 6}px)`;
      if (starsBox.current) starsBox.current.style.transform = `translate(${cPX * 5}px, ${cPY * 3}px)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const rise = (extra: string) =>
    `transition-all duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${extra} ${
      on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
    } motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none`;

  return (
    <section
      ref={root}
      aria-label="Night mountains under a moonlit sky"
      className={`relative h-[110vh] overflow-hidden bg-[linear-gradient(180deg,#04090f_0%,#081422_30%,#0d1b2a_55%,#13233a_80%,#16283e_100%)] ${on ? "scene-on" : ""}`}
    >
      {/* galaxy band */}
      <div aria-hidden className="pointer-events-none absolute -left-[18%] -top-[12%] h-[70%] w-[90%] rotate-[-16deg] bg-[radial-gradient(60%_34%_at_50%_50%,rgba(224,225,221,0.065)_0%,rgba(119,141,169,0.035)_45%,transparent_72%)]" />
      <div
        ref={starsBox}
        aria-hidden
        className={`absolute inset-0 will-change-transform transition-opacity duration-[1000ms] delay-[100ms] ${on ? "opacity-100" : "opacity-0"} motion-reduce:opacity-100`}
      >
        {STARS.map(([x, y, peak], i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              ["--peak" as string]: peak,
              animationDelay: `${(i % 13) * 0.42}s`,
              ...(i % 6 === 0 ? { width: 3, height: 3 } : {}),
            }}
          />
        ))}
      </div>
      <div aria-hidden className="shooting left-[68%] top-[16%] [animation-delay:7s]" />
      <div aria-hidden className="shooting left-[22%] top-[32%] !w-[90px] [animation-delay:16s]" />
      {/* aurora */}
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-[30%] left-[4%] h-[26%] w-[62%] skew-x-[-14deg] blur-[10px] transition-opacity duration-[4000ms] delay-[2200ms] bg-[radial-gradient(55%_42%_at_50%_55%,rgba(116,198,157,0.10)_0%,rgba(116,198,157,0.035)_48%,transparent_74%)] ${on ? "aurora-breathe opacity-100" : "opacity-0"} motion-reduce:opacity-100`}
      />
      {/* moon */}
      <div
        aria-hidden
        className={`absolute right-[15%] top-[13%] transition-all duration-[2200ms] delay-[2350ms] ease-out ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[14px]"} motion-reduce:opacity-100 motion-reduce:translate-y-0`}
      >
        <div
          ref={moon}
          className="h-16 w-16 rounded-full will-change-transform bg-[radial-gradient(circle_at_38%_34%,#f4f4ef_0%,#d9dcd4_58%,#c2c8bf_100%)] shadow-[0_0_44px_10px_rgba(224,225,221,0.26),0_0_140px_64px_rgba(224,225,221,0.09)]"
        />
      </div>

      {/* ridges */}
      {RIDGES.map((r, i) => (
        <div
          key={i}
          data-depth={r.depth}
          data-px={r.px}
          className={`pointer-events-none absolute inset-x-0 -bottom-[2px] ${r.cls} transition-all duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${riseDelay[i]} ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[46px]"} motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none`}
        >
          <svg viewBox={r.vb} preserveAspectRatio="none" className="block h-full w-full will-change-transform" aria-hidden>
            <path fill={r.fill} d={r.d} />
          </svg>
        </div>
      ))}

      {/* mist */}
      <div aria-hidden className={`mist mist-a bottom-[26vh] transition-opacity duration-[3000ms] delay-[2600ms] ${on ? "opacity-100" : "opacity-0"} motion-reduce:opacity-100`} />
      <div aria-hidden className={`mist mist-b bottom-[14vh] !h-[70px] transition-opacity duration-[3000ms] delay-[2800ms] ${on ? "opacity-100" : "opacity-0"} motion-reduce:opacity-100`} />

      {/* copy */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1140px] flex-col justify-center px-7">
        <p className={`m-0 mb-5 text-[12.5px] uppercase tracking-[0.22em] text-steel ${rise("delay-[2900ms]")}`}>
          Syed Shahzaib Haider Rizvi · AI engineer
        </p>
        <h1 className={`m-0 font-bold leading-[1.0] text-[#eef1ee] [text-shadow:0_2px_26px_rgba(4,9,15,0.7)] text-[clamp(48px,8.6vw,102px)] ${rise("delay-[3150ms]")}`}>
          Five years.
          <br />
          Seventy products.
        </h1>
        <p className={`mt-6 max-w-[47ch] text-[clamp(16.5px,2vw,20px)] leading-relaxed text-[#b9c3d2] ${rise("delay-[3550ms]")}`}>
          It started with one laptop in the most beautiful capital in the
          world. It became apps on the stores, platforms with real users, and
          agents that work while I sleep.{" "}
          <strong className="font-semibold text-[#eef1ee]">This site walks you through the climb.</strong>
        </p>
        <div className={`mt-9 ${rise("delay-[3950ms]")}`}>
          <a
            href="#journey"
            className="inline-block rounded-full bg-arctic px-[30px] py-3.5 text-base font-bold text-[#101c2b] shadow-[0_16px_44px_rgba(224,225,221,0.15)] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:shadow-[0_24px_60px_rgba(224,225,221,0.22)] active:translate-y-[-1px] active:scale-[0.985]"
          >
            Begin the climb
          </a>
        </div>
      </div>
    </section>
  );
}

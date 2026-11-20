"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { work, reelIcon, type Reel } from "../../data/reels";
import Film, { FILM_DUR } from "./Film";
import { openWork, useOpenWork, useSmall } from "./open";

/**
 * All the work on one page: every product is visible at rest, with its real first frame. On a laptop,
 * hovering a card plays its film inside the card; clicking opens it full-screen. On a phone each act is a
 * shelf you swipe. The visitor chooses what to watch; nothing is hidden behind scrolling.
 */
type Act = "all" | NonNullable<Reel["act"]>;
const ACTS: { id: Act; label: string; title: string }[] = [
  { id: "all", label: "All", title: "All" },
  { id: "apps", label: "Apps", title: "Apps in people's pockets" },
  { id: "platforms", label: "Platforms", title: "Platforms businesses run on" },
  { id: "ai", label: "AI and automation", title: "Software that works by itself" },
];

type Slot = "W" | "T" | "w";
/** a row is a few slots; W (16:9) and T (4:5) are sized so they come out the same height */
const PATTERNS: Slot[][] = [["W", "T"], ["w", "w", "w"], ["T", "T", "W"], ["T", "W"], ["w", "w", "w"], ["W", "T", "T"]];
const FR: Record<Slot, string> = { W: "2.2222fr", T: "1fr", w: "1fr" };
const wantsTall = (r: Reel) => r.device === "phone";

function layout(items: Reel[]) {
  const left = [...items];
  const rows: { slot: Slot; item: Reel | null }[][] = [];
  let p = 0;
  while (left.length) {
    let pat = PATTERNS[p++ % PATTERNS.length];
    if (left.length < pat.length) pat = left.length === 2 ? ["W", "T"] : ["W", "T"];
    rows.push(
      pat.map((slot) => {
        if (!left.length) return { slot, item: null };
        // prefer a phone film for a tall slot and a wide one for a wide slot, without straying far from the order
        const want = slot === "T";
        let k = left.slice(0, 4).findIndex((r) => wantsTall(r) === want);
        if (k < 0) k = 0;
        return { slot, item: left.splice(k, 1)[0] };
      }),
    );
  }
  return rows;
}

function Still({ r, tall }: { r: Reel; tall: boolean }) {
  const s = r.shots!;
  const bg = { background: `radial-gradient(90% 80% at 50% 0%, ${r.glow}55 0%, #0b1522 70%)` };
  if (s.cover) {
    return (
      <div className="absolute inset-0" style={bg}>
        <img src={s.cover} alt={`${r.name}, shown working`} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-left-top" />
        <span className="absolute bottom-3 left-3 rounded-[8px] bg-[rgba(6,14,24,0.78)] px-2.5 py-1.5 text-[12.5px] font-semibold text-mint backdrop-blur-md">See it working ↓</span>
      </div>
    );
  }
  if (!s.web && !s.phones) {
    return (
      <div className="absolute inset-0 flex flex-col justify-end p-[7%]" style={bg}>
        <span className="font-display text-[clamp(22px,2.2vw,32px)] font-bold leading-[1.05] text-[#f4f6f3]">{r.line.split(":")[0]}.</span>
        <span className="mt-3 text-[13px] font-semibold text-mint">See it working ↓</span>
      </div>
    );
  }
  if (s.web && (!tall || !s.phones)) {
    return (
      <div className="absolute inset-0 overflow-hidden" style={bg}>
        <div className={`absolute overflow-hidden rounded-t-[10px] bg-[#e9ecef] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)] ring-1 ring-black/20 ${tall ? "inset-x-[7%] top-[14%]" : "inset-x-[9%] top-[12%]"} bottom-0`}>
          <div className="flex h-5 items-center gap-1.5 bg-[#dfe3e8] px-2.5">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="h-[7px] w-[7px] rounded-full" style={{ background: c }} />)}
          </div>
          <img src={s.web} alt={`${r.name} on the web`} loading="lazy" className="block w-full" />
        </div>
      </div>
    );
  }
  const phones = s.phones!.slice(0, tall ? 2 : 3);
  return (
    <div className="absolute inset-0 flex items-start justify-center gap-[4%] overflow-hidden pt-[9%]" style={bg}>
      {phones.map((p, k) => (
        <img key={p} src={p} alt={`${r.name} screen`} loading="lazy"
          className={`rounded-[9%/4.2%] object-cover object-top ring-[4px] ring-[#0b0d10] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)] ${tall ? (phones.length > 1 ? "w-[40%]" : "w-[58%]") : "w-[24%]"} ${k % 2 ? "mt-[6%]" : ""}`}
          style={{ aspectRatio: "440 / 952" }} />
      ))}
    </div>
  );
}

function Card({ r, tall, hover, className = "" }: { r: Reel; tall: boolean; hover: boolean; className?: string }) {
  const [on, setOn] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);
  const t = useRef(0);
  const open = useOpenWork();
  const enter = () => { if (hover && !r.shots) t.current = window.setTimeout(() => setOn(true), 140); };
  const leave = () => { window.clearTimeout(t.current); setOn(false); if (bar.current) bar.current.style.transform = "scaleX(0)"; };
  useEffect(() => () => window.clearTimeout(t.current), []);
  const icon = r.shots ? r.shots.icon : reelIcon(r.slug);
  return (
    <button
      type="button"
      onClick={() => openWork(r.slug)}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className={`group block min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left ${className}`}
    >
      <div className={`relative overflow-hidden rounded-[18px] bg-[#0b1522] ring-1 ring-white/10 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.95)] ${tall ? "aspect-[4/5]" : "aspect-[16/9]"}`}>
        {r.shots ? <Still r={r} tall={tall} /> : (
          <Film slug={r.slug} tall={tall} live={on && !open} playing={on && !open} onTime={(x) => bar.current && (bar.current.style.transform = `scaleX(${Math.min(1, x / FILM_DUR)})`)} className="absolute inset-0" title={`${r.name}: product film`} />
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-transparent">
          <span ref={bar} className="block h-full origin-left scale-x-0 bg-mint" />
        </span>
        <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(6,14,24,0.72)] text-arctic opacity-0 ring-1 ring-white/15 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight size={16} weight="bold" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        {icon ? <img src={icon} alt="" loading="lazy" className="h-9 w-9 shrink-0 rounded-[10px]" /> : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] font-display text-[16px] font-bold text-white" style={{ background: r.glow }}>{r.name[0]}</span>
        )}
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate font-display text-[17px] font-bold leading-tight text-[#eef1ee]">{r.name}</span>
            {r.state && <span className="shrink-0 rounded-[6px] bg-[#f2b544]/15 px-1.5 py-[2px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#f2c56b]">{r.state}</span>}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-steel">{r.meta}</span>
        </span>
      </div>
    </button>
  );
}

export default function Grid() {
  const small = useSmall();
  const [act, setAct] = useState<Act>("all");
  const [hover, setHover] = useState(false);
  useEffect(() => setHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches), []);
  const items = useMemo(() => (act === "all" ? work : work.filter((r) => r.act === act)), [act]);
  const rows = useMemo(() => layout(items), [items]);
  const count = (a: Act) => (a === "all" ? work.length : work.filter((r) => r.act === a).length);

  return (
    <section id="work" className="relative bg-[linear-gradient(180deg,#060e18_0%,#08131f_40%,#060e18_100%)] py-[clamp(72px,11vh,130px)]">
      <div className="px-[var(--g)]">
        <p className="m-0 mb-3 text-[12px] uppercase tracking-[0.22em] text-steel md:text-[12.5px]">The work · 2021 to 2026</p>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h2 className="m-0 max-w-[15ch] font-bold leading-[1.02] text-[#eef1ee] text-[clamp(32px,4.6vw,64px)]">All of it, on one page.</h2>
          <p className="m-0 max-w-[36ch] pb-1.5 text-[15px] leading-relaxed text-[#b9c3d2] md:text-[16.5px]">
            <span className="hidden md:inline">Hover a card and its film plays. Click to open it full screen.</span>
            <span className="md:hidden">Swipe a shelf sideways. Tap a product to watch its film.</span>
          </p>
        </div>

        {/* laptop: choose what you are looking at */}
        <div role="tablist" aria-label="Filter the work" className="mt-9 hidden gap-7 border-b border-arctic/10 md:flex">
          {ACTS.map((a) => (
            <button key={a.id} type="button" role="tab" aria-selected={act === a.id} onClick={() => setAct(a.id)}
              className={`relative -mb-px cursor-pointer border-0 bg-transparent px-0 pb-3.5 text-[15px] transition-colors ${act === a.id ? "text-[#f4f6f3]" : "text-arctic/50 hover:text-arctic/80"}`}>
              {a.label} <span className="ml-1 text-[12px] tabular-nums text-steel">{count(a.id)}</span>
              <span className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-mint transition-transform duration-300 ${act === a.id ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>
      </div>

      {small ? (
        <div className="mt-9 space-y-10">
          {ACTS.slice(1).map((a) => {
            const mine = work.filter((r) => r.act === a.id);
            return (
              <div key={a.id}>
                <div className="flex items-baseline justify-between px-[var(--g)]">
                  <h3 className="m-0 text-[20px] font-bold leading-tight text-[#eef1ee]">{a.title}</h3>
                  <span className="text-[12px] tabular-nums text-steel">{mine.length}</span>
                </div>
                <div className="mt-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-[var(--g)] pb-2 [scroll-padding-inline:var(--g)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {mine.map((r) => <Card key={r.slug} r={r} tall hover={false} className="w-[66vw] max-w-[300px] shrink-0 snap-start" />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div key={act} className="stage-in mt-9 space-y-[clamp(26px,2.6vw,40px)] px-[var(--g)]">
          {rows.map((row, k) => (
            <div key={k} className="grid items-start gap-[clamp(16px,1.6vw,24px)]" style={{ gridTemplateColumns: row.map((c) => FR[c.slot]).join(" ") }}>
              {row.map((c, j) =>
                c.item ? <Card key={c.item.slug} r={c.item} tall={c.slot === "T"} hover={hover} /> : (
                  <a key={`cta-${j}`} href="#contact" className={`group relative flex flex-col justify-between overflow-hidden rounded-[18px] bg-[#0c1a2b] p-7 text-left no-underline ring-1 ring-white/10 ${c.slot === "T" ? "aspect-[4/5]" : "aspect-[16/9]"}`}>
                    <span className="text-[12px] uppercase tracking-[0.2em] text-steel">Next</span>
                    <span>
                      <span className="block font-display text-[clamp(24px,2.3vw,34px)] font-bold leading-[1.05] text-[#f4f6f3]">Yours could be the next one here.</span>
                      <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-mint">Start a project <ArrowUpRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                    </span>
                  </a>
                ),
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

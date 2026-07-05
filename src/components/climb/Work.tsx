"use client";
import { useRef, useState } from "react";
import { workGroups, type WorkItem } from "../../data/work";

/**
 * The whole body of work on one screen. The index is the message: fourteen
 * real products visible at once, nothing to read, nothing to endure. Touch
 * a name and the product appears on the stage instantly. The stage never
 * moves; only its content changes, so the composition stays settled.
 * On small screens each group becomes a swipeable shelf.
 */

const flat: { item: WorkItem; group: number }[] = workGroups.flatMap(
  (g, gi) => g.items.map((item) => ({ item, group: gi }))
);

function StageContent({ item }: { item: WorkItem }) {
  if (!item.img) {
    return (
      <div className="px-10 text-center">
        <p className="m-0 font-bold leading-none text-[#eef1ee] text-[clamp(44px,4.6vw,76px)]">
          {item.big}
        </p>
        <p className="mx-auto mt-4 max-w-[34ch] text-[15px] leading-relaxed text-[#b9c3d2]">
          {item.sub}
        </p>
      </div>
    );
  }
  if (item.wide) {
    return (
      <img
        src={item.img}
        alt={item.name}
        width={item.w}
        height={item.h}
        className="h-auto max-h-[82%] w-auto max-w-[88%] rounded-xl ring-1 ring-arctic/15 shadow-[0_34px_90px_rgba(0,0,0,0.65)]"
      />
    );
  }
  return (
    <img
      src={item.img}
      alt={item.name}
      width={item.w}
      height={item.h}
      className="h-auto max-h-[86%] w-auto max-w-[62%] rounded-[20px] ring-1 ring-arctic/15 shadow-[0_34px_90px_rgba(0,0,0,0.65)]"
    />
  );
}

function ShelfCard({ item }: { item: WorkItem }) {
  return (
    <div className="w-[76vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#122033_0%,#0a1522_100%)] ring-1 ring-arctic/10">
      <div className="flex h-[280px] items-center justify-center p-5">
        {!item.img ? (
          <div className="text-center">
            <p className="m-0 text-[34px] font-bold leading-none text-[#eef1ee]">{item.big}</p>
            <p className="m-0 mt-3 text-[13px] leading-snug text-[#b9c3d2]">{item.sub}</p>
          </div>
        ) : (
          <img
            src={item.img}
            alt={item.name}
            width={item.w}
            height={item.h}
            loading="lazy"
            className={
              item.wide
                ? "h-auto w-full rounded-lg ring-1 ring-arctic/15"
                : "h-full w-auto rounded-[14px] ring-1 ring-arctic/15"
            }
          />
        )}
      </div>
      <div className="border-t border-arctic/10 p-4">
        <h3 className="m-0 text-[17px] font-bold text-[#eef1ee]">{item.name}</h3>
        <p className="m-0 mt-1 text-[13px] leading-snug text-[#b9c3d2]">{item.line}</p>
        <p className="m-0 mt-2.5 text-[10.5px] uppercase tracking-[0.14em] text-steel">{item.meta}</p>
      </div>
    </div>
  );
}

export default function Work() {
  const [active, setActive] = useState(0);
  const tiltRef = useRef<HTMLDivElement>(null);
  const current = flat[active].item;

  const onStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
  };
  const onStageLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  let rowIndex = -1;

  return (
    <section
      id="journey"
      className="relative overflow-x-clip bg-[linear-gradient(180deg,#04070d_0%,#0c1929_22%,#0d1b2a_58%,#081220_100%)]"
    >
      {/* the world continues under the index: one far ridge and mist */}
      <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-[4%] h-[220px] opacity-40">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="block h-full w-full">
          <path
            fill="rgba(30,51,80,0.35)"
            d="M0,150 L150,128 L300,156 L450,118 L600,148 L750,112 L900,142 L1050,120 L1200,150 L1330,126 L1440,144 L1440,220 L0,220 Z"
          />
        </svg>
      </div>
      <div aria-hidden className="mist mist-a" style={{ top: "12%" }} />

      <div className="relative z-10 mx-auto max-w-[1200px] px-7 py-[clamp(76px,11vh,132px)]">
        <p className="m-0 mb-3 text-[12.5px] uppercase tracking-[0.2em] text-steel">
          The work · 2021 to 2026
        </p>
        <h2 className="m-0 max-w-[16ch] font-bold leading-[1.03] text-[#eef1ee] text-[clamp(34px,5vw,56px)]">
          Seventy shipped. Fourteen up close.
        </h2>
        <p className="m-0 mt-4 max-w-[52ch] leading-relaxed text-[#b9c3d2]">
          Every name below is a real product. Touch one and it appears. The
          other fifty-six shipped quietly for clients.
        </p>

        {/* desktop: index left, settled stage right */}
        <div className="mt-14 hidden lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-14">
          <div>
            {workGroups.map((g) => (
              <div key={g.label} className="mt-9 first:mt-0">
                <div className="flex items-baseline justify-between border-b border-arctic/15 pb-2.5">
                  <span className="text-[12px] uppercase tracking-[0.2em] text-arctic/80">{g.label}</span>
                  <span className="text-[11.5px] uppercase tracking-[0.14em] text-steel/80">{g.note}</span>
                </div>
                {g.items.map((item) => {
                  rowIndex += 1;
                  const idx = rowIndex;
                  const on = idx === active;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onMouseEnter={() => setActive(idx)}
                      onFocus={() => setActive(idx)}
                      onClick={() => setActive(idx)}
                      className="group/row flex w-full items-baseline justify-between gap-5 border-b border-arctic/8 py-[13px] text-left"
                    >
                      <span className="flex min-w-0 items-baseline gap-3.5">
                        <span
                          className={`text-[11px] tabular-nums tracking-[0.1em] transition-colors duration-300 ${
                            on ? "text-arctic/70" : "text-steel/60"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`truncate font-bold text-[clamp(19px,1.7vw,25px)] transition-[color,transform] duration-300 ${
                            on
                              ? "translate-x-1 text-[#eef1ee]"
                              : "text-steel group-hover/row:text-arctic/80"
                          }`}
                        >
                          {item.name}
                        </span>
                      </span>
                      <span
                        className={`whitespace-nowrap text-[11px] uppercase tracking-[0.13em] transition-colors duration-300 ${
                          on ? "text-arctic/75" : "text-steel/70"
                        }`}
                      >
                        {item.meta}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="sticky top-[72px]">
            <div
              onPointerMove={onStageMove}
              onPointerLeave={onStageLeave}
              className="relative h-[min(70vh,660px)] overflow-hidden rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#152337_0%,#0a1522_55%,#070f1a_100%)] ring-1 ring-arctic/10 shadow-[0_40px_100px_rgba(2,7,13,0.6)]"
            >
              {[[14, 16], [30, 8], [52, 20], [72, 10], [88, 18], [64, 30]].map(([x, y], i) => (
                <span
                  key={i}
                  aria-hidden
                  className="absolute h-[2px] w-[2px] rounded-full bg-arctic"
                  style={{ left: `${x}%`, top: `${y}%`, opacity: 0.2 + (i % 3) * 0.12 }}
                />
              ))}
              <div ref={tiltRef} className="absolute inset-0 transition-transform duration-200 ease-out">
                <div
                  key={current.name}
                  className="stage-in absolute inset-0 flex items-center justify-center p-10"
                >
                  <StageContent item={current} />
                </div>
              </div>
            </div>
            <div key={`${current.name}-caption`} className="stage-in mt-4 flex items-baseline justify-between gap-6">
              <p className="m-0 max-w-[46ch] text-[15px] leading-relaxed text-[#cfd6df]">{current.line}</p>
              <p className="m-0 whitespace-nowrap text-[11px] uppercase tracking-[0.13em] text-steel">
                {current.meta}
              </p>
            </div>
          </div>
        </div>

        {/* small screens: one swipeable shelf per group */}
        <div className="mt-11 space-y-11 lg:hidden">
          {workGroups.map((g) => (
            <div key={g.label}>
              <div className="mb-4 flex items-baseline justify-between border-b border-arctic/15 pb-2.5">
                <span className="text-[12px] uppercase tracking-[0.2em] text-arctic/80">{g.label}</span>
                <span className="text-[11px] uppercase tracking-[0.13em] text-steel/80">{g.note}</span>
              </div>
              <div className="-mx-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-7 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {g.items.map((item) => (
                  <ShelfCard key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

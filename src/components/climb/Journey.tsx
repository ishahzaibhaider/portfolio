"use client";
import { useEffect, useRef } from "react";
import { chapters, contact, type Camp } from "../../data/climb";
import { LinkedinLogo, FileArrowDown } from "@phosphor-icons/react";

const IMG_FRAME =
  "relative z-10 w-full rounded-xl ring-1 ring-arctic/15 shadow-[0_24px_60px_rgba(2,7,13,0.85),0_60px_120px_rgba(2,7,13,0.5)]";

function StationBlock({ camp }: { camp: Camp }) {
  if (camp.kind === "milestone") {
    return (
      <div className="station mx-auto max-w-[600px] py-[clamp(36px,6vh,64px)] text-center opacity-0 translate-y-[36px] transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0">
        <h3 className="m-0 mb-2 font-bold text-[#eef1ee] text-[clamp(22px,3vw,30px)]">{camp.name}</h3>
        <p className="m-0 leading-relaxed text-[#b9c3d2]">{camp.body}</p>
        <p className="mt-3 text-[13px] uppercase tracking-[0.14em] text-steel">{camp.meta}</p>
      </div>
    );
  }

  if (camp.wide) {
    return (
      <div className="station py-[clamp(40px,7vh,80px)] opacity-0 translate-y-[36px] transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0">
        <div className="mx-auto max-w-[880px]">
          <img src={camp.img} alt={camp.alt} loading="lazy" className={IMG_FRAME} />
        </div>
        <div className="mx-auto mt-7 max-w-[620px] text-center">
          <h3 className="m-0 mb-2 font-bold text-[#eef1ee] text-[clamp(24px,3.2vw,34px)]">{camp.name}</h3>
          <p className="m-0 leading-relaxed text-[#b9c3d2]">{camp.body}</p>
          <p className="mt-3 text-[13px] uppercase tracking-[0.14em] text-steel">{camp.meta}</p>
        </div>
      </div>
    );
  }

  const flip = camp.flip ? "md:flex-row-reverse" : "md:flex-row";
  return (
    <div
      className={`station flex flex-col items-center gap-[clamp(24px,4.5vw,64px)] py-[clamp(40px,7vh,80px)] ${flip} opacity-0 translate-y-[36px] transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0`}
    >
      <div className="w-[min(340px,88%)] flex-none md:w-[min(340px,40%)]">
        <img src={camp.img} alt={camp.alt} loading="lazy" className={IMG_FRAME} />
      </div>
      <div>
        <h3 className="m-0 mb-2 font-bold text-[#eef1ee] text-[clamp(24px,3.2vw,34px)]">{camp.name}</h3>
        <p className="m-0 max-w-[44ch] leading-relaxed text-[#b9c3d2]">{camp.body}</p>
        <p className="mt-3 text-[13px] uppercase tracking-[0.14em] text-steel">{camp.meta}</p>
      </div>
    </div>
  );
}

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const trailDesktop = useRef<SVGPathElement>(null);
  const trailMobile = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.remove("opacity-0", "translate-y-[36px]");
          }
        });
      },
      { threshold: 0.2 }
    );
    root.current?.querySelectorAll(".station").forEach((s) => io.observe(s));

    const paths = [trailDesktop.current, trailMobile.current].filter(
      (p): p is SVGPathElement => !!p
    );
    const lens = paths.map((p) => {
      try {
        const l = p.getTotalLength();
        p.style.strokeDasharray = String(l);
        p.style.strokeDashoffset = String(l);
        return l;
      } catch {
        return 0;
      }
    });

    if (reduce || paths.length === 0) {
      paths.forEach((p, i) => {
        if (lens[i]) {
          p.style.strokeDashoffset = "0";
          p.style.strokeDasharray = "0.4 1.2";
        }
      });
      return () => io.disconnect();
    }

    // Locked 1:1 to the scrollbar: no smoothing, no lag, no jitter at speed.
    let ticking = false;
    const draw = () => {
      ticking = false;
      if (!root.current) return;
      const rect = root.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const passed = Math.min(Math.max(-rect.top + window.innerHeight * 0.6, 0), Math.max(total, 1));
      const prog = total > 0 ? passed / total : 0;
      paths.forEach((p, i) => {
        if (lens[i]) p.style.strokeDashoffset = String(lens[i] * (1 - prog));
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(draw);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    draw();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={root}
      id="journey"
      className="relative bg-[linear-gradient(180deg,#16283e_0%,#101f31_18%,#0d1b2a_42%,#0a1624_70%,#081220_100%)] pb-8"
    >
      {[
        { top: "10%", fill: "rgba(34,57,90,0.30)", d: "M0,170 L130,148 L260,120 L390,146 L520,108 L650,138 L780,102 L910,132 L1040,110 L1170,140 L1300,118 L1440,142 L1440,240 L0,240 Z" },
        { top: "34%", fill: "rgba(28,48,73,0.28)", d: "M0,150 L150,170 L290,128 L430,158 L570,118 L710,150 L850,112 L990,146 L1130,120 L1270,152 L1440,128 L1440,240 L0,240 Z" },
        { top: "58%", fill: "rgba(21,37,57,0.30)", d: "M0,140 L160,120 L320,152 L480,116 L640,148 L800,110 L960,142 L1120,118 L1280,148 L1440,124 L1440,240 L0,240 Z" },
        { top: "82%", fill: "rgba(16,29,46,0.32)", d: "M0,160 L140,138 L280,112 L420,140 L560,104 L700,134 L840,100 L980,130 L1120,108 L1260,138 L1400,116 L1440,124 L1440,240 L0,240 Z" },
      ].map((b, i) => (
        <div key={i} aria-hidden className="pointer-events-none absolute left-0 right-0 h-[240px] opacity-50" style={{ top: b.top }}>
          <svg viewBox="0 0 1440 240" preserveAspectRatio="none" className="block h-full w-full">
            <path fill={b.fill} d={b.d} />
          </svg>
        </div>
      ))}

      <div aria-hidden className="mist mist-a" style={{ top: "26%" }} />
      <div aria-hidden className="mist mist-b" style={{ top: "62%" }} />

      {/* the route, kept to the margin so it never crosses the reading line */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={trailDesktop}
          vectorEffect="non-scaling-stroke"
          className="hidden fill-none stroke-[rgba(119,141,169,0.3)] [stroke-dasharray:3_9] [stroke-width:1.5] lg:block"
          d="M 93,0 C 96,4 90,8 93,12 C 96,16 89,20 92,24 C 95,28 89,32 92,36 C 95,40 89,44 92,48 C 95,52 89,56 92,60 C 95,64 89,68 92,72 C 95,76 89,80 92,84 C 95,88 90,92 92,96 C 93.5,98 94,99 94,100"
        />
        <path
          ref={trailMobile}
          vectorEffect="non-scaling-stroke"
          className="fill-none stroke-[rgba(119,141,169,0.26)] [stroke-dasharray:3_9] [stroke-width:1.5] lg:hidden"
          d="M 4.5,0 C 6,8 3.5,16 5,24 C 6.5,32 3.5,40 5,48 C 6.5,56 3.5,64 5,72 C 6.5,80 4,88 5,94 C 5.5,97 5,99 5,100"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1140px] px-7">
        {chapters.map((ch) => (
          <div key={ch.kicker}>
            <div className="pt-[clamp(64px,10vh,110px)] pb-[clamp(24px,4vh,44px)]">
              <p className="m-0 mb-3 text-[12.5px] uppercase tracking-[0.2em] text-steel">{ch.kicker}</p>
              <h2 className="m-0 mb-3.5 max-w-[18ch] font-bold leading-[1.03] text-[#eef1ee] text-[clamp(34px,5vw,56px)]">
                {ch.title}
              </h2>
              <p className="m-0 max-w-[52ch] leading-relaxed text-[#b9c3d2]">{ch.lead}</p>
            </div>
            {ch.camps.map((camp) => (
              <StationBlock key={camp.name} camp={camp} />
            ))}
          </div>
        ))}

        <div id="contact" className="station scroll-mt-20 py-[clamp(80px,12vh,140px)] text-center opacity-0 translate-y-[36px] transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0">
          <p className="m-0 mb-3 text-[12.5px] uppercase tracking-[0.2em] text-steel">The summit</p>
          <h2 className="mx-auto m-0 max-w-[16ch] font-bold leading-[1.02] text-[#eef1ee] text-[clamp(40px,6.4vw,72px)]">
            The next flag up here is yours.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] leading-relaxed text-[#b9c3d2]">
            Tell me what needs to exist. If it can be built, you will get a
            working version faster than you expect.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${contact.email}`}
              className="rounded-full bg-arctic px-[30px] py-3.5 text-base font-bold text-[#101c2b] shadow-[0_16px_44px_rgba(224,225,221,0.15)] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:shadow-[0_24px_60px_rgba(224,225,221,0.22)] active:translate-y-[-1px] active:scale-[0.985]"
            >
              Start a project
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-arctic/25 px-6 py-3.5 text-base text-arctic transition-colors hover:border-arctic hover:text-white"
            >
              <LinkedinLogo size={18} />
              LinkedIn
            </a>
            <a
              href={contact.resume}
              download
              className="inline-flex items-center gap-2 rounded-full border border-arctic/25 px-6 py-3.5 text-base text-arctic transition-colors hover:border-arctic hover:text-white"
            >
              <FileArrowDown size={18} />
              Resume
            </a>
          </div>
          <p className="mt-7 text-sm text-steel">{contact.email}</p>
        </div>
      </div>
    </section>
  );
}

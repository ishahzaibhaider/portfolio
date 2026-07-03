"use client";
import { useEffect, useRef } from "react";
import { chapters, contact, type Camp } from "../../data/climb";
import { LinkedinLogo, FileArrowDown } from "@phosphor-icons/react";

function StationBlock({ camp }: { camp: Camp }) {
  if (camp.kind === "milestone") {
    return (
      <div className="station mx-auto max-w-[620px] py-[clamp(50px,8vh,100px)] text-center opacity-0 translate-y-[44px] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0">
        <h3 className="m-0 mb-2.5 font-bold text-[#eef1ee] text-[clamp(22px,3vw,30px)]">{camp.name}</h3>
        <p className="m-0 leading-relaxed text-[#b9c3d2]">{camp.body}</p>
        <p className="mt-3.5 text-[13px] uppercase tracking-[0.14em] text-steel">{camp.meta}</p>
      </div>
    );
  }

  const flip = camp.flip ? "md:flex-row-reverse" : "md:flex-row";
  if (camp.wide) {
    return (
      <div className="station py-[clamp(60px,10vh,120px)] opacity-0 translate-y-[44px] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0">
        <div className="relative mx-auto max-w-[880px]">
          <div aria-hidden className="absolute -inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(224,225,221,0.09)_0%,rgba(119,141,169,0.05)_45%,transparent_70%)]" />
          <img
            src={camp.img}
            alt={camp.alt}
            loading="lazy"
            className="relative z-10 w-full rounded-2xl shadow-[0_40px_90px_rgba(2,7,13,0.85),0_0_0_1px_rgba(224,225,221,0.13),0_-20px_70px_rgba(119,141,169,0.10)]"
            style={{ transform: `rotate(${camp.tilt}deg)` }}
          />
        </div>
        <div className="mx-auto mt-9 max-w-[620px] text-center">
          <h3 className="m-0 mb-2.5 font-bold text-[#eef1ee] text-[clamp(24px,3.2vw,34px)]">{camp.name}</h3>
          <p className="m-0 leading-relaxed text-[#b9c3d2]">{camp.body}</p>
          <p className="mt-3.5 text-[13px] uppercase tracking-[0.14em] text-steel">{camp.meta}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`station flex flex-col items-center gap-[clamp(28px,6vw,90px)] py-[clamp(60px,10vh,120px)] md:items-center ${flip} opacity-0 translate-y-[44px] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0`}>
      <div className="relative w-[min(320px,86%)] flex-none md:w-[min(320px,42%)]">
        <div aria-hidden className="absolute -inset-x-[18%] -inset-y-[14%] rounded-full bg-[radial-gradient(circle,rgba(224,225,221,0.10)_0%,rgba(119,141,169,0.05)_45%,transparent_70%)]" />
        <img
          src={camp.img}
          alt={camp.alt}
          loading="lazy"
          className="relative z-10 w-full rounded-2xl shadow-[0_40px_90px_rgba(2,7,13,0.85),0_0_0_1px_rgba(224,225,221,0.13),0_-20px_70px_rgba(119,141,169,0.10)]"
          style={{ transform: `rotate(${camp.tilt}deg)` }}
        />
      </div>
      <div>
        <h3 className="m-0 mb-2.5 font-bold text-[#eef1ee] text-[clamp(24px,3.2vw,34px)]">{camp.name}</h3>
        <p className="m-0 max-w-[42ch] leading-relaxed text-[#b9c3d2]">{camp.body}</p>
        <p className="mt-3.5 text-[13px] uppercase tracking-[0.14em] text-steel">{camp.meta}</p>
      </div>
    </div>
  );
}

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const trailPath = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.remove("opacity-0", "translate-y-[44px]");
          }
        });
      },
      { threshold: 0.25 }
    );
    root.current?.querySelectorAll(".station").forEach((s) => io.observe(s));

    const path = trailPath.current;
    let len = 0;
    try {
      if (path) {
        len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
      }
    } catch {
      len = 0;
    }

    if (reduce) {
      if (path && len) {
        path.style.strokeDashoffset = "0";
        path.style.strokeDasharray = "0.4 1.2";
      }
      return () => io.disconnect();
    }

    let raf = 0;
    let cur = 0;
    const frame = () => {
      if (path && len && root.current) {
        const rect = root.current.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.6;
        const passed = Math.min(Math.max(-rect.top + window.innerHeight * 0.55, 0), Math.max(total, 1));
        const target = total > 0 ? passed / total : 0;
        cur += (target - cur) * 0.08;
        path.style.strokeDashoffset = String(len * (1 - cur));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={root}
      id="journey"
      className="relative bg-[linear-gradient(180deg,#16283e_0%,#101f31_18%,#0d1b2a_42%,#0a1624_70%,#081220_100%)] pb-10"
    >
      {/* distant ridgelines keep the landscape alive down the whole route */}
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

      {/* drifting valley mist mid-route */}
      <div aria-hidden className="mist mist-a" style={{ top: "26%" }} />
      <div aria-hidden className="mist mist-b" style={{ top: "62%" }} />

      {/* the trail draws itself as you descend */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={trailPath}
          vectorEffect="non-scaling-stroke"
          className="fill-none stroke-[rgba(119,141,169,0.4)] [stroke-dasharray:3_9] [stroke-width:2]"
          d="M 74,1.5 C 60,6 40,8 32,12 C 24,16 32,20 46,22.5 C 62,25 70,28 60,32 C 50,36 34,38 30,42 C 26,46 40,50 52,53 C 62,55.5 66,59 58,63 C 48,67 34,69 30,73 C 26,77 38,81 50,84 C 60,86.5 64,90 58,94 C 52,97 46,98 42,99"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1140px] px-7">
        {chapters.map((ch) => (
          <div key={ch.kicker}>
            <div className="pt-[clamp(90px,15vh,160px)] pb-[clamp(40px,6vh,70px)]">
              <p className="m-0 mb-3.5 text-[12.5px] uppercase tracking-[0.2em] text-steel">{ch.kicker}</p>
              <h2 className="m-0 mb-4 max-w-[16ch] font-bold leading-[1.03] text-[#eef1ee] text-[clamp(36px,5.4vw,60px)]">
                {ch.title}
              </h2>
              <p className="m-0 max-w-[52ch] leading-relaxed text-[#b9c3d2]">{ch.lead}</p>
            </div>
            {ch.camps.map((camp) => (
              <StationBlock key={camp.name} camp={camp} />
            ))}
          </div>
        ))}

        {/* ================= SUMMIT ================= */}
        <div id="contact" className="station scroll-mt-20 py-[clamp(100px,16vh,180px)] text-center opacity-0 translate-y-[44px] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0">
          <p className="m-0 mb-3.5 text-[12.5px] uppercase tracking-[0.2em] text-steel">The summit</p>
          <h2 className="mx-auto m-0 max-w-[16ch] font-bold leading-[1.02] text-[#eef1ee] text-[clamp(40px,6.4vw,72px)]">
            The next flag up here is yours.
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] leading-relaxed text-[#b9c3d2]">
            Tell me what needs to exist. If it can be built, you will get a
            working version faster than you expect.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
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
          <p className="mt-8 text-sm text-steel">{contact.email}</p>
        </div>
      </div>
    </section>
  );
}

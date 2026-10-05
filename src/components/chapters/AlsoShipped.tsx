"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Products that ship from screenshots only (no running app to film yet): real screens in quiet device frames,
 * one honest line each. They sit after the chapters so the films stay the main event.
 */
type Item = {
  name: string;
  line: string;
  meta: string;
  glow: string;
  phones?: string[];
  web?: string;
  domain?: string;
};

const ITEMS: Item[] = [
  {
    name: "Tajseer",
    line: "Shariah-compliant loan management and disbursement across web, iOS and Android, with a pixel-accurate admin panel.",
    meta: "Fintech · both stores · web admin",
    glow: "#1f8a70",
    phones: ["/work/tajseer-welcome.png", "/work/tajseer-lender-home.png"],
    web: "/work/tajseer-web-hero.jpg",
    domain: "tajseer",
  },
  {
    name: "Pink3",
    line: "A CRM where AI does the clicking: message it from Discord, Telegram or WhatsApp and an agent drives the web UI to finish the task.",
    meta: "AI agents · forked on Twenty CRM",
    glow: "#e5488f",
    web: "/work/pink3-hero.jpg",
    domain: "pink3",
  },
  {
    name: "RealCrowd",
    line: "Where is the crowd tonight? Live venue heat across the UAE, answered in one glance.",
    meta: "iOS · live on the App Store",
    glow: "#8b5cf6",
    phones: ["/work/realcrowd-store.jpg"],
  },
];

function Card({ it, i }: { it: Item; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.2 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-[26px] bg-[#0b1522] ring-1 ring-arctic/10 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(40px)", transitionDelay: `${i * 120}ms` }}
    >
      <div aria-hidden className="pointer-events-none absolute -top-1/3 left-1/2 h-[80%] w-[90%] -translate-x-1/2 rounded-full opacity-40 blur-[80px] transition-opacity duration-700 group-hover:opacity-60" style={{ background: it.glow }} />
      <div className="relative flex h-[300px] items-end justify-center gap-3 px-6 pt-8 md:h-[340px]">
        {it.web && (
          <div className={`overflow-hidden rounded-[12px] bg-[#e9ecef] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)] ring-1 ring-black/20 transition-transform duration-700 group-hover:-translate-y-2 ${it.phones ? "absolute left-6 top-8 w-[62%]" : "mb-8 w-[92%]"}`}>
            <div className="flex h-6 items-center gap-1.5 bg-[#dfe3e8] px-2.5">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />)}
            </div>
            <img src={it.web} alt={`${it.name} web`} loading="lazy" className="block w-full" />
          </div>
        )}
        {it.phones?.map((p, k) => (
          <img key={p} src={p} alt={`${it.name} screen`} loading="lazy"
            className={`relative w-[34%] max-w-[150px] rounded-[18px] object-cover object-top shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)] ring-[5px] ring-[#0b0d10] transition-transform duration-700 group-hover:-translate-y-3 ${it.web ? "ml-auto" : ""} ${k ? "translate-y-6" : ""}`}
            style={{ aspectRatio: "440 / 956" }} />
        ))}
      </div>
      <div className="relative border-t border-arctic/8 p-6">
        <h3 className="m-0 text-[22px] font-bold text-[#eef1ee]">{it.name}</h3>
        <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-[#c3ccd7]">{it.line}</p>
        <p className="m-0 mt-3 text-[11px] uppercase tracking-[0.14em] text-steel">{it.meta}</p>
      </div>
    </div>
  );
}

export default function AlsoShipped() {
  return (
    <section id="more-work" className="relative bg-[linear-gradient(180deg,#060e18_0%,#0a1524_50%,#060e18_100%)] px-[var(--g)] py-[clamp(80px,13vh,140px)]">
      <p className="m-0 mb-3 text-[12.5px] uppercase tracking-[0.22em] text-steel">Also shipped</p>
      <h2 className="m-0 max-w-[18ch] font-bold leading-[1.03] text-[#eef1ee] text-[clamp(32px,4.6vw,58px)]">More of the seventy, from the screens I kept.</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ITEMS.map((it, i) => <Card key={it.name} it={it} i={i} />)}
      </div>
    </section>
  );
}

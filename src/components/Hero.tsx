"use client";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import type { PersonaConfig } from "../data/personas";

const ease = [0.16, 1, 0.3, 1] as const;

const heroShots = [
  {
    src: "/work/retaj-customer-home.png",
    alt: "Retaj home services app, customer home screen",
    className: "z-20 w-[46%] rotate-[-4deg]",
    delay: 0.3,
  },
  {
    src: "/work/sparkline-map.png",
    alt: "Sparkline campus app, live event map",
    className: "z-10 -ml-[14%] mt-10 w-[42%] rotate-[3deg]",
    delay: 0.42,
  },
  {
    src: "/work/vpn-connected.png",
    alt: "Zero-Trace VPN, connected screen",
    className: "-ml-[12%] mt-24 w-[38%] rotate-[7deg]",
    delay: 0.54,
  },
];

export default function Hero({ config }: { config: PersonaConfig["hero"] }) {
  const reduce = useReducedMotion();
  const enter = (delay: number) => {
    if (reduce) return {};
    return {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay, ease },
    };
  };

  const secondary =
    config.primaryCta.href === "#work"
      ? { label: "Start a project", href: "#contact" }
      : { label: "See the work", href: "#work" };

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 items-center gap-12 px-5 pt-24 pb-16 md:px-10 lg:grid-cols-12 lg:gap-6 lg:pt-16 lg:pb-0">
        <div className="lg:col-span-6">
          <motion.p {...enter(0.08)} className="font-mono text-xs uppercase tracking-[0.2em] text-bone-2">
            Syed Shahzaib Haider Rizvi · AI engineer
          </motion.p>
          <motion.h1
            {...enter(0.18)}
            className="mt-6 text-5xl font-bold leading-[1.02] tracking-tighter text-bone sm:text-6xl lg:text-7xl"
          >
            {config.headline}
          </motion.h1>
          <motion.p {...enter(0.3)} className="mt-7 max-w-lg text-lg leading-relaxed text-bone-2">
            {config.sub}
          </motion.p>
          <motion.div {...enter(0.42)} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={config.primaryCta.href}
              {...(config.primaryCta.href.endsWith(".pdf") ? { download: true } : {})}
              className="group inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-base font-semibold text-ink transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
            >
              {config.primaryCta.label}
              {config.primaryCta.href === "#work" ? (
                <ArrowDown size={18} weight="bold" className="transition-transform group-hover:translate-y-0.5" />
              ) : (
                <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
              )}
            </a>
            <a
              href={secondary.href}
              className="rounded-full border border-bone/25 px-6 py-3 text-base font-medium text-bone transition-colors hover:border-ember hover:text-ember"
            >
              {secondary.label}
            </a>
          </motion.div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="flex items-start justify-center lg:justify-end">
            {heroShots.map((shot) => (
              <motion.img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                loading="eager"
                initial={reduce ? false : { opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: shot.delay, ease }}
                className={`relative max-w-[240px] rounded-[1.6rem] shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-bone/10 ${shot.className}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

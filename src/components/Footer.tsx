"use client";
import Reveal from "./Reveal";
import { GithubLogo, LinkedinLogo, Phone } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-ink-2/55 backdrop-blur-[3px]">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-36">
        <Reveal>
          <h2 className="text-4xl font-bold tracking-tighter text-bone md:text-6xl">
            Have something worth building?
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href="mailto:shahzaibhaider161@gmail.com"
            className="mt-10 inline-block break-all text-2xl font-semibold tracking-tight text-ember underline decoration-ember/40 decoration-2 underline-offset-8 transition-colors hover:decoration-ember sm:text-4xl md:text-5xl"
          >
            shahzaibhaider161@gmail.com
          </a>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className="mt-14 flex flex-wrap items-center gap-6">
            <li>
              <a
                href="https://github.com/ishahzaibhaider"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-bone-2 transition-colors hover:text-bone"
              >
                <GithubLogo size={18} weight="regular" /> GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/syed-shahzaib-haider-rizvi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-bone-2 transition-colors hover:text-bone"
              >
                <LinkedinLogo size={18} weight="regular" /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="tel:+923295203665"
                className="inline-flex items-center gap-2 text-sm text-bone-2 transition-colors hover:text-bone"
              >
                <Phone size={18} weight="regular" /> +92 329 5203665
              </a>
            </li>
          </ul>
        </Reveal>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-line pt-8 sm:flex-row">
          <p className="text-xs text-bone-3">Syed Shahzaib Haider Rizvi, Islamabad, Pakistan</p>
          <p className="text-xs text-bone-3">Designed and built by hand, 2026</p>
        </div>
      </div>
    </footer>
  );
}

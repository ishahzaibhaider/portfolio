"use client";
import FilmSection from "./FilmSection";
import { contact } from "../../data/climb";
import { LinkedinLogo, FileArrowDown } from "@phosphor-icons/react";

const span = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

/**
 * The finale. He walks toward the visitor with Amber and stops, looking
 * straight at them; the ask appears over the settled hero frame with
 * live buttons. This IS the contact section.
 */
export default function CloserFilm() {
  return (
    <FilmSection
      clip="closer"
      frames={100}
      heightVh={300}
      focalX={0.5}
      id="contact"
      overlay={(p) => {
        const ask = span(p, 0.3, 0.45);
        const cta = span(p, 0.55, 0.7);
        return (
          <div className="absolute inset-0">
            <div className="pointer-events-none absolute inset-x-0 top-[12vh] px-[6vw] text-center">
              <p
                className="m-0 mb-3 text-[12px] uppercase tracking-[0.24em] text-arctic/85 md:text-[13px]"
                style={{ opacity: ask }}
              >
                The part where you say hello
              </p>
              <h2
                className="mx-auto m-0 max-w-[14ch] font-bold leading-[0.98] text-[#f2f4f1] [text-shadow:0_4px_40px_rgba(2,6,12,0.7)] text-[clamp(42px,8vw,110px)]"
                style={{ opacity: ask, transform: `translateY(${(1 - ask) * 30}px)` }}
              >
                Have something to build?
              </h2>
              <p
                className="mx-auto mt-4 max-w-[44ch] text-[15px] leading-relaxed text-arctic/90 md:text-[16.5px]"
                style={{ opacity: span(p, 0.42, 0.55) }}
              >
                Tell me what needs to exist. If it can be built, you will get a
                working version faster than you expect.
              </p>
            </div>

            <div
              className="absolute inset-x-0 bottom-[10vh] px-[6vw]"
              style={{
                opacity: cta,
                transform: `translateY(${(1 - cta) * 22}px)`,
                pointerEvents: cta > 0.6 ? "auto" : "none",
              }}
            >
              <div className="flex flex-wrap items-center justify-center gap-3.5 md:gap-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="rounded-full bg-arctic px-[28px] py-3.5 text-base font-bold text-[#101c2b] shadow-[0_16px_44px_rgba(2,6,12,0.5)] transition-transform duration-300 hover:-translate-y-[3px] active:scale-[0.985]"
                >
                  Start a project
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-arctic/40 bg-deep/30 px-6 py-3.5 text-base text-arctic backdrop-blur-sm transition-colors hover:border-arctic hover:text-white"
                >
                  <LinkedinLogo size={18} />
                  LinkedIn
                </a>
                <a
                  href={contact.resume}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-arctic/40 bg-deep/30 px-6 py-3.5 text-base text-arctic backdrop-blur-sm transition-colors hover:border-arctic hover:text-white"
                >
                  <FileArrowDown size={18} />
                  Resume
                </a>
              </div>
              <p className="mt-5 text-center text-sm text-arctic/85">{contact.email}</p>
            </div>
          </div>
        );
      }}
    />
  );
}

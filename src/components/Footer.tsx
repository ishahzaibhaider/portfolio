import Reveal from "./Reveal";
import { LinkedinLogo, FileArrowDown, EnvelopeSimple } from "@phosphor-icons/react";
import { contact } from "../data/projects";
import type { PersonaConfig } from "../data/personas";

export default function Footer({ config }: { config: PersonaConfig["footer"] }) {
  const emailFirst = config.primary === "email";

  return (
    <footer id="contact" data-tour="contact" className="scroll-mt-16 border-t border-line bg-ink-2">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 lg:py-32">
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-bold tracking-tighter text-bone md:text-6xl">
            {config.headline}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-bone-2">{config.sub}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {emailFirst ? (
              <a
                href={`mailto:${contact.email}`}
                className="rounded-full bg-ember px-6 py-3 text-base font-semibold text-ink transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
              >
                Start a project
              </a>
            ) : (
              <a
                href={contact.resume}
                download
                className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-base font-semibold text-ink transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
              >
                <FileArrowDown size={18} />
                Download resume
              </a>
            )}
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-5 py-3 text-base text-bone transition-colors hover:border-ember hover:text-ember"
            >
              <LinkedinLogo size={18} />
              LinkedIn
            </a>
            {emailFirst ? (
              <a
                href={contact.resume}
                download
                className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-5 py-3 text-base text-bone transition-colors hover:border-ember hover:text-ember"
              >
                <FileArrowDown size={18} />
                Resume
              </a>
            ) : (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-5 py-3 text-base text-bone transition-colors hover:border-ember hover:text-ember"
              >
                <EnvelopeSimple size={18} />
                Email me
              </a>
            )}
          </div>
        </Reveal>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-5 py-6 text-xs text-bone-3 md:px-10">
          <p>Syed Shahzaib Haider Rizvi</p>
          <p>{contact.email}</p>
        </div>
      </div>
    </footer>
  );
}

import Reveal from "./Reveal";
import { LinkedinLogo, FileArrowDown } from "@phosphor-icons/react";
import { contact } from "../data/projects";

export default function Footer() {
  return (
    <footer id="contact" data-tour="contact" className="scroll-mt-16 border-t border-line bg-ink-2">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 lg:py-32">
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-bold tracking-tighter text-bone md:text-6xl">
            Have something that needs to exist?
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-bone-2">
            Tell me what it is. If it can be built, you will get a working
            version faster than you expect.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${contact.email}`}
              className="rounded-full bg-ember px-6 py-3 text-base font-semibold text-ink transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
            >
              Start a project
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-5 py-3 text-base text-bone transition-colors hover:border-ember hover:text-ember"
            >
              <LinkedinLogo size={18} />
              LinkedIn
            </a>
            <a
              href={contact.resume}
              download
              className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-5 py-3 text-base text-bone transition-colors hover:border-ember hover:text-ember"
            >
              <FileArrowDown size={18} />
              Resume
            </a>
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

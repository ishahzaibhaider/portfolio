import { contact } from "../../data/climb";
import { LinkedinLogo, FileArrowDown } from "@phosphor-icons/react";

/**
 * The close, in plain language. No summit poetry: a visitor who just
 * skimmed fourteen products needs exactly one thing here, a reason to
 * write, and the button to do it.
 */
export default function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-x-clip bg-[linear-gradient(180deg,#081220_0%,#060e18_100%)]"
    >
      <div className="relative mx-auto max-w-[780px] px-7 py-[clamp(88px,14vh,150px)] text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-8 h-44 w-44 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(224,225,221,0.12),transparent_64%)]"
        />
        {[[10, 22], [24, 10], [42, 26], [60, 8], [78, 18], [90, 30]].map(([x, y], i) => (
          <span
            key={i}
            aria-hidden
            className="absolute h-[2px] w-[2px] rounded-full bg-arctic"
            style={{ left: `${x}%`, top: `${y}%`, opacity: 0.25 + (i % 3) * 0.14 }}
          />
        ))}
        <p className="m-0 mb-3 text-[12.5px] uppercase tracking-[0.2em] text-steel">Contact</p>
        <h2 className="mx-auto m-0 max-w-[15ch] font-bold leading-[1.02] text-[#eef1ee] text-[clamp(38px,6vw,66px)]">
          Have something to build?
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
      <footer className="border-t border-arctic/8 py-6 text-center text-[12.5px] text-steel">
        Syed Shahzaib Haider Rizvi · Islamabad · 2026
      </footer>
    </section>
  );
}

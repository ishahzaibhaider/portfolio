import Reveal from "./Reveal";
import { retajScreens } from "../data/projects";

export default function CaseRetaj() {
  return (
    <section data-tour="retaj" className="scroll-mt-16 overflow-hidden bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tighter text-bone md:text-5xl">Retaj</h2>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-bone-2">
            Home services for the Saudi market, designed screen by screen.
            Four roles in one product: customer, technician, supervisor, and
            admin. 24 screens, bilingual, themed light and dark.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <div className="screen-rail mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:px-10">
          {retajScreens.map((s) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              loading="lazy"
              className="w-[240px] max-w-none shrink-0 snap-start rounded-[1.4rem] ring-1 ring-bone/10 md:w-[280px]"
            />
          ))}
          <div className="w-1 shrink-0" />
        </div>
      </Reveal>
    </section>
  );
}

import Reveal from "./Reveal";
import { index } from "../data/projects";

export default function WorkIndex() {
  return (
    <section data-tour="index" className="scroll-mt-16 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tighter text-bone md:text-5xl">The rest of the shelf</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-bone-2">
            A selection from everything else that made it out the door.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {index.map((p, i) => (
            <Reveal key={p.name} delay={0.04 * (i % 2)}>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-5">
                <div>
                  <h3 className="font-semibold text-bone">{p.name}</h3>
                  <p className="mt-1 text-sm leading-snug text-bone-2">{p.note}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-bone-3">{p.kind}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

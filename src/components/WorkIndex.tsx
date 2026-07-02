"use client";
import Reveal from "./Reveal";
import { index } from "../data/projects";

export default function WorkIndex() {
  return (
    <section className="border-y border-line bg-ink-2/55 backdrop-blur-[3px]">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10">
        <Reveal>
          <h2 className="text-4xl font-bold tracking-tighter text-bone md:text-5xl">
            The rest of the shelf.
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-bone-2">
            Apps on both stores, browser extensions, trading tools, and the
            systems behind real businesses.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {index.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.06}>
              <article className="group h-full rounded-2xl border border-line bg-ink/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ember/60">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-tight text-bone group-hover:text-ember">
                    {p.name}
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-bone-3">{p.kind}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-bone-2">{p.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import Reveal from "./Reveal";
import GenerativeArt from "./GenerativeArt";
import { featured, type FeaturedProject } from "../data/projects";

function StackPills({ stack }: { stack: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {stack.map((s) => (
        <li
          key={s}
          className="rounded-full border border-line px-3 py-1 font-mono text-xs text-bone-2"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function SplitRow({ project, seed, flip }: { project: FeaturedProject; seed: number; flip: boolean }) {
  return (
    <Reveal>
      <article className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
        <div
          className={`relative aspect-[16/10] overflow-hidden rounded-2xl border border-line md:col-span-7 ${
            flip ? "md:order-2" : ""
          }`}
        >
          <GenerativeArt style={project.art} seed={seed} />
        </div>
        <div className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
          <p className="font-mono text-sm text-ember">{project.role}</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-bone md:text-4xl">
            {project.name}
          </h3>
          <p className="mt-4 leading-relaxed text-bone-2">{project.description}</p>
          <div className="mt-6">
            <StackPills stack={project.stack} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function FullBleedRow({ project, seed }: { project: FeaturedProject; seed: number }) {
  return (
    <Reveal>
      <article className="relative overflow-hidden rounded-2xl border border-line">
        <div className="relative min-h-[420px]">
          <GenerativeArt style={project.art} seed={seed} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
          <div className="relative flex min-h-[420px] flex-col justify-end p-6 md:p-12">
            <p className="font-mono text-sm text-ember">{project.role}</p>
            <h3 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-bone md:text-5xl">
              {project.name}
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed text-bone-2">{project.description}</p>
            <div className="mt-6">
              <StackPills stack={project.stack} />
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function FeaturedWork() {
  const [a, b, c, d, e] = featured;
  return (
    <section id="work" className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-bone-2">Selected work</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tighter text-bone md:text-6xl">
          Built, deployed, and running in production.
        </h2>
      </Reveal>

      <div className="mt-20 flex flex-col gap-24 md:gap-32">
        <SplitRow project={a} seed={11} flip={false} />
        <SplitRow project={b} seed={23} flip={true} />
        <FullBleedRow project={c} seed={37} />
        <SplitRow project={d} seed={41} flip={false} />
        <SplitRow project={e} seed={53} flip={true} />
      </div>
    </section>
  );
}

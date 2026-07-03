import Reveal from "./Reveal";

const points = [
  {
    title: "End to end, one pair of hands",
    body: "Design, code, backend, deployment, and the app store paperwork. You brief once and get a product back, not a hand-off between specialists.",
  },
  {
    title: "First version in days",
    body: "Idea to working MVP fast, then iterate against real usage. Speed is a habit from shipping seventy times, not a promise.",
  },
  {
    title: "AI where it earns its place",
    body: "Agents that operate UIs, pipelines that publish videos on their own, a hundred working bots. Applied where it changes the product, skipped where it would be decoration.",
  },
];

export default function Approach() {
  return (
    <section id="approach" data-tour="approach" className="scroll-mt-16 border-t border-line py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tighter text-bone md:text-5xl">
            How seventy products get shipped by one person.
          </h2>
        </Reveal>
        <div className="mt-14 max-w-2xl space-y-12">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={0.06 * i}>
              <h3 className="text-xl font-semibold text-bone">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-bone-2">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

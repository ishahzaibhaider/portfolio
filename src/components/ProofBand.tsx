import Reveal from "./Reveal";

const stats = [
  { value: "70+", label: "products shipped" },
  { value: "5 yrs", label: "building for production" },
  { value: "4,000+", label: "appointments served on DocoMedo" },
  { value: "2nd", label: "in a national Agentic AI competition" },
];

export default function ProofBand() {
  return (
    <section className="border-y border-line">
      <Reveal>
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-line px-5 md:px-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-5 py-10 first:pl-0 lg:py-12">
              <p className="font-mono text-3xl font-medium text-bone lg:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm leading-snug text-bone-2">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

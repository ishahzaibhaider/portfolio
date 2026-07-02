import { marqueeItems } from "../data/projects";

export default function Marquee() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="overflow-hidden border-b border-line py-8" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((name, i) => (
          <span key={`${name}-${i}`} className="flex items-center gap-8">
            <span className="text-stroke text-4xl font-bold tracking-tight md:text-5xl">
              {name}
            </span>
            <span className="h-2 w-2 rotate-45 bg-ember" />
          </span>
        ))}
      </div>
    </div>
  );
}

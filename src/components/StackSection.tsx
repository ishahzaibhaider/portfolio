"use client";
import Reveal from "./Reveal";

const groups = [
  {
    title: "AI & Agents",
    items: ["LLM Agents", "OpenAI API", "Gemini API", "N8N", "Prompt Engineering", "TensorFlow", "Scikit-learn", "OpenCV"],
    wide: true,
  },
  {
    title: "Web",
    items: ["Next.js", "React", "Node.js", "FastAPI", "Flask", "Tailwind CSS", "TypeScript"],
    wide: false,
  },
  {
    title: "Mobile",
    items: ["SwiftUI", "React Native", "Kotlin", "App Store", "Play Store"],
    wide: false,
  },
  {
    title: "Data & Infra",
    items: ["PostgreSQL", "MongoDB", "Firebase", "Supabase", "Docker", "Linux", "Git"],
    wide: true,
  },
];

export default function StackSection() {
  return (
    <section id="stack" className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10">
        <Reveal>
          <h2 className="text-4xl font-bold tracking-tighter text-bone md:text-5xl">
            The toolbox.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-[2fr_1fr]">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <h3 className="font-mono text-sm text-ember">{g.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-4 py-1.5 text-sm text-bone-2 transition-colors hover:border-bone/40 hover:text-bone"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

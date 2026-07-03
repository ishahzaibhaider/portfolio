import Reveal from "./Reveal";

export default function CasePink3() {
  return (
    <section id="work" data-tour="pink3" className="scroll-mt-16 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 className="text-3xl font-bold tracking-tighter text-bone md:text-5xl">Pink3</h2>
          <p className="mt-3 text-lg text-ember">AI agents that operate the product for you</p>
          <p className="mt-6 max-w-md leading-relaxed text-bone-2">
            A CRM forked from Twenty where the agents do the clicking. Users
            send a message on Discord, Telegram, or WhatsApp, and an AI agent
            navigates the web UI and finishes the task on their behalf.
          </p>
          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-bone-2">
            <li>Agents drive the interface, not the user</li>
            <li>Three messaging platforms wired into one system</li>
            <li>Built on TypeScript, LLM agents, and bot APIs</li>
          </ul>
        </Reveal>
        <Reveal delay={0.12} className="lg:col-span-7">
          <img
            src="/work/pink3-hero.jpg"
            alt="Pink3 landing page, dark interface with pink accents"
            loading="lazy"
            className="w-full rounded-xl ring-1 ring-bone/10"
          />
        </Reveal>
      </div>
    </section>
  );
}

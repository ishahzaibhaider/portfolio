"use client";
import Reveal from "./Reveal";
import GenerativeArt from "./GenerativeArt";

export default function AgentSection() {
  return (
    <section id="agents" className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <h2 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tighter text-bone md:text-6xl">
          National runner-up in Agentic AI, for an agent system that
          <span className="text-ember"> runs itself.</span>
        </h2>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
        <Reveal className="md:col-span-2 md:row-span-2">
          <article className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-line">
            <GenerativeArt style="circuit" seed={77} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="relative flex h-full min-h-[320px] flex-col justify-end p-6 md:p-10">
              <h3 className="text-2xl font-bold tracking-tight text-bone md:text-3xl">
                100+ agents in the wild
              </h3>
              <p className="mt-3 max-w-lg leading-relaxed text-bone-2">
                Bots for Gmail, Instagram, Telegram, and WhatsApp that answer
                DMs, handle email, fire alerts, and run business processes
                without a human in the loop.
              </p>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.08}>
          <article className="h-full rounded-2xl border border-line bg-ink-2 p-6 md:p-8">
            <h3 className="text-xl font-bold tracking-tight text-bone">
              Agents that use software like people do
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-2">
              In Pink3, agents navigate the CRM's actual web UI, clicking
              through screens to finish tasks users hand them in chat.
            </p>
          </article>
        </Reveal>

        <Reveal delay={0.16}>
          <article className="relative h-full overflow-hidden rounded-2xl border border-ember/40 bg-gradient-to-br from-ember/15 to-ink-2 p-6 md:p-8">
            <h3 className="text-xl font-bold tracking-tight text-bone">
              Pipelines in pure Python
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-2">
              When workflow tools cap out, I write the orchestration myself:
              the YouTube pipeline runs scripting to publishing with no N8N at
              all.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle, Flag, ChatCircleText, EnvelopeSimple, Moon, Circle, Lock } from "@phosphor-icons/react";
import { prefersReducedMotion } from "./open";

/**
 * What he is building right now, shown working instead of described. Messages arrive on the left; on the
 * right the assistant writes down what it took from them. Everything here is a reconstruction with invented
 * people and chats: the real assistants run on a client's real numbers, and none of that appears on this page.
 */
type Msg = { t: number; who: string; text: string; me?: boolean; mail?: boolean };
type Rec = { t: number; kind: "task" | "done" | "flag" | "reply" | "quiet" | "step" | "gate"; text: string; sub?: string };
type Scene = { id: string; tab: string; state: string; title: string; msgs: Msg[]; recs: Rec[]; end: number };

const SCENES: Scene[] = [
  {
    id: "owner",
    tab: "Your number",
    state: "Live",
    title: "A business owner's own WhatsApp",
    msgs: [
      { t: 0.6, who: "Faisal · site", text: "I'll send the AC quote by Thursday." },
      { t: 3.4, who: "Noura · accounts", text: "The supplier says last month's invoice is still unpaid." },
      { t: 6.4, who: "Hamad", text: "Done. Keys are with the guard." },
      { t: 9.2, who: "New number", text: "Are you open on Friday?" },
      { t: 12.6, who: "You", text: "Ok, call me after Maghrib.", me: true },
    ],
    recs: [
      { t: 1.8, kind: "task", text: "Faisal: AC quote", sub: "promised for Thursday" },
      { t: 4.7, kind: "flag", text: "Money: a supplier invoice is unpaid", sub: "needs you" },
      { t: 7.6, kind: "done", text: "Hamad: keys handed over", sub: "task closed by his own message" },
      { t: 10.5, kind: "reply", text: "“We're open Friday from 4 pm.”", sub: "sent, because your rule 2 covers opening hours" },
      { t: 13.8, kind: "quiet", text: "You're already in this chat", sub: "it stays quiet: it never talks over you" },
    ],
    end: 19,
  },
  {
    id: "guests",
    tab: "Guest services",
    state: "Live",
    title: "A rental company's guest line",
    msgs: [
      { t: 0.6, who: "Guest · unit 12", text: "The AC isn't cooling and the wifi password on the card is wrong." },
      { t: 4.2, who: "Agent", text: "Sorry! The wifi password is on the fridge door. Sending a technician for the AC.", me: true },
      { t: 8.4, who: "Guest · unit 4", text: "If my deposit isn't back today I'll post a review about this." },
    ],
    recs: [
      { t: 2.0, kind: "task", text: "Unit 12: AC not cooling", sub: "guest request, open" },
      { t: 2.6, kind: "task", text: "Unit 12: wrong wifi password", sub: "guest request, open" },
      { t: 5.6, kind: "done", text: "Unit 12: wifi answered", sub: "one of two requests done; the AC stays open" },
      { t: 9.8, kind: "flag", text: "Deposit dispute, threat of a review", sub: "flag stays open until it's solved, not just answered" },
      { t: 12.4, kind: "quiet", text: "Replies to nobody", sub: "on this number it only keeps track" },
    ],
    end: 17.5,
  },
  {
    id: "bookings",
    tab: "Booking emails",
    state: "In testing",
    title: "Booking emails into the company's own system",
    msgs: [
      { t: 0.6, who: "Booking site", text: "Reservation confirmed · 3 nights · 2 guests", mail: true },
      { t: 9.6, who: "Booking site", text: "Reservation cancelled", mail: true },
    ],
    recs: [
      { t: 1.6, kind: "step", text: "Read the email", sub: "which site, the dates, what was paid" },
      { t: 3.2, kind: "step", text: "Matched exactly one unit", sub: "no match or two matches, and it waits for a person" },
      { t: 4.8, kind: "step", text: "Asked the system: are the dates free?", sub: "" },
      { t: 6.4, kind: "step", text: "Created the booking, once", sub: "on the test copy; the real system is read-only" },
      { t: 10.8, kind: "step", text: "Cancelled the booking it made", sub: "anything it didn't make is left for a person" },
      { t: 12.6, kind: "gate", text: "Going live is not a chat message", sub: "an approval typed to the assistant switches nothing on" },
    ],
    end: 18,
  },
];

const ICON = {
  task: <Circle size={18} weight="bold" className="text-[#9fb3c8]" />,
  done: <CheckCircle size={19} weight="fill" className="text-mint" />,
  flag: <Flag size={18} weight="fill" className="text-[#f2a65a]" />,
  reply: <ChatCircleText size={19} weight="fill" className="text-[#25d366]" />,
  quiet: <Moon size={18} weight="fill" className="text-[#8aa0b8]" />,
  step: <CheckCircle size={19} weight="fill" className="text-mint" />,
  gate: <Lock size={18} weight="fill" className="text-[#f2c56b]" />,
};
const LABEL = { task: "Task", done: "Done", flag: "Needs you", reply: "Reply, by your rule", quiet: "Silent", step: "", gate: "The one rule" };

export default function Assistant() {
  const root = useRef<HTMLElement>(null);
  const [k, setK] = useState(0);
  const [t, setT] = useState(0);
  const [inView, setInView] = useState(false);
  const scene = SCENES[k];
  const chat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) { setT(99); return; }
    setT(0);
  }, [k]);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let raf = 0, last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      setT((x) => {
        const n = x + dt;
        if (n >= scene.end) { setK((i) => (i + 1) % SCENES.length); return 0; }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, scene.end]);

  const msgs = scene.msgs.filter((m) => m.t <= t);
  const recs = scene.recs.filter((r) => r.t <= t);
  const typing = scene.msgs.some((m) => m.t > t && m.t - t < 0.9);
  useEffect(() => {
    const el = chat.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  return (
    <section ref={root} id="assistant" className="relative overflow-hidden bg-[linear-gradient(180deg,#060e18_0%,#0a1a17_45%,#060e18_100%)] px-[var(--g)] py-[clamp(72px,12vh,140px)]">
      <div aria-hidden className="pointer-events-none absolute left-[-10%] top-[20%] h-[60%] w-[60%] rounded-full bg-[#25d366] opacity-[0.07] blur-[140px]" />
      <div className="relative">
        <p className="m-0 mb-3 flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-[#9fd8b8] md:text-[12.5px]">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25d366] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#25d366]" /></span>
          What I'm building now
        </p>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <h2 className="m-0 max-w-[17ch] font-bold leading-[1.02] text-[#eef1ee] text-[clamp(32px,4.6vw,64px)]">An assistant on your business WhatsApp.</h2>
          <p className="m-0 max-w-[42ch] pb-1.5 text-[15.5px] leading-relaxed text-[#c3cfd9] md:text-[17px]">
            It reads your one-to-one chats, writes down who promised what, flags what needs you, and replies only where you wrote a rule. You keep using WhatsApp exactly as before.
          </p>
        </div>

        <div role="tablist" aria-label="Choose what to watch" className="mt-9 flex flex-wrap gap-2">
          {SCENES.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === k} onClick={() => setK(i)}
              className={`flex cursor-pointer items-center gap-2 rounded-[12px] border-0 px-3 py-2 text-[13.5px] md:px-4 md:py-2.5 md:text-[14.5px] transition-colors ${i === k ? "bg-arctic font-semibold text-deep" : "bg-white/[0.05] text-arctic/75 ring-1 ring-white/10 hover:bg-white/[0.1]"}`}>
              {s.tab}
              <span className={`rounded-[6px] px-1.5 py-[1px] text-[10.5px] font-semibold uppercase tracking-[0.06em] ${s.state === "Live" ? (i === k ? "bg-[#25d366]/25 text-[#0b5a2c]" : "bg-[#25d366]/15 text-[#7fe0a6]") : (i === k ? "bg-[#f2b544]/30 text-[#7a5200]" : "bg-[#f2b544]/15 text-[#f2c56b]")}`}>{s.state}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-6">
          {/* what arrives */}
          <div className="overflow-hidden rounded-[20px] bg-[#0d1a22] ring-1 ring-white/10">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
              <span className="flex items-center gap-2 text-[13.5px] font-semibold text-[#e4ebf0]">
                {scene.id === "bookings" ? <EnvelopeSimple size={16} /> : <ChatCircleText size={16} />} {scene.title}
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-steel">{scene.id === "bookings" ? "Inbox" : "Chats"}</span>
            </div>
            <div ref={chat} className="h-[300px] space-y-3 overflow-hidden px-5 py-5 md:h-[440px]">
              {msgs.map((m, i) => (
                <div key={`${scene.id}-${i}`} className={`stage-in flex ${m.me ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-[16px] px-4 py-2.5 ${m.mail ? "w-full max-w-none rounded-[12px] bg-white/[0.06] ring-1 ring-white/10" : m.me ? "rounded-br-[5px] bg-[#1f5b43]" : "rounded-bl-[5px] bg-[#1b2a36]"}`}>
                    <p className={`m-0 text-[11.5px] font-semibold ${m.me ? "text-[#a6e8c3]" : "text-[#8fb0c9]"}`}>{m.mail ? <><EnvelopeSimple size={12} className="-mt-0.5 mr-1 inline" />{m.who}</> : m.who}</p>
                    <p className="m-0 mt-0.5 text-[14.5px] leading-snug text-[#eef3f6]">{m.text}</p>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 px-1 pt-1">
                  {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8fb0c9]" style={{ animationDelay: `${d * 150}ms` }} />)}
                </div>
              )}
            </div>
          </div>

          {/* what the assistant wrote down */}
          <div className="rounded-[20px] bg-[#0f1f1b] ring-1 ring-[#25d366]/15">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
              <span className="text-[13.5px] font-semibold text-[#e4ebf0]">{scene.id === "bookings" ? "What the booking bot did" : "What the assistant recorded"}</span>
              <span className="text-[11px] tabular-nums uppercase tracking-[0.14em] text-steel">{recs.length} / {scene.recs.length}</span>
            </div>
            <ol className="m-0 list-none space-y-2 px-4 py-4 md:px-5 md:py-5">
              {scene.recs.map((r, i) => {
                const on = r.t <= t;
                return (
                  <li key={`${scene.id}-${i}`} className={`flex items-start gap-3 rounded-[12px] px-3 py-2.5 transition-[opacity,transform,background] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "translate-y-0 bg-white/[0.04] opacity-100" : "translate-y-2 opacity-0"} ${r.kind === "gate" && on ? "bg-[#f2b544]/10 ring-1 ring-[#f2b544]/25" : ""}`}>
                    <span className="mt-[1px] shrink-0">{ICON[r.kind]}</span>
                    <span className="min-w-0">
                      {LABEL[r.kind] && <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-steel">{LABEL[r.kind]}</span>}
                      <span className="block text-[14.5px] leading-snug text-[#eef3f6]">{r.text}</span>
                      {r.sub && <span className="mt-0.5 block text-[12.5px] leading-snug text-[#9fb0bf]">{r.sub}</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-5 border-t border-white/[0.08] pt-7 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Answers only by your rules", "No rule, no reply. It never starts a conversation."],
            ["You ask it from your Claude app", "“What did I miss?” “Who owes me what?” Every rule change is logged."],
            ["Two businesses, kept apart", "A second assistant runs on its own server and never sees the first one's chats."],
            ["Nothing goes live by chat", "The booking bot works on a test copy until the go-ahead comes to me directly."],
          ].map(([h, b]) => (
            <div key={h}>
              <p className="m-0 text-[15px] font-semibold text-[#eef1ee]">{h}</p>
              <p className="m-0 mt-1.5 text-[13.5px] leading-relaxed text-[#9fb0bf]">{b}</p>
            </div>
          ))}
        </div>
        <p className="m-0 mt-7 text-[12.5px] text-steel">A reconstruction: every person, chat and email above is invented. The real assistants run on a client's own numbers, and nothing from them is shown here.</p>
      </div>
    </section>
  );
}

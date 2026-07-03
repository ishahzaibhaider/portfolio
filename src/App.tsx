import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ProofBand from "./components/ProofBand";
import CasePink3 from "./components/CasePink3";
import CaseRetaj from "./components/CaseRetaj";
import CaseTajseer from "./components/CaseTajseer";
import StoreGallery from "./components/StoreGallery";
import WorkIndex from "./components/WorkIndex";
import Approach from "./components/Approach";
import Footer from "./components/Footer";
import BuildGate from "./components/BuildGate";
import AgentConsole from "./components/AgentConsole";
import { personas, type Persona, type SectionKey } from "./data/personas";

type Phase = "gate" | "building" | "done";

const SECTIONS: Record<SectionKey, ReactNode> = {
  proof: <ProofBand />,
  pink3: <CasePink3 />,
  retaj: <CaseRetaj />,
  tajseer: <CaseTajseer />,
  stores: <StoreGallery />,
  index: <WorkIndex />,
  approach: <Approach />,
};

export default function App() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("gate");
  const [persona, setPersona] = useState<Persona>("founder");
  const [runId, setRunId] = useState(0);
  // units built so far: 1 = hero, 1+i = first i sections, full = hero + sections + footer
  const [builtCount, setBuiltCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const userTookOver = useRef(false);

  const cfg = personas[persona];
  const totalUnits = 1 + cfg.order.length + 1;

  const choose = (p: Persona) => {
    setPersona(p);
    setElapsed(null);
    if (reduce) {
      setLog([]);
      setBuiltCount(1 + personas[p].order.length + 1);
      setPhase("done");
      return;
    }
    setPhase("building");
    setRunId((r) => r + 1);
  };

  const skip = () => {
    setPersona("founder");
    setElapsed(null);
    setLog([]);
    setBuiltCount(1 + personas.founder.order.length + 1);
    setPhase("done");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const rebuild = (p: Persona) => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    choose(p);
  };

  // the visitor grabbing the wheel stops the autoscroll, never the build
  useEffect(() => {
    if (phase !== "building") return;
    userTookOver.current = false;
    const takeOver = () => {
      userTookOver.current = true;
    };
    window.addEventListener("wheel", takeOver, { passive: true });
    window.addEventListener("touchmove", takeOver, { passive: true });
    return () => {
      window.removeEventListener("wheel", takeOver);
      window.removeEventListener("touchmove", takeOver);
    };
  }, [phase, runId]);

  useEffect(() => {
    if (phase !== "building") return;
    let cancelled = false;
    const timeouts: number[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((r) => timeouts.push(window.setTimeout(r, ms)));
    const config = personas[persona];
    const start = performance.now();

    (async () => {
      setLog([config.ack]);
      setBuiltCount(0);
      window.scrollTo({ top: 0, behavior: "auto" });
      await sleep(1100);
      if (cancelled) return;

      setLog((l) => [...l, "building hero"]);
      setBuiltCount(1);
      await sleep(1500);

      for (let i = 0; i < config.order.length; i++) {
        if (cancelled) return;
        const key = config.order[i];
        setLog((l) => [...l, config.logs[key]]);
        setBuiltCount(2 + i);
        await sleep(200);
        if (!userTookOver.current) {
          document
            .querySelector(`[data-tour="${key}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        await sleep(1250);
      }

      if (cancelled) return;
      setLog((l) => [...l, "wiring contact"]);
      setBuiltCount(config.order.length + 2);
      await sleep(200);
      if (!userTookOver.current) {
        document
          .querySelector('[data-tour="contact"]')
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      await sleep(1100);

      if (cancelled) return;
      const secs = (performance.now() - start) / 1000;
      setLog((l) => [...l, `done in ${secs.toFixed(1)}s. it is all yours now.`]);
      if (!userTookOver.current) {
        document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" });
      }
      await sleep(1800);
      if (cancelled) return;
      setElapsed(secs);
      setPhase("done");
    })();

    return () => {
      cancelled = true;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [phase, runId, persona]);

  if (phase === "gate") {
    return (
      <div className="grain">
        <BuildGate onChoose={choose} onSkip={skip} />
      </div>
    );
  }

  const visibleSections = cfg.order.slice(0, Math.max(0, builtCount - 1));
  const footerBuilt = builtCount >= totalUnits;

  return (
    <div className="grain">
      <Nav
        cta={
          persona === "recruiter"
            ? { label: "Email me", href: "#contact" }
            : { label: "Start a project", href: "#contact" }
        }
      />
      <main>
        {builtCount >= 1 && <Hero config={cfg.hero} />}
        <div id="work" className="scroll-mt-16">
          {visibleSections.map((key) => (
            <motion.div
              key={`${key}-${runId}`}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {SECTIONS[key]}
            </motion.div>
          ))}
        </div>
      </main>
      {footerBuilt && (
        <motion.div
          key={`footer-${runId}`}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Footer config={cfg.footer} />
        </motion.div>
      )}
      <AgentConsole
        phase={phase === "building" ? "building" : "done"}
        lines={log}
        elapsed={elapsed}
        persona={persona}
        onRebuild={rebuild}
      />
    </div>
  );
}

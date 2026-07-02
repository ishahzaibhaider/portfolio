import { useEffect, useState } from "react";
import ParticleUniverse from "./components/ParticleUniverse";
import IntroLoader from "./components/IntroLoader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import MetricsBand from "./components/MetricsBand";
import Marquee from "./components/Marquee";
import FeaturedWork from "./components/FeaturedWork";
import WorkIndex from "./components/WorkIndex";
import AgentSection from "./components/AgentSection";
import StackSection from "./components/StackSection";
import Footer from "./components/Footer";
import { REVEAL_MS } from "./lib/introTiming";

export default function App() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setRevealed(true);
    };

    const minTime = new Promise<void>((r) => window.setTimeout(r, REVEAL_MS));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([minTime, fonts]).then(reveal);

    // Let an impatient visitor skip straight into the site
    window.addEventListener("pointerdown", reveal);
    window.addEventListener("keydown", reveal);
    window.addEventListener("wheel", reveal, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
      window.removeEventListener("wheel", reveal);
    };
  }, []);

  return (
    <div className="grain">
      <ParticleUniverse />
      <IntroLoader revealed={revealed} />
      <div
        className={`relative z-10 transition-opacity duration-[900ms] ease-out ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        <Nav />
        <main>
          <Hero revealed={revealed} />
          <MetricsBand />
          <Marquee />
          <FeaturedWork />
          <WorkIndex />
          <AgentSection />
          <StackSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

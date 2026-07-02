import Nav from "./components/Nav";
import Hero from "./components/Hero";
import MetricsBand from "./components/MetricsBand";
import Marquee from "./components/Marquee";
import FeaturedWork from "./components/FeaturedWork";
import WorkIndex from "./components/WorkIndex";
import AgentSection from "./components/AgentSection";
import StackSection from "./components/StackSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="grain">
      <Nav />
      <main>
        <Hero />
        <MetricsBand />
        <Marquee />
        <FeaturedWork />
        <WorkIndex />
        <AgentSection />
        <StackSection />
      </main>
      <Footer />
    </div>
  );
}

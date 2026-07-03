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
import AgentTour from "./components/AgentTour";

export default function App() {
  return (
    <div className="grain">
      <Nav />
      <main>
        <Hero />
        <ProofBand />
        <CasePink3 />
        <CaseRetaj />
        <CaseTajseer />
        <StoreGallery />
        <WorkIndex />
        <Approach />
      </main>
      <Footer />
      <AgentTour />
    </div>
  );
}

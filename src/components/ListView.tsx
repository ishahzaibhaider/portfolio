import Nav from "./Nav";
import Hero from "./Hero";
import ProofBand from "./ProofBand";
import CasePink3 from "./CasePink3";
import CaseRetaj from "./CaseRetaj";
import CaseTajseer from "./CaseTajseer";
import StoreGallery from "./StoreGallery";
import WorkIndex from "./WorkIndex";
import Approach from "./Approach";
import Footer from "./Footer";
import { StackSimple } from "@phosphor-icons/react";

/** The plain, scrollable version of the canvas content. */
export default function ListView({ onCanvas }: { onCanvas: () => void }) {
  return (
    <>
      <Nav cta={{ label: "Start a project", href: "#contact" }} />
      <main>
        <Hero />
        <div id="work" className="scroll-mt-16">
          <ProofBand />
          <CasePink3 />
          <CaseRetaj />
          <CaseTajseer />
          <StoreGallery />
          <WorkIndex />
          <Approach />
        </div>
      </main>
      <Footer
        config={{
          headline: "Have something that needs to exist?",
          sub: "Tell me what it is. If it can be built, you will get a working version faster than you expect.",
          primary: "email",
        }}
      />
      <button
        type="button"
        onClick={onCanvas}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-bone/20 bg-ink-3/90 px-4 py-2 text-sm text-bone backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
      >
        <StackSimple size={16} />
        Back to the canvas
      </button>
    </>
  );
}

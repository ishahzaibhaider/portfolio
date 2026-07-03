export type Persona = "founder" | "recruiter" | "visitor";

export type SectionKey =
  | "proof"
  | "pink3"
  | "retaj"
  | "tajseer"
  | "stores"
  | "index"
  | "approach";

export interface PersonaConfig {
  /** shown on the gate button */
  gateLabel: string;
  /** what the agent says right after the choice */
  ack: string;
  hero: {
    headline: string;
    sub: string;
    primaryCta: { label: string; href: string };
  };
  footer: {
    headline: string;
    sub: string;
    primary: "email" | "resume";
  };
  order: SectionKey[];
  /** console line logged as each section mounts */
  logs: Record<SectionKey, string>;
}

const baseLogs: Record<SectionKey, string> = {
  proof: "loading proof: 70+ launches, 4,000+ appointments served",
  pink3: "mounting pink3: agents that operate a CRM",
  retaj: "importing retaj rail: 24 screens, two languages",
  tajseer: "mounting tajseer: live on both stores",
  stores: "hanging the store shelf",
  index: "indexing ten more shipped projects",
  approach: "documenting how one person ships seventy products",
};

export const personas: Record<Persona, PersonaConfig> = {
  founder: {
    gateLabel: "A founder with an idea",
    ack: "founder. good. you care about shipped, not promised. building that version.",
    hero: {
      headline: "Products that reach production.",
      sub: "AI systems, mobile apps, and platforms, built end to end for founders. 70+ launches in five years.",
      primaryCta: { label: "Start a project", href: "#contact" },
    },
    footer: {
      headline: "Have something that needs to exist?",
      sub: "Tell me what it is. If it can be built, you will get a working version faster than you expect.",
      primary: "email",
    },
    order: ["proof", "pink3", "retaj", "tajseer", "stores", "index", "approach"],
    logs: baseLogs,
  },
  recruiter: {
    gateLabel: "Hiring for a team",
    ack: "recruiter. then you want depth and range, not adjectives. building that version.",
    hero: {
      headline: "Five years. Seventy shipped systems.",
      sub: "AI engineer and full-stack developer at Ideofuzion. End-to-end ownership across agents, mobile, web, and infrastructure.",
      primaryCta: { label: "Download resume", href: "/Shahzaib_Resume.pdf" },
    },
    footer: {
      headline: "Want the long version?",
      sub: "The resume has dates, stacks, and every deliverable. The inbox answers everything else.",
      primary: "resume",
    },
    order: ["approach", "proof", "pink3", "tajseer", "retaj", "index", "stores"],
    logs: {
      ...baseLogs,
      approach: "starting with how he works, since that is your first question",
      index: "indexing range: web3, extensions, telehealth, trading",
    },
  },
  visitor: {
    gateLabel: "Just looking around",
    ack: "browsing. no pitch then. leading with the good-looking parts.",
    hero: {
      headline: "70+ products. Have a look around.",
      sub: "Real apps and platforms, shipped for real users. Everything on this page exists in production.",
      primaryCta: { label: "See the work", href: "#work" },
    },
    footer: {
      headline: "Enjoyed the shelf?",
      sub: "If something here sparked an idea, the inbox is open.",
      primary: "email",
    },
    order: ["stores", "retaj", "pink3", "tajseer", "proof", "index", "approach"],
    logs: {
      ...baseLogs,
      stores: "opening with the store shelf, since you are here for the visuals",
    },
  },
};

export const gateIntro = [
  "hi. i am the agent that runs this page.",
  "i build it differently depending on who is asking.",
];

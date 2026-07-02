export type ArtStyle = "flowfield" | "circuit" | "waveform" | "orbit" | "grid";

export interface FeaturedProject {
  name: string;
  role: string;
  description: string;
  stack: string[];
  art: ArtStyle;
  meta: string;
}

export interface IndexProject {
  name: string;
  kind: string;
  note: string;
}

export const featured: FeaturedProject[] = [
  {
    name: "Pink3",
    role: "AI-powered CRM",
    description:
      "A customer and resource management platform forked from Twenty CRM. Discord, Telegram, and WhatsApp bots let AI agents navigate the website UI autonomously and execute tasks on behalf of users.",
    stack: ["LLM Agents", "TypeScript", "Twenty CRM", "Bot APIs"],
    art: "orbit",
    meta: "Agents drive the UI, not the user",
  },
  {
    name: "Autonomous YouTube Pipeline",
    role: "Generative media system",
    description:
      "A pure-Python system, no workflow tools, that produces 30-minute YouTube episodes with consistent characters. It handles scripting, voiceover, scene generation, and publishing on its own.",
    stack: ["Python", "Gemini API", "OpenAI API", "TTS"],
    art: "waveform",
    meta: "Script to published video, zero hands",
  },
  {
    name: "TulipATS",
    role: "Hiring-funnel automation",
    description:
      "A fully functional applicant tracking platform that wires multiple recruitment tools into one pipeline, streamlining candidate tracking from first touch to hire.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Automation"],
    art: "grid",
    meta: "End-to-end candidate tracking",
  },
  {
    name: "Zero-Trace VPN",
    role: "Privacy infrastructure",
    description:
      "A privacy-focused VPN service programmed, debugged, and deployed from scratch. Live and operational, serving real users in production.",
    stack: ["Networking", "Linux", "Backend", "Security"],
    art: "circuit",
    meta: "Built from scratch, live today",
  },
  {
    name: "Tajseer",
    role: "Fintech, iOS and Android",
    description:
      "A loan management and disbursement app. Core features, a pixel-accurate admin panel implemented from Figma, and store deployment, all shipped.",
    stack: ["React Native", "Figma", "Firebase", "Deployment"],
    art: "flowfield",
    meta: "Live on both stores",
  },
];

export const index: IndexProject[] = [
  { name: "RealCrowd", kind: "iOS", note: "Social discovery for the most populated venues in the UAE, live on the App Store" },
  { name: "TabibFinder", kind: "iOS", note: "Doctor appointment booking, live on the App Store" },
  { name: "Tarteeb", kind: "iOS + Android", note: "Laundry pickup, tracking, and management, cross-platform" },
  { name: "Sparkline", kind: "Mobile", note: "Owned end-to-end development: events, realtime sockets, production build" },
  { name: "RentyRoyz", kind: "Ops systems", note: "Operational systems for a lease-furnish-list Airbnb real-estate business" },
  { name: "DocoMedo", kind: "Telehealth", note: "Full-stack platform that carried 4,000+ online appointments" },
  { name: "Zencore", kind: "Chrome extension", note: "Web wallet converted to an extension, wallet integration and browser security solved" },
  { name: "Cryptoket", kind: "Web3", note: "Blockchain marketplace deployed and optimized on production servers" },
  { name: "Wasatah", kind: "POC", note: "Workflow orchestration prototype with backend APIs" },
  { name: "Pine Script Indicator", kind: "Trading", note: "TradingView entry and exit signals for spot and futures markets" },
];

export const marqueeItems = [
  "Pink3",
  "TulipATS",
  "Zero-Trace VPN",
  "Tajseer",
  "RealCrowd",
  "TabibFinder",
  "Tarteeb",
  "Sparkline",
  "DocoMedo",
  "Zencore",
  "Cryptoket",
  "RentyRoyz",
];

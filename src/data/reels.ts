export interface Reel {
  slug: string;
  name: string;
  /** one sentence a founder reads in two seconds */
  line: string;
  meta: string;
  /** the product's own accent: it lights the theater while its film plays */
  glow: string;
  /** which act of the site it belongs to */
  act?: "apps" | "platforms" | "ai";
}

export const acts = {
  apps: { n: "01", title: "Apps in people's pockets", line: "Booked, paid, delivered, collected: real users, on real phones." },
  platforms: { n: "02", title: "Platforms businesses run on", line: "Dashboards, workflows and back offices where downtime costs somebody money." },
  ai: { n: "03", title: "Software that makes things by itself", line: "Pipelines that write, voice, render and publish with nobody at the controls." },
} as const;

/**
 * Each film is code, not video: it runs live in the visitor's browser from the product's real screens
 * (the real app was run, tapped through and captured). Built in ClaudeVideoGen/projects/portfolio-reels;
 * each bundle lives in public/reels/<slug>/ (~0.7 MB), with a first-frame poster per format beside it.
 */
export const reels: Reel[] = [
  {
    slug: "nayfaat",
    name: "Nayfaat",
    line: "A private desert house near Riyadh, booked end to end in the app, in Arabic and English.",
    meta: "iOS and Android · bookings and payments",
    glow: "#C46237",
    act: "apps",
  },
  {
    slug: "retaj",
    name: "Retaj",
    line: "Home services for Saudi Arabia: customers book, supervisors dispatch, technicians work, admins see it all live.",
    meta: "iOS and Android · four roles · Arabic and English",
    glow: "#3E7FC1",
    act: "apps",
  },
  {
    slug: "var",
    name: "VAR",
    line: "Laundry operations for Saudi shops: owners take orders, staff process them, drivers pick up and deliver, every bag on a QR.",
    meta: "iOS and Android · live on both stores · three roles",
    glow: "#4F46E5",
    act: "apps",
  },
  {
    slug: "tabibfinder",
    name: "TabibFinder",
    line: "Every doctor in Saudi Arabia on one live map: search a city, tap a pin, call the clinic.",
    meta: "iOS · live on the App Store",
    glow: "#00D4C4",
    act: "apps",
  },
  {
    slug: "visiontools",
    name: "Vision Tools",
    line: "A stationery store in Syria, open in one app: browse, add to cart, pay the courier in cash. Arabic first.",
    meta: "iOS and Android · shopping · Arabic and English",
    glow: "#14A394",
    act: "apps",
  },
  {
    slug: "thikana",
    name: "Thikana",
    line: "Hostel management for Pakistan: collect rent on the phone and the books update on the web, every rupee audited.",
    meta: "Web, Android and iOS · live demo hostel · Urdu and English",
    glow: "#B7F04B",
    act: "platforms",
  },
  {
    slug: "rentroyz",
    name: "RentRoyz",
    line: "Property management in Saudi Arabia, end to end: a revenue estimate for owners, then inspections they approve in one tap.",
    meta: "Website · inspection portal · owner app",
    glow: "#C46237",
    act: "platforms",
  },
  {
    slug: "flowbank",
    name: "FlowBank",
    line: "A workflow builder for bank operations: draw a process on a canvas, run it, and every risky step waits for four-eyes approval.",
    meta: "Web platform · workflow canvas · approvals · audit trail",
    glow: "#B8975A",
    act: "platforms",
  },
  {
    slug: "inspiredanalyst",
    name: "Inspired Analyst",
    line: "Research, Shariah screening, mentorship bookings and a Binance-linked portfolio, for a trading analyst and his members.",
    meta: "Web platform · Stripe, Calendly, Binance · admin",
    glow: "#DE50EC",
    act: "platforms",
  },
  {
    slug: "memoriallink",
    name: "MemorialLink",
    line: "Helps grieving families memorialize or close a loved one's accounts, sending each request through every platform's own official channel.",
    meta: "Web platform · family tracker · operator desk",
    glow: "#1E4D3F",
    act: "platforms",
  },
  {
    slug: "wasatah",
    name: "Wasatah",
    line: "A real-estate proof of concept for Saudi Arabia: verified identity, offers and deed transfers recorded on a ledger. Built in two weeks.",
    meta: "Web proof of concept · KYC · ledger explorer · risk flags",
    glow: "#6366F1",
    act: "platforms",
  },
  {
    slug: "hiringpipeline",
    name: "Tulip ATS",
    line: "A hiring pipeline built for Ideofuzion: one funnel from first touch to signed hire, with calendar links and live interview AI.",
    meta: "Web platform · kanban pipeline · interview AI",
    glow: "#47A3FF",
    act: "platforms",
  },
  {
    slug: "bostononcology",
    name: "Boston Oncology",
    line: "Purchase order to goods receipt, automated: procurement, logistics, warehouse and admin on one audited flow.",
    meta: "Web proof of concept · four roles · GRN matching",
    glow: "#0461F7",
    act: "platforms",
  },
  {
    slug: "vyspir",
    name: "Vyspir",
    line: "The studio's own site: a dark hub with a scroll-driven work reel and a light page for every product, in Arabic and English.",
    meta: "Website · Next.js · EN / AR",
    glow: "#FF5C1A",
    act: "platforms",
  },
  {
    slug: "websites",
    name: "Websites",
    line: "Forty live websites: seven for clients from facility management to home services, and thirty-three for small businesses.",
    meta: "Next.js · Arabic and English · Vercel",
    glow: "#F2B544",
    act: "platforms",
  },
  {
    slug: "aiepisode",
    name: "AiEpisode",
    line: "An AI pipeline that writes, draws, checks, animates and voices character-consistent episodes: 26 shots each, 10 minutes rendered so far.",
    meta: "Python · Claude, gpt-image-1, Kling, ElevenLabs, ffmpeg",
    glow: "#FFC531",
    act: "ai",
  },
  {
    slug: "historychannel",
    name: "Mind Blown",
    line: "A YouTube science channel that runs itself: a cron job picks a topic, writes, narrates, renders and publishes. 48 videos went out on schedule.",
    meta: "GitHub Actions, GPT-4o, Remotion, YouTube API · frames re-rendered from its own templates",
    glow: "#F5B53D",
    act: "ai",
  },
  {
    slug: "claudevideogen",
    name: "ClaudeVideoGen",
    line: "The studio that made every film on this page: agents run each real app, capture it, and the films are written as code and shipped live.",
    meta: "Claude agents · Playwright · Chromium · ffmpeg",
    glow: "#74C69D",
    act: "ai",
  },
];

export const reelFilm = (slug: string, tall: boolean) => `/reels/${slug}/film/index.html?fmt=${tall ? "4x5" : "16x9"}&live`;
export const reelPoster = (slug: string, tall: boolean) => `/reels/${slug}-${tall ? "4x5" : "16x9"}.webp`;
export const reelIcon = (slug: string) => `/reels/${slug}-icon.webp`;

/** apps that have a full scroll-driven chapter (the wall's click targets) */
export const chapterIds = reels.map((r) => r.slug);

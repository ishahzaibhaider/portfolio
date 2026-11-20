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
  /** what the film shows: a phone, a browser window, or a pipeline */
  device?: "phone" | "web" | "pipe";
  /** plays on the stage, before the grid */
  flagship?: boolean;
  /** an honest state, shown only where it matters ("In testing") */
  state?: string;
  /** no film: real screenshots only */
  shots?: { phones?: string[]; web?: string; icon?: string; note?: string; cover?: string };
  /** opens a section of this page instead of the full-screen view */
  href?: string;
  /** somewhere to see more of it */
  link?: { href: string; label: string };
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
    device: "phone",
    flagship: true,
    name: "Nayfaat",
    line: "A private desert house near Riyadh, booked end to end in the app, in Arabic and English.",
    meta: "iOS and Android · bookings and payments",
    glow: "#C46237",
    act: "apps",
  },
  {
    slug: "retaj",
    device: "phone",
    flagship: true,
    name: "Retaj",
    line: "Home services for Saudi Arabia: customers book, supervisors dispatch, technicians work, admins see it all live.",
    meta: "iOS and Android · four roles · Arabic and English",
    glow: "#3E7FC1",
    act: "apps",
  },
  {
    slug: "var",
    device: "phone",
    name: "VAR",
    line: "Laundry operations for Saudi shops: owners take orders, staff process them, drivers pick up and deliver, every bag on a QR. Since November its payment account also takes the company's online store payments, through a signed link that expires in 30 minutes.",
    meta: "iOS and Android · 1.1.0, a new look · three roles",
    glow: "#4F46E5",
    act: "apps",
  },
  {
    slug: "tabibfinder",
    device: "phone",
    name: "TabibFinder",
    line: "Every doctor in Saudi Arabia on one live map: search a city, tap a pin, call the clinic.",
    meta: "iOS · live on the App Store",
    glow: "#00D4C4",
    act: "apps",
  },
  {
    slug: "visiontools",
    device: "phone",
    name: "Vision Tools",
    line: "A stationery store in Syria, open in one app: browse, add to cart, pay the courier in cash. Arabic first.",
    meta: "iOS and Android · shopping · Arabic and English",
    glow: "#14A394",
    act: "apps",
  },
  {
    slug: "sparkline",
    device: "phone",
    name: "Sparkline",
    line: "Campus events pinned to a live map, with realtime chat: find what's on tonight, join it, and the conversation is already going.",
    meta: "iOS and Android · realtime",
    glow: "#0564F9",
    act: "apps",
  },
  {
    slug: "thikana",
    device: "web",
    flagship: true,
    name: "Thikana",
    line: "Hostel management for Pakistan: collect rent on the phone and the books update on the web, every rupee audited.",
    meta: "Web, Android and iOS · live demo hostel · Urdu and English",
    glow: "#B7F04B",
    act: "platforms",
  },
  {
    slug: "rentroyz",
    device: "web",
    name: "RentRoyz",
    line: "Property management in Saudi Arabia, end to end: a revenue estimate for owners, then inspections they approve in one tap.",
    meta: "Website · inspection portal · owner app",
    glow: "#C46237",
    act: "platforms",
  },
  {
    slug: "flowbank",
    device: "web",
    flagship: true,
    name: "FlowBank",
    line: "A workflow builder for bank operations: draw a process on a canvas, run it, and every risky step waits for four-eyes approval.",
    meta: "Web platform · workflow canvas · approvals · audit trail",
    glow: "#B8975A",
    act: "platforms",
  },
  {
    slug: "inspiredanalyst",
    device: "web",
    name: "Inspired Analyst",
    line: "Research, Shariah screening, mentorship bookings and a Binance-linked portfolio, for a trading analyst and his members.",
    meta: "Web platform · Stripe, Calendly, Binance · admin",
    glow: "#DE50EC",
    act: "platforms",
  },
  {
    slug: "memoriallink",
    device: "web",
    name: "MemorialLink",
    line: "Helps grieving families memorialize or close a loved one's accounts, sending each request through every platform's own official channel.",
    meta: "Web platform · family tracker · operator desk",
    glow: "#1E4D3F",
    act: "platforms",
  },
  {
    slug: "wasatah",
    device: "web",
    name: "Wasatah",
    line: "A real-estate proof of concept for Saudi Arabia: verified identity, offers and deed transfers recorded on a ledger. Built in two weeks.",
    meta: "Web proof of concept · KYC · ledger explorer · risk flags",
    glow: "#6366F1",
    act: "platforms",
  },
  {
    slug: "hiringpipeline",
    device: "web",
    name: "Tulip ATS",
    line: "A hiring pipeline built for Ideofuzion: one funnel from first touch to signed hire, with calendar links and live interview AI.",
    meta: "Web platform · kanban pipeline · interview AI",
    glow: "#47A3FF",
    act: "platforms",
  },
  {
    slug: "bostononcology",
    device: "web",
    name: "Boston Oncology",
    line: "Purchase order to goods receipt, automated: procurement, logistics, warehouse and admin on one audited flow.",
    meta: "Web proof of concept · four roles · GRN matching",
    glow: "#0461F7",
    act: "platforms",
  },
  {
    slug: "vyspir",
    device: "web",
    name: "Vyspir",
    line: "The studio's own site: a dark hub with a scroll-driven work reel and a light page for every product, in Arabic and English.",
    meta: "Website · Next.js · EN / AR",
    glow: "#FF5C1A",
    act: "platforms",
  },
  {
    slug: "websites",
    device: "web",
    name: "Websites",
    line: "Forty live websites: seven for clients from facility management to home services, and thirty-three for small businesses.",
    meta: "Next.js · Arabic and English · Vercel",
    glow: "#F2B544",
    act: "platforms",
  },
  {
    slug: "aiepisode",
    device: "pipe",
    flagship: true,
    name: "AiEpisode",
    line: "An AI pipeline that writes, draws, checks, animates and voices character-consistent episodes: 26 shots each, 10 minutes rendered so far.",
    meta: "Python · Claude, gpt-image-1, Kling, ElevenLabs, ffmpeg",
    glow: "#FFC531",
    act: "ai",
  },
  {
    slug: "historychannel",
    device: "phone",
    name: "Mind Blown",
    line: "A YouTube science channel that runs itself: a cron job picks a topic, writes, narrates, renders and publishes. 48 videos went out on schedule.",
    meta: "GitHub Actions, GPT-4o, Remotion, YouTube API · frames re-rendered from its own templates",
    glow: "#F5B53D",
    act: "ai",
  },
  {
    slug: "claudevideogen",
    device: "pipe",
    name: "ClaudeVideoGen",
    line: "The studio that made every film on this page: agents run each real app, capture it, and the films are written as code and shipped live.",
    meta: "Claude agents · Playwright · Chromium · ffmpeg",
    glow: "#74C69D",
    act: "ai",
  },
];

/** shipped products with real screenshots but no running build to film */
export const stills: Reel[] = [
  {
    slug: "assistant",
    name: "WhatsApp assistant",
    line: "An assistant on a business owner's own WhatsApp: it writes down who promised what, flags what needs him, and replies only where he wrote a rule. A second one runs his rental company's guest-services number.",
    meta: "Claude · WhatsApp Business · live since November",
    glow: "#25d366",
    act: "ai",
    device: "phone",
    state: "Live",
    href: "assistant",
    shots: { icon: "/work/new/assistant-icon.svg", cover: "/work/new/assistant-demo.webp" },
  },
  {
    slug: "jarrib",
    name: "Jarrib",
    line: "A puzzle game in Arabic, and my first in Unity: four kinds of puzzle earn tickets toward a monthly prize draw. The server counts every ticket, never the phone, and each month exports for the official draw.",
    meta: "iOS and Android · Unity · live on both stores",
    glow: "#7c4dff",
    act: "apps",
    device: "phone",
    shots: { phones: ["/work/new/jarrib/home.webp", "/work/new/jarrib/jigsaw.webp", "/work/new/jarrib/slide.webp", "/work/new/jarrib/draw.webp"], icon: "/work/puzzle/icon.webp" },
  },
  {
    slug: "reels",
    name: "Rizvi Builds reels",
    line: "Thirteen short films on Instagram since 12 October, each one rendered from code: a three.js scene, generated voices, headless Chrome. Nobody edits them by hand.",
    meta: "three.js · ElevenLabs · Chromium · about one a week",
    glow: "#e8743b",
    act: "ai",
    device: "phone",
    shots: { phones: ["/work/new/reels/r14.webp", "/work/new/reels/r12.webp", "/work/new/reels/r07.webp", "/work/new/reels/r03.webp"], note: "The first frame of four of the reels." },
    link: { href: "https://www.instagram.com/rizvi.builds/", label: "Watch on Instagram" },
  },
  {
    slug: "vetdesk",
    name: "Vet clinic front desk",
    line: "An AI front desk built in three hours at a university agents competition: Claude picks one of four tools, a rule engine checks every clinic rule against the live calendar, and a Truth Guard means it can never say 'booked' when nothing was. It made the top six.",
    meta: "n8n · Claude · Google Calendar · Discord alerts",
    glow: "#ea4b71",
    act: "ai",
    device: "web",
    shots: { web: "/work/new/arena/agent.webp", note: "The real workflow, rendered from n8n's own canvas." },
  },
  {
    slug: "infinityfx",
    name: "Infinity FX",
    line: "A Chrome extension I built for myself in an afternoon: hand gestures on the webcam trigger effects in real calls. Snap and you dissolve, draw a circle and a portal opens. It all runs on the laptop; no video leaves it.",
    meta: "Chrome extension · MediaPipe, on-device · v1.1.0",
    glow: "#ff8a1f",
    act: "ai",
    device: "web",
    shots: { web: "/work/new/fx/banner.svg", note: "The extension's own banner." },
  },
  {
    slug: "buildtracker",
    name: "Build tracker",
    line: "One page for a client's build: every section of four platforms and every fix, who reported it and who closed it. A static page the same morning, then a database and sign-in with roles.",
    meta: "Web · five roles · live since 12 November",
    glow: "#2f6b3f",
    act: "platforms",
    device: "web",
    shots: { web: "/work/new/tracker/web.webp", phones: ["/work/new/tracker/phone.webp"], note: "The real page, shown with invented names and items." },
  },
  {
    slug: "tajseer",
    name: "Tajseer",
    line: "Shariah-compliant loan management and disbursement across web, iOS and Android, with a pixel-accurate admin panel.",
    meta: "Fintech · both stores · web admin",
    glow: "#1f8a70",
    act: "apps",
    device: "phone",
    shots: { phones: ["/work/tajseer-welcome.png", "/work/tajseer-lender-home.png"], web: "/work/tajseer-web-hero.jpg" },
  },
  {
    slug: "realcrowd",
    name: "RealCrowd",
    line: "Where is the crowd tonight? Live venue heat across the UAE, answered in one glance.",
    meta: "iOS · live on the App Store",
    glow: "#8b5cf6",
    act: "apps",
    device: "phone",
    shots: { phones: ["/work/realcrowd-store.jpg"] },
  },
  {
    slug: "pink3",
    name: "Pink3",
    line: "A CRM where AI does the clicking: message it from Discord, Telegram or WhatsApp and an agent drives the web UI to finish the task.",
    meta: "AI agents · forked on Twenty CRM",
    glow: "#e5488f",
    act: "ai",
    device: "web",
    shots: { web: "/work/pink3-hero.jpg" },
  },
];

/** everything on the page, films first inside each act */
/** the grid's order: newest and strongest first, the three kinds of work interleaved */
const ORDER = ["assistant", "nayfaat", "var", "jarrib", "thikana", "reels", "retaj", "flowbank", "aiepisode", "tabibfinder", "rentroyz", "vetdesk", "sparkline", "inspiredanalyst", "claudevideogen", "visiontools", "buildtracker", "infinityfx", "memoriallink", "wasatah", "hiringpipeline", "historychannel", "bostononcology", "vyspir", "websites", "tajseer", "pink3", "realcrowd"];
const rank = (slug: string) => { const i = ORDER.indexOf(slug); return i < 0 ? 999 : i; };
export const work: Reel[] = [...reels, ...stills].sort((a, b) => rank(a.slug) - rank(b.slug));
/** what the full-screen view steps through */
export const viewable = work.filter((r) => !r.href);
export const flagships = reels.filter((r) => r.flagship);
export const bySlug = (slug: string) => work.find((r) => r.slug === slug);

export const reelFilm = (slug: string, tall: boolean) => `/reels/${slug}/film/index.html?fmt=${tall ? "4x5" : "16x9"}&live`;
export const reelPoster = (slug: string, tall: boolean) => `/reels/${slug}-${tall ? "4x5" : "16x9"}.webp`;
export const reelIcon = (slug: string) => `/reels/${slug}-icon.webp`;

/** apps that have a full scroll-driven chapter (the wall's click targets) */
export const chapterIds = reels.map((r) => r.slug);

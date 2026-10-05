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
];

export const reelFilm = (slug: string, tall: boolean) => `/reels/${slug}/film/index.html?fmt=${tall ? "4x5" : "16x9"}&live`;
export const reelPoster = (slug: string, tall: boolean) => `/reels/${slug}-${tall ? "4x5" : "16x9"}.webp`;
export const reelIcon = (slug: string) => `/reels/${slug}-icon.webp`;

/** apps that have a full scroll-driven chapter (the wall's click targets) */
export const chapterIds = reels.map((r) => r.slug);

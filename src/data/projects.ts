export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  /** relative visual weight in the masonry: tall phone shots vs shorter cards */
  tall?: boolean;
}

export interface IndexProject {
  name: string;
  kind: string;
  note: string;
}

export const retajScreens = [
  { src: "/work/retaj-customer-home.png", alt: "Retaj customer home screen with service categories" },
  { src: "/work/retaj-customer-services.png", alt: "Retaj services list with prices and ratings" },
  { src: "/work/retaj-customer-service-detail.png", alt: "Retaj deep home cleaning service detail" },
  { src: "/work/retaj-customer-confirmation.png", alt: "Retaj order confirmation screen" },
  { src: "/work/retaj-technician-jobs.png", alt: "Retaj technician jobs queue" },
  { src: "/work/retaj-admin-dashboard.png", alt: "Retaj admin revenue dashboard" },
];

export const storeGallery: GalleryItem[] = [
  {
    src: "/work/realcrowd-store.jpg",
    alt: "RealCrowd App Store screenshot showing a live city map",
    caption: "RealCrowd. Live-crowd discovery across the UAE, on the App Store.",
    tall: true,
  },
  {
    src: "/work/tabibfinder-store.jpg",
    alt: "TabibFinder App Store screenshot showing doctors on a map of Saudi Arabia",
    caption: "TabibFinder. Doctor booking across Saudi Arabia, on the App Store.",
    tall: true,
  },
  {
    src: "/work/sparkline-map.png",
    alt: "Sparkline campus map with live event pins",
    caption: "Sparkline. Campus events with realtime sockets, production build shipped.",
    tall: true,
  },
  {
    src: "/work/vpn-connected.png",
    alt: "Zero-Trace VPN connected screen with session timer",
    caption: "Zero-Trace VPN. Built from scratch, live with real users.",
    tall: true,
  },
  {
    src: "/work/var-owner.jpg",
    alt: "VAR laundry owner dashboard with order pipeline",
    caption: "VAR. Laundry operations app for owners, Arabic-first.",
    tall: true,
  },
  {
    src: "/work/rentroyz-hero.jpg",
    alt: "RentRoyz property management landing page",
    caption: "RentRoyz. Operations systems for an Airbnb real-estate business.",
  },
];

export const index: IndexProject[] = [
  { name: "TulipATS", kind: "Platform", note: "Hiring-funnel automation wiring recruitment tools into one pipeline" },
  { name: "DocoMedo", kind: "Telehealth", note: "Full-stack platform that carried 4,000+ online appointments" },
  { name: "YouTube Pipeline", kind: "AI system", note: "Pure Python, produces and publishes 30-minute episodes on its own" },
  { name: "Automation Agents", kind: "AI systems", note: "100+ bots for Gmail, Instagram, Telegram, and WhatsApp" },
  { name: "Inspired Analyst", kind: "Web", note: "Dark iridescent research platform for finance and crypto" },
  { name: "Tarteeb", kind: "iOS + Android", note: "Laundry pickup, tracking, and management, cross-platform" },
  { name: "Zencore", kind: "Chrome extension", note: "Web wallet turned extension, browser security solved" },
  { name: "Cryptoket", kind: "Web3", note: "Blockchain marketplace deployed on production servers" },
  { name: "Wasatah", kind: "POC", note: "Workflow orchestration prototype with backend APIs" },
  { name: "Pine Script Indicator", kind: "Trading", note: "TradingView entry and exit signals for spot and futures" },
];

export const contact = {
  email: "shahzaibhaider161@gmail.com",
  linkedin: "https://www.linkedin.com/in/syed-shahzaib-haider-rizvi",
  resume: "/Shahzaib_Resume.pdf",
};

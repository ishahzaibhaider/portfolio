export interface Station {
  kind: "station";
  name: string;
  body: string;
  meta: string;
  img: string;
  alt: string;
  /** wide screenshots become valley billboards instead of phone camps */
  wide?: boolean;
  tilt: number;
  flip?: boolean;
}

export interface Milestone {
  kind: "milestone";
  name: string;
  body: string;
  meta: string;
}

export type Camp = Station | Milestone;

export interface Chapter {
  kicker: string;
  title: string;
  lead: string;
  camps: Camp[];
}

export const chapters: Chapter[] = [
  {
    kicker: "Chapter one · Base camp",
    title: "Every climb starts in the dark.",
    lead: "Fifty client websites before sunrise. Then the first real summits: apps on real stores, carrying real users.",
    camps: [
      {
        kind: "station",
        name: "TabibFinder",
        body: "Every doctor in Saudi Arabia on one map, booked in a tap. Still up there, still taking appointments.",
        meta: "iOS · live on the App Store",
        img: "/work/tabibfinder-store.jpg",
        alt: "TabibFinder on the App Store, doctors across Saudi Arabia on a map",
        tilt: -1.4,
      },
      {
        kind: "station",
        name: "Retaj",
        body: "Home services for the Saudi market. Twenty-four screens, four roles, two languages, one person building all of it.",
        meta: "Design and build · Arabic and English",
        img: "/work/retaj-customer-home.png",
        alt: "Retaj customer home screen with service categories",
        tilt: 1.2,
        flip: true,
      },
      {
        kind: "station",
        name: "Sparkline",
        body: "Campus events pinned to a live map, riding realtime sockets. Owned end to end through the production build.",
        meta: "iOS and Android · realtime",
        img: "/work/sparkline-map.png",
        alt: "Sparkline live campus map with event pins",
        tilt: -0.9,
      },
    ],
  },
  {
    kicker: "Chapter two · The stores",
    title: "Real users. Real reviews. Real weather.",
    lead: "Apps live where the audience is unforgiving. These four are out there right now.",
    camps: [
      {
        kind: "station",
        name: "RealCrowd",
        body: "Where is the crowd tonight? Live venue heat across the UAE, answered in one glance.",
        meta: "iOS · live on the App Store",
        img: "/work/realcrowd-store.jpg",
        alt: "RealCrowd App Store screenshot with a live city map",
        tilt: 1.3,
        flip: true,
      },
      {
        kind: "station",
        name: "Tajseer",
        body: "Loan management and disbursement, Shariah-compliant, spanning web, iOS, and Android with a pixel-accurate admin panel.",
        meta: "Fintech · both stores",
        img: "/work/tajseer-welcome.png",
        alt: "Tajseer mobile welcome screen",
        tilt: -1.1,
      },
      {
        kind: "station",
        name: "Zero-Trace VPN",
        body: "Privacy infrastructure programmed, debugged, and deployed from scratch. Real traffic runs through it today.",
        meta: "Networking · live service",
        img: "/work/vpn-connected.png",
        alt: "Zero-Trace VPN connected screen with session timer",
        tilt: 1.0,
        flip: true,
      },
      {
        kind: "station",
        name: "VAR",
        body: "Laundry operations for owners, Arabic-first: orders, pipeline, delivery, all in one hand.",
        meta: "Operations · Arabic-first",
        img: "/work/var-owner.jpg",
        alt: "VAR laundry owner dashboard with order pipeline",
        tilt: -1.2,
      },
    ],
  },
  {
    kicker: "Chapter three · The platforms",
    title: "Systems that carry businesses.",
    lead: "Higher altitude, heavier loads: platforms where downtime costs somebody money.",
    camps: [
      {
        kind: "station",
        name: "RentRoyz",
        body: "A real-estate operation that leases, furnishes, and lists on Airbnb, run on systems built for it end to end.",
        meta: "Web platform · operations",
        img: "/work/rentroyz-hero.jpg",
        alt: "RentRoyz property management landing page",
        wide: true,
        tilt: -0.6,
      },
      {
        kind: "milestone",
        name: "DocoMedo",
        body: "Telehealth platform that carried more than four thousand online appointments. UI, database schema, and user flow, all one pair of hands.",
        meta: "Telehealth · 4,000+ appointments",
      },
      {
        kind: "station",
        name: "Retaj, behind the counter",
        body: "The same product, seen from the admin chair: revenue, orders, technicians, all live.",
        meta: "Admin · revenue dashboard",
        img: "/work/retaj-admin-dashboard.png",
        alt: "Retaj admin revenue dashboard",
        tilt: 1.1,
        flip: true,
      },
      {
        kind: "milestone",
        name: "TulipATS",
        body: "A hiring funnel that wires recruitment tools into one pipeline, from first touch to hire.",
        meta: "Automation · recruiting",
      },
    ],
  },
  {
    kicker: "Chapter four · The agents",
    title: "Software that operates software.",
    lead: "The last stretch before the summit is where the work starts doing itself.",
    camps: [
      {
        kind: "station",
        name: "Pink3",
        body: "A CRM where agents do the clicking. Users message from Discord, Telegram, or WhatsApp, and an AI drives the web UI to finish the task.",
        meta: "AI agents · forked on Twenty CRM",
        img: "/work/pink3-hero.jpg",
        alt: "Pink3 CRM landing page, dark interface with pink accents",
        wide: true,
        tilt: 0.6,
      },
      {
        kind: "milestone",
        name: "The YouTube pipeline",
        body: "Pure Python, no workflow tools: thirty-minute episodes with consistent characters, scripted, voiced, rendered, and published with zero hands.",
        meta: "Generative media · autonomous",
      },
      {
        kind: "milestone",
        name: "A hundred quiet bots",
        body: "Gmail, Instagram, Telegram, WhatsApp: a hundred-plus agents answering, alerting, and moving business processes at night.",
        meta: "Automation · 100+ agents",
      },
    ],
  },
];

export const contact = {
  email: "shahzaibhaider161@gmail.com",
  linkedin: "https://www.linkedin.com/in/syed-shahzaib-haider-rizvi",
  resume: "/Shahzaib_Resume.pdf",
};

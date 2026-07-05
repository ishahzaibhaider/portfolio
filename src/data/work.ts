export interface WorkItem {
  name: string;
  /** one tweet-length sentence; nobody reads more than that while skimming */
  line: string;
  meta: string;
  img?: string;
  w?: number;
  h?: number;
  /** wide screenshots stage as billboards instead of phones */
  wide?: boolean;
  /** products with no screenshot stage as a big number and what it means */
  big?: string;
  sub?: string;
}

export interface WorkGroup {
  label: string;
  note: string;
  items: WorkItem[];
}

export const workGroups: WorkGroup[] = [
  {
    label: "In the stores",
    note: "Live apps, real users",
    items: [
      {
        name: "TabibFinder",
        line: "Every doctor in Saudi Arabia on one map, booked in a tap.",
        meta: "iOS · live on the App Store",
        img: "/work/tabibfinder-store.jpg",
        w: 647,
        h: 1400,
      },
      {
        name: "Retaj",
        line: "Home services for the Saudi market: twenty-four screens, four roles, two languages, one builder.",
        meta: "iOS and Android · design and build",
        img: "/work/retaj-customer-home.png",
        w: 784,
        h: 1652,
      },
      {
        name: "Sparkline",
        line: "Campus events pinned to a live map, riding realtime sockets.",
        meta: "iOS and Android · realtime",
        img: "/work/sparkline-map.png",
        w: 375,
        h: 812,
      },
      {
        name: "RealCrowd",
        line: "Where is the crowd tonight? Live venue heat across the UAE, answered in one glance.",
        meta: "iOS · live on the App Store",
        img: "/work/realcrowd-store.jpg",
        w: 647,
        h: 1400,
      },
      {
        name: "Tajseer",
        line: "Shariah-compliant loan management and disbursement across web, iOS, and Android.",
        meta: "Fintech · both stores",
        img: "/work/tajseer-welcome.png",
        w: 402,
        h: 874,
      },
      {
        name: "Zero-Trace VPN",
        line: "Privacy infrastructure built from scratch. Real traffic runs through it today.",
        meta: "Networking · live service",
        img: "/work/vpn-connected.png",
        w: 390,
        h: 844,
      },
      {
        name: "VAR",
        line: "Laundry operations for owners, Arabic-first: orders, pipeline, delivery, one hand.",
        meta: "Operations · Arabic-first",
        img: "/work/var-owner.jpg",
        w: 619,
        h: 1280,
      },
    ],
  },
  {
    label: "Platforms",
    note: "Systems businesses run on",
    items: [
      {
        name: "RentRoyz",
        line: "A real-estate operation that leases, furnishes, and lists on Airbnb, run end to end.",
        meta: "Web platform · operations",
        img: "/work/rentroyz-hero.jpg",
        w: 1024,
        h: 479,
        wide: true,
      },
      {
        name: "Retaj Admin",
        line: "The same product from the admin chair: revenue, orders, technicians, all live.",
        meta: "Admin · revenue dashboard",
        img: "/work/retaj-admin-dashboard.png",
        w: 784,
        h: 1652,
      },
      {
        name: "DocoMedo",
        line: "A telehealth platform: UI, database schema, and user flow by one pair of hands.",
        meta: "Telehealth · production",
        big: "4,000+",
        sub: "online appointments carried in production",
      },
      {
        name: "TulipATS",
        line: "Recruitment tools wired into one hiring funnel, from first touch to hire.",
        meta: "Automation · recruiting",
        big: "One pipeline",
        sub: "from first touch to signed hire, no manual handoffs",
      },
    ],
  },
  {
    label: "Agents",
    note: "Software that operates software",
    items: [
      {
        name: "Pink3",
        line: "A CRM where AI does the clicking: message from Discord, Telegram, or WhatsApp and an agent drives the web UI.",
        meta: "AI agents · forked on Twenty CRM",
        img: "/work/pink3-hero.jpg",
        w: 1024,
        h: 535,
        wide: true,
      },
      {
        name: "YouTube pipeline",
        line: "Thirty-minute episodes with consistent characters: scripted, voiced, rendered, published.",
        meta: "Python · autonomous",
        big: "Zero hands",
        sub: "episodes go from idea to published without a person touching them",
      },
      {
        name: "Hundred quiet bots",
        line: "Agents on Gmail, Instagram, Telegram, and WhatsApp, moving business processes at night.",
        meta: "100+ agents",
        big: "100+",
        sub: "agents answering, alerting, and moving work while people sleep",
      },
    ],
  },
];

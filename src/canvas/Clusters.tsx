import { index as ledgerRows, contact } from "../data/projects";
import { LinkedinLogo, FileArrowDown, PersonSimpleWalk } from "@phosphor-icons/react";

/** A soft color zone behind a cluster. Pre-blurred gradient, no filters. */
function Glow({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute rounded-full"
      style={{
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
        opacity: 0.14,
      }}
    />
  );
}

/** Giant outlined project name sitting behind the work. */
function BigLabel({ x, y, size, rotate = 0, children }: { x: number; y: number; size: number; rotate?: number; children: string }) {
  return (
    <p
      aria-hidden
      className="text-stroke pointer-events-none absolute font-bold tracking-tighter"
      style={{ left: x, top: y, fontSize: size, lineHeight: 1, transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </p>
  );
}

function Shot({
  src,
  alt,
  x,
  y,
  w,
  rotate = 0,
  radius = "1.4rem",
}: {
  src: string;
  alt: string;
  x: number;
  y: number;
  w: number;
  rotate?: number;
  radius?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="pointer-events-none absolute select-none shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-bone/10"
      style={{ left: x, top: y, width: w, transform: `rotate(${rotate}deg)`, borderRadius: radius }}
    />
  );
}

function Caption({ x, y, w, title, children }: { x: number; y: number; w: number; title: string; children: string }) {
  return (
    <div className="absolute" style={{ left: x, top: y, width: w }}>
      <h2 className="text-2xl font-bold tracking-tight text-bone">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-bone-2">{children}</p>
    </div>
  );
}

export default function Clusters({ flyTo }: { flyTo: (cx: number, cy: number, fitW: number) => void }) {
  return (
    <div className="select-none">
      {/* ---- color zones ---- */}
      <Glow x={1050} y={800} r={850} color="#7b5cff" />
      <Glow x={2150} y={750} r={600} color="#2f6bff" />
      <Glow x={4400} y={950} r={1000} color="#2f7f86" />
      <Glow x={1500} y={2200} r={800} color="#f2662d" />
      <Glow x={3550} y={2500} r={800} color="#ff2d78" />
      <Glow x={5400} y={2450} r={800} color="#1f9d6f" />
      <Glow x={5100} y={3650} r={750} color="#f2662d" />

      {/* ---- THE STORE SHELF (top-left) ---- */}
      <BigLabel x={340} y={170} size={170}>ON THE STORES</BigLabel>
      <Shot src="/work/realcrowd-store.jpg" alt="RealCrowd on the App Store" x={390} y={400} w={430} rotate={-3} radius="1.8rem" />
      <Shot src="/work/tabibfinder-store.jpg" alt="TabibFinder on the App Store" x={880} y={350} w={430} rotate={2} radius="1.8rem" />
      <Shot src="/work/var-owner.jpg" alt="VAR laundry owner dashboard" x={1370} y={430} w={330} rotate={5} />
      <Caption x={395} y={1400} w={560} title="Live where it counts">
        RealCrowd finds the crowd across the UAE. TabibFinder books doctors across
        Saudi Arabia. VAR runs laundry operations in Arabic. All in production.
      </Caption>

      {/* Sparkline mini-cluster */}
      <Shot src="/work/sparkline-map.png" alt="Sparkline live campus map" x={1800} y={380} w={300} rotate={-2} />
      <Shot src="/work/sparkline-chat.png" alt="Sparkline group chat" x={2120} y={540} w={280} rotate={4} />
      <Caption x={1810} y={1120} w={420} title="Sparkline">
        Campus events with realtime sockets. Owned end to end, delivered as the
        production build.
      </Caption>

      {/* Zero-Trace mini-cluster */}
      <Shot src="/work/vpn-home.png" alt="Zero-Trace VPN home" x={2620} y={420} w={290} rotate={2} />
      <Shot src="/work/vpn-connected.png" alt="Zero-Trace VPN connected" x={2800} y={700} w={290} rotate={-3} />
      <Caption x={2630} y={1420} w={400} title="Zero-Trace VPN">
        Privacy infrastructure programmed, debugged, and deployed from scratch.
        Real traffic today.
      </Caption>

      {/* ---- RETAJ (top-right) ---- */}
      <BigLabel x={3320} y={210} size={210} rotate={-1}>RETAJ</BigLabel>
      <Shot src="/work/retaj-customer-home.png" alt="Retaj customer home" x={3380} y={500} w={300} rotate={-5} />
      <Shot src="/work/retaj-customer-services.png" alt="Retaj services list" x={3700} y={420} w={300} rotate={-2} />
      <Shot src="/work/retaj-customer-service-detail.png" alt="Retaj service detail" x={4020} y={380} w={300} rotate={1} />
      <Shot src="/work/retaj-customer-schedule.png" alt="Retaj scheduling" x={4340} y={420} w={300} rotate={3} />
      <Shot src="/work/retaj-customer-confirmation.png" alt="Retaj order confirmed" x={4660} y={500} w={300} rotate={-1} />
      <Shot src="/work/retaj-technician-jobs.png" alt="Retaj technician jobs" x={4980} y={440} w={300} rotate={4} />
      <Shot src="/work/retaj-supervisor-queue.png" alt="Retaj supervisor queue" x={5300} y={520} w={300} rotate={-3} />
      <Caption x={3390} y={1560} w={640} title="Retaj, screen by screen">
        Home services for the Saudi market. Customer, technician, supervisor, and
        admin roles. 24 screens, Arabic and English, light and dark. All designed
        and built by one person.
      </Caption>

      {/* ---- HERO (center-left) ---- */}
      <BigLabel x={2020} y={1850} size={300} rotate={0}>70+</BigLabel>
      <div className="absolute" style={{ left: 860, top: 1840, width: 1150 }}>
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-bone-2">
          Syed Shahzaib Haider Rizvi · AI engineer
        </p>
        <h1 className="mt-5 text-[104px] font-bold leading-[0.98] tracking-tighter text-bone">
          Products that reach production.
        </h1>
        <p className="mt-6 max-w-xl text-xl leading-relaxed text-bone-2">
          Five years, seventy launches: AI systems, mobile apps, platforms. This
          canvas is the actual work. Drag anywhere. Zoom in.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="rounded-full bg-ember px-7 py-3.5 text-lg font-semibold text-ink transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
          >
            Start a project
          </a>
          <button
            type="button"
            onClick={() => flyTo(4200, 1000, 2600)}
            className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-7 py-3.5 text-lg font-medium text-bone transition-colors hover:border-ember hover:text-ember"
          >
            <PersonSimpleWalk size={20} />
            Wander the shelf
          </button>
        </div>
      </div>

      {/* ---- PINK3 ---- */}
      <BigLabel x={2760} y={2030} size={190} rotate={1}>PINK3</BigLabel>
      <Shot src="/work/pink3-hero.jpg" alt="Pink3 CRM landing page" x={2800} y={2260} w={1060} rotate={-1} radius="0.9rem" />
      <Caption x={2810} y={2860} w={620} title="Pink3, the CRM that clicks itself">
        Forked from Twenty. Users message from Discord, Telegram, or WhatsApp and
        an AI agent drives the web UI to finish the task for them.
      </Caption>

      {/* ---- TAJSEER ---- */}
      <BigLabel x={4620} y={1960} size={180} rotate={-1}>TAJSEER</BigLabel>
      <Shot src="/work/tajseer-web-hero.jpg" alt="Tajseer web platform" x={4650} y={2180} w={980} rotate={1} radius="0.9rem" />
      <Shot src="/work/tajseer-welcome.png" alt="Tajseer mobile welcome" x={5540} y={2480} w={250} rotate={5} />
      <Caption x={4660} y={2960} w={620} title="Tajseer, live on both stores">
        Loan management and disbursement across web, iOS, and Android. Pixel-accurate
        admin panel from Figma, store deployment included.
      </Caption>

      {/* ---- LEDGER (bottom-left) ---- */}
      <div className="absolute" style={{ left: 660, top: 3010, width: 820 }}>
        <h2 className="text-4xl font-bold tracking-tight text-bone">The rest of the shelf</h2>
        <div className="mt-6">
          {ledgerRows.map((p) => (
            <div key={p.name} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
              <div>
                <span className="font-semibold text-bone">{p.name}</span>
                <span className="ml-3 text-sm text-bone-2">{p.note}</span>
              </div>
              <span className="shrink-0 font-mono text-xs text-bone-3">{p.kind}</span>
            </div>
          ))}
        </div>
      </div>
      <Shot src="/work/rentroyz-hero.jpg" alt="RentRoyz property operations site" x={1580} y={3120} w={620} rotate={-2} radius="0.9rem" />
      <Caption x={1590} y={3480} w={520} title="RentRoyz">
        Operational systems for a lease, furnish, and list Airbnb business.
      </Caption>

      {/* ---- APPROACH (bottom-center) ---- */}
      <div className="absolute" style={{ left: 2600, top: 3260, width: 1300 }}>
        <h2 className="text-4xl font-bold tracking-tight text-bone">How one person ships seventy products</h2>
        <div className="mt-8 space-y-6">
          <p className="text-xl leading-relaxed text-bone-2">
            <span className="font-semibold text-bone">End to end, one pair of hands.</span>{" "}
            Design, code, backend, deployment, store paperwork.
          </p>
          <p className="text-xl leading-relaxed text-bone-2">
            <span className="font-semibold text-bone">First version in days.</span>{" "}
            Speed is a habit from shipping seventy times, not a promise.
          </p>
          <p className="text-xl leading-relaxed text-bone-2">
            <span className="font-semibold text-bone">AI where it earns its place.</span>{" "}
            Agents that operate UIs, pipelines that publish on their own.
          </p>
        </div>
      </div>

      {/* ---- CONTACT (bottom-right) ---- */}
      <div className="absolute" style={{ left: 4420, top: 3330, width: 1400 }}>
        <h2 className="text-[76px] font-bold leading-[1.0] tracking-tighter text-bone">
          Have something that needs to exist?
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="rounded-full bg-ember px-7 py-3.5 text-lg font-semibold text-ink transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
          >
            Start a project
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-6 py-3.5 text-lg text-bone transition-colors hover:border-ember hover:text-ember"
          >
            <LinkedinLogo size={20} />
            LinkedIn
          </a>
          <a
            href={contact.resume}
            download
            className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-6 py-3.5 text-lg text-bone transition-colors hover:border-ember hover:text-ember"
          >
            <FileArrowDown size={20} />
            Resume
          </a>
        </div>
        <p className="mt-8 font-mono text-sm text-bone-3">{contact.email}</p>
      </div>
    </div>
  );
}

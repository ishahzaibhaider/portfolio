/** World coordinates are hand-placed. The canvas is 6400 x 4200. */
export const WORLD_W = 6400;
export const WORLD_H = 4200;

export interface WalkStop {
  key: string;
  /** world point the camera centers on */
  cx: number;
  cy: number;
  /** how wide a slice of world should fit in the viewport at this stop */
  fitW: number;
  title: string;
  line: string;
}

export const walkStops: WalkStop[] = [
  {
    key: "hero",
    cx: 1450,
    cy: 2150,
    fitW: 1750,
    title: "The workbench",
    line: "Everything on this canvas is real and shipped. Drag around, or keep walking.",
  },
  {
    key: "retaj",
    cx: 4200,
    cy: 1000,
    fitW: 2600,
    title: "Retaj",
    line: "Home services for Saudi Arabia. 24 screens, four roles, two languages.",
  },
  {
    key: "pink3",
    cx: 3500,
    cy: 2500,
    fitW: 1900,
    title: "Pink3",
    line: "An AI-powered CRM where agents click through the UI on the user's behalf.",
  },
  {
    key: "tajseer",
    cx: 5350,
    cy: 2500,
    fitW: 1900,
    title: "Tajseer",
    line: "Loans managed and disbursed across web, iOS, and Android. Live on both stores.",
  },
  {
    key: "stores",
    cx: 1250,
    cy: 800,
    fitW: 2450,
    title: "The store shelf",
    line: "RealCrowd, TabibFinder, VAR, Sparkline, Zero-Trace. Real users, real traffic.",
  },
  {
    key: "ledger",
    cx: 1350,
    cy: 3450,
    fitW: 2100,
    title: "The rest of the shelf",
    line: "Ten more that made it out the door, from telehealth to web3.",
  },
  {
    key: "contact",
    cx: 5120,
    cy: 3600,
    fitW: 1750,
    title: "The door",
    line: "If you want one of these with your name on it, this is where you knock.",
  },
];

export const stop = (key: string) => walkStops.find((s) => s.key === key)!;

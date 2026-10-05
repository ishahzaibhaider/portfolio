import Lenis from "lenis";

/**
 * Weighted, viscous page scroll (his motion brief: lerp-chased scroll, expo settle). Everything that reads
 * scroll position (the sky, the chapters) keeps working, because Lenis still moves the real window scroll.
 * Reduced-motion visitors keep native scrolling.
 */
let lenis: Lenis | null = null;
export function startSmoothScroll() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.1 });
  const raf = (t: number) => {
    lenis!.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}
/** smooth jump to an element (chapter index, wall clicks) */
export function goTo(target: string | HTMLElement) {
  const el = typeof target === "string" ? document.getElementById(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
  else el.scrollIntoView({ behavior: "smooth" });
}

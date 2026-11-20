import { useEffect, useState } from "react";
import { bySlug } from "../../data/reels";

/**
 * Which product is open full-screen. It lives in the address (#/work/<slug>) so a product can be linked
 * to directly and the browser's back button closes it.
 */
const read = () => {
  const m = typeof location !== "undefined" ? location.hash.match(/^#\/work\/([a-z0-9-]+)$/) : null;
  return m && bySlug(m[1]) ? m[1] : null;
};
const EVT = "work:change";
const tell = () => window.dispatchEvent(new Event(EVT));

export function openWork(slug: string) {
  if (!bySlug(slug)) return;
  if (read()) history.replaceState({ work: true }, "", `#/work/${slug}`);
  else history.pushState({ work: true }, "", `#/work/${slug}`);
  tell();
}

export function closeWork() {
  if (!read()) return;
  if (history.state?.work) history.back();
  else {
    history.replaceState(null, "", location.pathname + location.search);
    tell();
  }
}

export function useOpenWork() {
  const [slug, setSlug] = useState<string | null>(read);
  useEffect(() => {
    const on = () => setSlug(read());
    window.addEventListener(EVT, on);
    window.addEventListener("popstate", on);
    window.addEventListener("hashchange", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("popstate", on);
      window.removeEventListener("hashchange", on);
    };
  }, []);
  return slug;
}

export function useSmall() {
  const [small, setSmall] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setSmall(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return small;
}

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

"use client";
import { useEffect, useState } from "react";

// Minimal loader shown while the ring particles assemble. The particles behind
// it are the real loading animation; this only adds the mark and a fill line.
export default function IntroLoader({ revealed }: { revealed: boolean }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const id = window.setTimeout(() => setGone(true), 900);
    return () => window.clearTimeout(id);
  }, [revealed]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[55] flex flex-col items-center justify-center gap-7 transition-opacity duration-700 ${
        revealed ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="block h-4 w-4 rotate-45 bg-ember shadow-[0_0_24px_rgba(255,90,31,0.6)]" />
      <div className="h-px w-40 overflow-hidden bg-line">
        <div className="intro-fill h-full w-full origin-left bg-ember" />
      </div>
    </div>
  );
}

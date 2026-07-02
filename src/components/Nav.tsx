"use client";
import { motion, useReducedMotion } from "motion/react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Agents", href: "#agents" },
  { label: "Stack", href: "#stack" },
];

export default function Nav() {
  const reduce = useReducedMotion();
  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="font-mono text-sm font-semibold tracking-tight text-bone">
          shahzaib<span className="text-ember">.</span>rizvi
        </a>
        <div className="flex items-center gap-6 md:gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden text-sm text-bone-2 transition-colors hover:text-bone sm:block"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-bone px-4 py-1.5 text-sm font-medium text-ink transition-transform hover:bg-ember hover:text-ink active:scale-[0.97]"
          >
            Get in touch
          </a>
        </div>
      </nav>
    </motion.header>
  );
}

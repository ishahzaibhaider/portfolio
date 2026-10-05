export default function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 md:px-7">
        <a href="#top" className="pointer-events-auto rounded-full bg-[rgba(6,14,24,0.6)] px-4 py-1.5 text-sm font-semibold tracking-tight text-arctic ring-1 ring-white/10 backdrop-blur-xl transition-colors hover:text-white">
          Shahzaib Rizvi
        </a>
        <a
          href="mailto:shahzaibhaider161@gmail.com"
          className="pointer-events-auto rounded-full bg-[rgba(6,14,24,0.6)] px-4 py-1.5 text-sm text-arctic ring-1 ring-white/10 backdrop-blur-xl transition-colors hover:text-white"
        >
          Start a project
        </a>
      </nav>
    </header>
  );
}

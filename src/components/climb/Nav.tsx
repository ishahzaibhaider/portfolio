export default function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto flex h-16 max-w-[1140px] items-center justify-between px-7">
        <a href="#top" className="pointer-events-auto text-sm font-semibold tracking-tight text-arctic/90 transition-colors hover:text-white">
          Shahzaib Rizvi
        </a>
        <a
          href="#contact"
          className="pointer-events-auto rounded-full border border-arctic/20 bg-deep/40 px-4 py-1.5 text-sm text-arctic/90 backdrop-blur-sm transition-colors hover:border-arctic/50 hover:text-white"
        >
          Start a project
        </a>
      </nav>
    </header>
  );
}

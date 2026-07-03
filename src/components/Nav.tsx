export default function Nav({ cta }: { cta: { label: string; href: string } }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="text-sm font-semibold tracking-tight text-bone">
          Shahzaib Rizvi
        </a>
        <div className="flex items-center gap-6">
          <a href="#work" className="hidden text-sm text-bone-2 transition-colors hover:text-bone sm:block">
            Work
          </a>
          <a href="#approach" className="hidden text-sm text-bone-2 transition-colors hover:text-bone sm:block">
            Approach
          </a>
          <a
            href={cta.href}
            className="rounded-full border border-bone/25 px-4 py-1.5 text-sm font-medium text-bone transition-colors hover:border-ember hover:text-ember"
          >
            {cta.label}
          </a>
        </div>
      </nav>
    </header>
  );
}

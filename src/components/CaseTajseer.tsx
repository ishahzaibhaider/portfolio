import Reveal from "./Reveal";

export default function CaseTajseer() {
  return (
    <section data-tour="tajseer" className="scroll-mt-16 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-12">
        <Reveal className="relative lg:col-span-7 lg:order-first">
          <img
            src="/work/tajseer-web-hero.jpg"
            alt="Tajseer web platform hero, clear your debt build your future"
            loading="lazy"
            className="w-full rounded-xl ring-1 ring-bone/10"
          />
          <img
            src="/work/tajseer-welcome.png"
            alt="Tajseer mobile welcome screen"
            loading="lazy"
            className="absolute -bottom-8 -right-4 hidden w-[150px] rotate-[4deg] rounded-[1.2rem] shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-bone/10 md:block lg:-right-6 lg:w-[175px]"
          />
        </Reveal>
        <Reveal delay={0.12} className="lg:col-span-5">
          <h2 className="text-3xl font-bold tracking-tighter text-bone md:text-5xl">Tajseer</h2>
          <p className="mt-3 text-lg text-ember">Fintech, live on both stores</p>
          <p className="mt-6 max-w-md leading-relaxed text-bone-2">
            A loan management and disbursement product spanning web, iOS, and
            Android. Core features, a pixel-accurate admin panel implemented
            from Figma, and store deployment, all shipped.
          </p>
          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-bone-2">
            <li>React Native apps on the App Store and Play Store</li>
            <li>Admin panel matched to design, pixel for pixel</li>
            <li>Lender and borrower flows in one platform</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

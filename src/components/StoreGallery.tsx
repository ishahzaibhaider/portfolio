import Reveal from "./Reveal";
import { storeGallery } from "../data/projects";

export default function StoreGallery() {
  return (
    <section data-tour="stores" className="scroll-mt-16 bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tighter text-bone md:text-5xl">
            Shipped, reviewed, and live for real users.
          </h2>
        </Reveal>
        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {storeGallery.map((item, i) => (
            <Reveal key={item.src} delay={0.05 * (i % 3)} className="mb-6 break-inside-avoid">
              <figure>
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full rounded-xl ring-1 ring-bone/10"
                />
                <figcaption className="mt-3 text-sm leading-snug text-bone-2">{item.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

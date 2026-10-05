"use client";
/**
 * The last thing in Act 03 is the thing on the desk right now: an honest "in progress" card with the game's
 * real icon and two real screens from its current iOS build. No film yet; it gets one when it ships.
 */
export default function NowBuilding() {
  return (
    <section id="now-building" className="relative overflow-hidden bg-[radial-gradient(80%_70%_at_70%_50%,#2a1a6e_0%,#0b0a1f_70%)] px-[var(--g)] py-[clamp(80px,14vh,150px)]">
      <div className="relative z-10 grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="m-0 mb-5 flex items-center gap-3 text-[12.5px] uppercase tracking-[0.24em] text-[#c9b8ff]">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a3e635] opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#a3e635]" /></span>
            Now building
          </p>
          <div className="flex items-center gap-4">
            <img src="/work/puzzle/icon.webp" alt="" className="h-16 w-16 rounded-[18px] shadow-[0_20px_40px_-14px_rgba(0,0,0,0.6)]" />
            <h2 className="m-0 font-bold leading-[1.02] text-[#f4f2ff] text-[clamp(32px,4.6vw,60px)]">A puzzle game, in Unity.</h2>
          </div>
          <p className="m-0 mt-5 max-w-[46ch] text-[16px] leading-relaxed text-[#cfc8ef] md:text-[18px]">
            Arabic-first, for iOS. Every solved puzzle earns tickets toward a monthly draw. It's on the desk right now, so it gets a film when it ships.
          </p>
        </div>
        <div className="flex justify-center gap-4 md:justify-end">
          {["tour_onb2", "tour_onb3"].map((n, i) => (
            <img key={n} src={`/work/puzzle/${n}.webp`} alt="" loading="lazy"
              className={`w-[42vw] max-w-[230px] rounded-[26px] ring-[6px] ring-[#0b0d10] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.8)] ${i ? "translate-y-8" : ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

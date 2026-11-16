export default function HeroIntro() {
  return (
    <div className="relative m-0 grid min-h-[clamp(260px,35svh,420px)] place-items-center px-3 pt-7 pb-16 text-center max-[700px]:min-h-[clamp(240px,34svh,310px)] max-[700px]:px-0 max-[700px]:pt-5">
      <p className="absolute top-[52%] left-[clamp(4px,4vw,80px)] m-0 -translate-y-full -rotate-5 font-handwritten text-[clamp(.76rem,1.1vw,1.15rem)] leading-[1.2] whitespace-nowrap text-ink-muted max-[700px]:top-auto max-[700px]:bottom-2.5 max-[700px]:left-0.5 max-[700px]:translate-y-0 max-[700px]:rotate-0 max-[700px]:text-[.7rem]">
        MİMARİ BİR FİKİR <span aria-hidden="true" className="inline-block text-[1.35em]">↗</span>
      </p>
      <div className="w-full max-w-[1100px]">
        <h1 className="m-0 text-brand text-[clamp(3rem,6.5vw,7rem)] leading-[.95] font-semibold tracking-[-.06em] max-[700px]:text-[clamp(2.25rem,9vw,4rem)]">Bugünün fikri,
yarının yaşam alanı.</h1>
        <p className="mx-auto mt-4 mb-0 max-w-[42ch] font-sans text-sm leading-relaxed text-ink-muted sm:text-base">Bir fikrin çizimden mekâna, mekândan yaşama uzanan yolculuğunu keşfedin. Aşağı kaydırın, hikâye başlasın.</p>
      </div>
      <button
        type="button"
        onClick={() => window.scrollBy({ top: window.innerHeight * .65, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
        aria-label="Aşağı kaydır ve Atelier yolculuğunu keşfet"
        className="group absolute bottom-0 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-solid border-paper/60 bg-brand p-0 text-paper transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none sm:h-14 sm:w-14"
      >
        <svg aria-hidden="true" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-4 shrink-0 motion-safe:animate-bounce motion-safe:[animation-duration:2s]">
          <path d="M12 3v28m-7-8 7 8 7-8" />
        </svg>
      </button>
      <p className="absolute top-[52%] right-[clamp(4px,4vw,80px)] m-0 translate-y-[85%] rotate-5 font-handwritten text-[clamp(.76rem,1.1vw,1.15rem)] leading-[1.2] whitespace-nowrap text-ink-muted max-[700px]:top-auto max-[700px]:right-0.5 max-[700px]:bottom-2.5 max-[700px]:translate-y-0 max-[700px]:rotate-0 max-[700px]:text-[.7rem]">
        <span aria-hidden="true" className="inline-block text-[1.35em]">↖</span> ESKİZDEN YAŞAMA
      </p>
    </div>
  )
}

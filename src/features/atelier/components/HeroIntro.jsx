export default function HeroIntro() {
  return (
    <div className="relative m-0 grid min-h-[clamp(220px,31svh,380px)] place-items-center px-3 pt-7 pb-[18px] text-center max-[700px]:min-h-[clamp(200px,30svh,270px)] max-[700px]:px-0 max-[700px]:pt-5 max-[700px]:pb-3">
      <p className="absolute top-[52%] left-[clamp(4px,4vw,80px)] m-0 -translate-y-full -rotate-5 font-handwritten text-[clamp(.76rem,1.1vw,1.15rem)] leading-[1.2] whitespace-nowrap text-ink-muted max-[700px]:top-auto max-[700px]:bottom-2.5 max-[700px]:left-0.5 max-[700px]:translate-y-0 max-[700px]:rotate-0 max-[700px]:text-[.7rem]">
        MİMARİ BİR FİKİR <span aria-hidden="true" className="inline-block text-[1.35em]">↗</span>
      </p>
      <div className="w-full max-w-[1100px]">
        <h1 className="m-0 text-brand text-[clamp(3rem,6.5vw,7rem)] leading-[.95] font-semibold tracking-[-.06em] max-[700px]:text-[clamp(2.25rem,9vw,4rem)]">Bugünün fikri,
yarının yaşam alanı.</h1>
        <p className="mx-auto mt-4 mb-0 max-w-[42ch] font-sans text-sm leading-relaxed text-ink-muted sm:text-base">Bir fikrin çizimden yaşama uzanan yolculuğunu keşfedin.</p>
      </div>
      <p className="absolute top-[52%] right-[clamp(4px,4vw,80px)] m-0 translate-y-[85%] rotate-5 font-handwritten text-[clamp(.76rem,1.1vw,1.15rem)] leading-[1.2] whitespace-nowrap text-ink-muted max-[700px]:top-auto max-[700px]:right-0.5 max-[700px]:bottom-2.5 max-[700px]:translate-y-0 max-[700px]:rotate-0 max-[700px]:text-[.7rem]">
        <span aria-hidden="true" className="inline-block text-[1.35em]">↖</span> ESKİZDEN YAŞAMA
      </p>
    </div>
  )
}

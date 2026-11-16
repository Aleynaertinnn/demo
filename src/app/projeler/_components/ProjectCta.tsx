import CtaButton from '@/components/ui/CtaButton';

export default function ProjectCta() {
  return (
    <section aria-labelledby="project-cta-heading" className="relative my-12 grid items-center gap-8 overflow-hidden border border-solid border-ink bg-ink px-6 py-12 text-paper sm:px-10 md:my-20 md:grid-cols-[1fr_auto] md:gap-12 md:py-16 lg:px-14">
      <span aria-hidden="true" className="absolute top-4 right-4 h-3 w-3 border-0 border-t border-r border-solid border-paper/40" />
      <span aria-hidden="true" className="absolute bottom-4 left-4 h-3 w-3 border-0 border-b border-l border-solid border-paper/40" />
      <div>
        <p className="mt-0 mb-5 text-[10px] font-semibold text-paper/65">SIRADAKİ HİKÂYE SİZİN OLSUN</p>
        <h2 id="project-cta-heading" className="mt-0 mb-5 max-w-[23ch] font-display text-[clamp(28px,3.5vw,48px)] leading-[1.12] font-semibold tracking-[-.045em] text-balance uppercase">Aklınızdaki mekânı birlikte şekillendirelim.</h2>
        <p className="m-0 max-w-[51ch] text-sm leading-[1.9] text-paper/75">İlk fikrinizden başlayalım. İhtiyaçlarınızı dinleyip projenize nasıl eşlik edebileceğimizi konuşalım.</p>
      </div>
      <div className="flex flex-col items-start gap-5 md:items-center">
        <p className="m-0 -rotate-3 font-handwritten text-base text-paper/80">Her şey bir konuşmayla başlar. ↘</p>
        <CtaButton href="/iletisim" label="Projenizi konuşalım" className="border border-solid border-paper/35" />
      </div>
    </section>
  );
}

import type { Project } from '@/constants/projects';

export default function ProjectInfo({ project }: { project: Project }) {
  return (
    <>
      <section aria-labelledby="project-idea-heading" className="mx-auto grid max-w-5xl gap-8 py-14 md:grid-cols-[.9fr_1.1fr] md:gap-16 md:py-24">
        <div><p className="mt-0 mb-5 text-[10px] font-bold tracking-[.06em] text-brand">TASARIM FİKRİ</p><h2 id="project-idea-heading" className="m-0 max-w-[20ch] font-display text-[clamp(28px,3.5vw,48px)] leading-[1.12] font-semibold tracking-[-.045em] text-brand uppercase">{project.title}</h2></div>
        <div className="self-center"><p className="m-0 max-w-[48ch] text-base leading-[1.9] text-ink-muted sm:text-lg">{project.designIdea ?? project.description}</p><p className="mt-6 mb-0 -rotate-2 font-handwritten text-sm text-ink-muted">{project.designNote ?? 'Çizgiden mekâna, aynı fikir.'}</p></div>
      </section>
      {project.designTopics?.length ? <section aria-labelledby="design-decisions-heading" className="mx-auto mb-14 max-w-5xl md:mb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-0 border-b border-solid border-line/40 pb-6">
          <div><p className="mt-0 mb-4 text-[10px] font-bold tracking-[.06em] text-brand">PROJEYİ ŞEKİLLENDİREN KARARLAR</p><h2 id="design-decisions-heading" className="m-0 font-display text-[clamp(26px,3vw,40px)] leading-tight font-medium tracking-[-.045em]">Bütünü kuran detaylar.</h2></div>
          <span aria-hidden="true" className="font-handwritten text-sm text-ink-muted">Her çizginin bir nedeni var. ↙</span>
        </div>
        <div className="grid gap-8 md:grid-cols-3 md:gap-0">{project.designTopics.map((topic, index) => <article key={topic.title} className="min-w-0 md:px-6 md:first:pl-0 md:last:pr-0 md:[&+article]:border-0 md:[&+article]:border-l md:[&+article]:border-solid md:[&+article]:border-line/30">
          <span className="text-[11px] text-ink-muted tabular-nums">0{index + 1} /</span>
          <h3 className="mt-5 mb-4 font-display text-2xl leading-tight font-semibold tracking-[-.035em]">{topic.title}</h3>
          <p className="m-0 text-sm leading-[1.9] text-ink-muted">{topic.text}</p>
        </article>)}</div>
      </section> : null}
    </>
  );
}

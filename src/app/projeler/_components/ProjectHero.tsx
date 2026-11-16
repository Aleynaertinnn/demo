import Image from 'next/image';
import PageBanner from '@/components/ui/PageBanner';
import type { Project } from '@/constants/projects';

export default function ProjectHero({ project }: { project: Project }) {
  const facts = [
    { label: 'Konum', value: project.location },
    { label: 'Yıl', value: project.year },
    { label: 'Proje türü', value: project.projectType },
    { label: 'Alan', value: project.area },
    { label: 'Durum', value: project.status },
  ].filter(fact => fact.value);
  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: 'Anasayfa', href: '/' }, { label: 'Projeler', href: '/projeler' }]}
        currentPage={project.category}
        eyebrow="Bir fikir, bir mekân."
        title={project.category}
        description={project.title}
        className="mb-5 sm:mb-8"
      />
      <section aria-label="Proje sunumu" className="mx-auto grid max-w-[1440px] items-center gap-8 border-0 border-b border-solid border-line/30 py-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,576px)_minmax(0,1fr)] lg:gap-8 lg:px-5 xl:gap-12 xl:px-8">
      <aside className="order-2 px-5 lg:order-1 lg:px-0">
        <p className="mt-0 mb-5 text-[11px] font-bold tracking-[.08em] text-brand">01 / YAKLAŞIM</p>
        <p className="m-0 max-w-[28ch] text-sm leading-[1.9] font-medium text-ink">{project.description}</p>
        <p className="mt-6 mb-0 max-w-[24ch] -rotate-3 font-handwritten text-base leading-relaxed text-brand">{project.designNote ?? 'Her şey bir çizgiyle başlar.'}</p>
        <svg aria-hidden="true" viewBox="0 0 110 44" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mt-5 hidden h-10 w-24 text-brand lg:block"><path d="M4 29C23 8 44 5 55 15c12 12-8 22-14 12-7-12 24-18 59-9m-9-8 10 8-12 5" /></svg>
      </aside>
      <figure className="relative order-1 mx-auto my-0 w-full max-w-xl lg:order-2 border border-solid border-line/40 bg-surface/40 p-4 sm:p-6">
        <span aria-hidden="true" className="absolute inset-3 border border-solid border-line/20 sm:inset-4" />
        <div className="relative aspect-square">
          <Image src={project.color ?? project.sketch} alt={project.alt} fill priority sizes="(max-width: 576px) 100vw, 576px" className="object-contain mix-blend-multiply" />
        </div>
        <figcaption className="relative mt-5 flex justify-between gap-4 border-0 border-t border-solid border-line/30 pt-4 text-[10px] text-ink-muted"><span>{project.category}</span><span>{project.color ? 'MİMARİ GÖRSELLEŞTİRME' : 'MİMARİ ÇİZİM'} / 01</span></figcaption>
      </figure>
      {facts.length > 0 && <aside aria-label="Proje künyesi" className="order-3 px-5 lg:px-0">
        <p className="mt-0 mb-5 text-[11px] font-bold tracking-[.08em] text-brand">PROJE KÜNYESİ</p>
        <dl className="m-0 grid grid-cols-2 gap-x-6 lg:block">{facts.map(fact => <div key={fact.label} className="border-0 border-t border-solid border-line/30 py-3.5"><dt className="mb-1.5 text-[10px] font-semibold uppercase text-ink-muted">{fact.label}</dt><dd className="m-0 text-sm leading-relaxed font-semibold text-ink">{fact.value}</dd></div>)}</dl>
        {project.isSample && <p className="mt-3 mb-0 text-[10px] text-ink-muted">Örnek proje künyesi</p>}
      </aside>}
      </section>
    </>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/constants/projects';

type Props = { previous: Project; next: Project };

export default function ProjectNavigation({ previous, next }: Props) {
  return (
    <nav aria-label="Projeler arasında gezin" className="grid border-0 border-y border-solid border-line/40 md:grid-cols-2">
      {([{ project: previous, direction: 'previous', label: 'ÖNCEKİ PROJE' }, { project: next, direction: 'next', label: 'SONRAKİ PROJE' }] as const).map(({ project, direction, label }) => (
        <Link key={direction} href={`/projeler/${project.slug}`} className={`group flex min-w-0 items-center gap-5 px-5 py-8 text-ink no-underline transition-colors hover:bg-ink/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink motion-reduce:transition-none sm:gap-7 sm:px-8 md:py-10 lg:px-10 ${direction === 'next' ? 'border-0 border-t border-solid border-line/40 md:border-t-0 md:border-l' : ''}`}>
          {direction === 'previous' && <span aria-hidden="true" className="shrink-0 text-4xl transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none sm:text-5xl">←</span>}
          <div className="min-w-0 flex-1">
            <p className="mt-0 mb-4 text-[10px] text-ink-muted">{label}</p>
            <h2 className="m-0 font-display text-[clamp(24px,2.7vw,40px)] leading-tight font-medium tracking-[-.045em]">{project.category}</h2>
            <p className="mt-3 mb-0 text-xs leading-relaxed text-ink-muted sm:text-sm">{project.title}</p>
          </div>
          <div className="relative hidden h-24 w-24 shrink-0 lg:block"><Image src={project.sketch} alt="" fill sizes="96px" className="object-contain mix-blend-multiply" /></div>
          {direction === 'next' && <span aria-hidden="true" className="shrink-0 text-4xl transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none sm:text-5xl">→</span>}
        </Link>
      ))}
    </nav>
  );
}

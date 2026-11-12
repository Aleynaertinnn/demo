import Link from 'next/link';
import type { Project } from '@/constants/projects';

export default function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="mb-12 max-w-4xl">
      <Link href="/projeler" className="text-sm text-ink-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-brand">← Tüm projeler</Link>
      <p className="mt-10 mb-4 text-xs tracking-[.12em] uppercase">{project.category}</p>
      <h1 className="m-0 text-[clamp(36px,6vw,80px)] leading-[1.08] font-medium tracking-[-.055em]">{project.title}</h1>
    </header>
  );
}

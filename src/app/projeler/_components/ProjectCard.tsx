'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/constants/projects';

const imageClass =
  'object-contain object-bottom mix-blend-multiply transition-opacity duration-[650ms] ease-in-out motion-reduce:transition-none';

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [colored, setColored] = useState(false);

  return (
    <article className="group/project relative flex min-w-0 flex-col bg-paper text-ink border-0 border-solid border-line/40 [&+&]:border-l max-[1000px]:[&:nth-child(3)]:border-l-0 max-[1000px]:[&:nth-child(n+3)]:border-t max-[600px]:[&+&]:border-t max-[600px]:[&+&]:border-l-0">
      <span aria-hidden="true" className="pointer-events-none absolute inset-2 z-10 border border-solid border-line/20 transition-colors duration-500 group-hover/project:border-line/45 motion-reduce:transition-none" />
      {['top-3 left-3 border-t border-l', 'top-3 right-3 border-t border-r', 'bottom-3 left-3 border-b border-l', 'bottom-3 right-3 border-b border-r'].map(corner => (
        <span key={corner} aria-hidden="true" className={`pointer-events-none absolute z-20 h-2.5 w-2.5 border-0 border-solid border-ink opacity-30 transition-opacity duration-300 group-hover/project:opacity-100 group-focus-within/project:opacity-100 motion-reduce:transition-none ${corner}`} />
      ))}
      <button
        type="button"
        aria-label={`${project.category}: renkli görünümü ${colored ? 'kapat' : 'aç'}`}
        aria-pressed={colored}
        onClick={() => setColored((value) => !value)}
        className="group block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-inherit focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand"
      >
        <span className="mx-6 flex min-h-[72px] items-center gap-2 border-0 border-b border-solid border-line/30 py-5 text-[10px] leading-relaxed font-medium tracking-[.08em] uppercase">
          <span className="shrink-0 text-ink-muted tabular-nums">{String(index + 1).padStart(2, '0')} /</span>
          <span lang="tr">{project.category.toLocaleUpperCase('tr-TR')}</span>
        </span>
        <span className="relative isolate mx-3 block aspect-square overflow-hidden">
          <Image
            src={project.color}
            alt=""
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
            className={`${imageClass} opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-pressed:opacity-100`}
          />
          <Image
            src={project.sketch}
            alt={project.alt}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
            className={`${imageClass} opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0 group-aria-pressed:opacity-0`}
          />
        </span>
      </button>
      <div className="mx-6 flex flex-1 flex-col border-0 border-t border-solid border-line/30 pt-6 pb-5">
        <h3 className="m-0 min-h-[2.3em] max-w-[17ch] text-[clamp(20px,1.6vw,26px)] leading-[1.15] font-medium tracking-[-.045em] text-brand uppercase">
          <Link
            href={`/projeler/${project.slug}`}
            className="text-inherit no-underline hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 mb-6 max-w-[34ch] text-[13px] leading-[1.65] text-ink-muted">
          {project.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 border-0 border-t border-solid border-line/25 pt-3">
          <span aria-hidden="true" className="text-[9px] tracking-[.1em] text-ink-muted tabular-nums">P / {String(index + 1).padStart(2, '0')}</span>
          <Link href={`/projeler/${project.slug}`} aria-label={`${project.title} Proje detayını incele`} className="relative z-20 border border-solid border-line/50 px-2.5 py-2 text-[8px] leading-none tracking-[.12em] text-ink no-underline transition-colors hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none">
            ULUK / PROJELER <span aria-hidden="true" className="ml-1">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

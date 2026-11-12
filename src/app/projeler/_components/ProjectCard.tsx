'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/constants/projects';

const imageClass = 'object-contain mix-blend-multiply transition-opacity duration-[650ms] ease-in-out motion-reduce:transition-none';

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [colored, setColored] = useState(false);

  return (
    <article className="min-w-0 border-0 border-solid border-line/40 [&+&]:border-l max-[1000px]:[&:nth-child(3)]:border-l-0 max-[1000px]:[&:nth-child(n+3)]:border-t max-[600px]:[&+&]:border-t max-[600px]:[&+&]:border-l-0">
      <button type="button" aria-label={`${project.category}: renkli görünümü ${colored ? 'kapat' : 'aç'}`} aria-pressed={colored} onClick={() => setColored(value => !value)}
        className="group block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-inherit focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand">
        <span className="flex justify-between gap-3 border-0 border-b border-dashed border-line/35 px-[clamp(16px,1.8vw,28px)] py-[22px] text-[11px] font-medium tracking-[.07em] uppercase">
          <span>{project.category}</span><span className="text-ink-muted tabular-nums">[{String(index + 1).padStart(2, '0')}]</span>
        </span>
        <span className="relative isolate block aspect-[1/1.08] overflow-hidden max-[600px]:aspect-square">
          <Image src={project.color} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw" className={`${imageClass} opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-pressed:opacity-100`} />
          <Image src={project.sketch} alt={project.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw" className={`${imageClass} opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0 group-aria-pressed:opacity-0`} />
          <span aria-hidden="true" className="absolute right-4 bottom-3.5 left-4 flex justify-between font-handwritten text-xs text-ink-muted">Eskizden yaşama <span>↗</span></span>
        </span>
      </button>
      <div className="border-0 border-t border-dashed border-line/35 px-[clamp(16px,1.8vw,28px)] pt-[26px] pb-[30px]">
        <h3 className="m-0 min-h-[3.2em] max-w-[13ch] text-[clamp(23px,2.2vw,35px)] leading-[1.06] font-medium tracking-[-.055em] max-[1000px]:min-h-[2.2em] max-[1000px]:text-[30px] max-[600px]:min-h-0 max-[600px]:max-w-[17ch]">
          <Link href={`/projeler/${project.slug}`} className="text-inherit no-underline hover:text-brand focus-visible:outline-2 focus-visible:outline-brand">{project.title}</Link>
        </h3>
        <p className="mt-6 mb-0 max-w-[32ch] text-sm leading-[1.6] text-ink-muted max-[600px]:mt-4">{project.description}</p>
        <Link href={`/projeler/${project.slug}`} className="mt-5 inline-block text-xs text-brand underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-brand">Projeyi incele ↗</Link>
      </div>
    </article>
  );
}

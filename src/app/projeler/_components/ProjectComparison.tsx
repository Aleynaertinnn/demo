'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Project } from '@/constants/projects';

export default function ProjectComparison({ project }: { project: Project }) {
  const [position, setPosition] = useState(50);
  if (!project.color) return null;
  return (
    <section aria-labelledby="comparison-heading" className="mx-auto mb-14 w-full max-w-5xl md:mb-24">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5 px-5 sm:px-8 lg:px-12"><div><p className="mt-0 mb-4 text-[10px] text-ink-muted">FİKRİN İKİ HALİ</p><h2 id="comparison-heading" className="m-0 font-display text-[clamp(28px,3vw,44px)] leading-tight font-medium tracking-[-.045em]">Çizimden mekâna.</h2></div><p id="comparison-help" className="m-0 max-w-[34ch] text-xs leading-relaxed text-ink-muted">Çizgiyi sürükleyerek veya ok tuşlarıyla iki görünüm arasında ilerleyin.</p></div>
      <div className="relative aspect-square overflow-hidden border border-solid border-line/40 bg-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-brand md:aspect-[16/9]">
        <Image src={project.color} alt={`${project.alt} — renkli görünüm`} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-contain mix-blend-multiply" />
        <div className="absolute inset-0 bg-paper" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><Image src={project.sketch} alt={`${project.alt} — eskiz`} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-contain mix-blend-multiply" /></div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-ink" style={{ left: `${position}%` }}><span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-solid border-paper/50 bg-ink text-paper">↔</span></div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 top-4 flex justify-between gap-4 text-[10px]"><span className="bg-paper/90 px-3 py-2">ESKİZ</span><span className="bg-paper/90 px-3 py-2">MEKÂN</span></div>
        <input type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} aria-label="Eskiz ve renkli görsel karşılaştırması" aria-valuetext={`Yüzde ${position} eskiz`} aria-describedby="comparison-help" className="absolute inset-0 m-0 h-full w-full cursor-ew-resize opacity-0" />
      </div>
    </section>
  );
}

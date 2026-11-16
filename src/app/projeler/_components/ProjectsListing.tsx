'use client';

import { useState } from 'react';
import { projects } from '@/constants/projects';
import ProjectsGrid from './ProjectsGrid';

const categories = [...new Set(projects.map(project => project.category))];

export default function ProjectsListing() {
  const [category, setCategory] = useState<string | null>(null);
  const filtered = category ? projects.filter(project => project.category === category) : projects;

  return (
    <section aria-label="Proje listesi">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-5 border-0 border-y border-solid border-line/40 py-4 sm:mb-8">
        <div role="group" aria-label="Proje kategorisine göre filtrele" className="flex flex-wrap gap-2">
          {[null, ...categories].map(option => (
            <button key={option ?? 'all'} type="button" aria-pressed={category === option} onClick={() => setCategory(option)} className={`min-h-11 cursor-pointer border border-solid px-4 py-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink motion-reduce:transition-none ${category === option ? 'border-ink bg-ink text-paper' : 'border-line/40 bg-transparent text-ink hover:border-ink hover:bg-ink/5'}`}>
              {option ?? 'Tüm projeler'}
              <span className={`ml-3 text-[10px] tabular-nums ${category === option ? 'text-paper/65' : 'text-ink-muted'}`}>{String(option ? projects.filter(project => project.category === option).length : projects.length).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <p role="status" aria-atomic="true" className="m-0 text-xs text-ink-muted"><span className="tabular-nums">{String(filtered.length).padStart(2, '0')}</span> proje gösteriliyor</p>
      </div>
      <ProjectsGrid items={filtered} />
    </section>
  );
}

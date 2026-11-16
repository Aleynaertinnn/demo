import Image from 'next/image';
import type { Project } from '@/constants/projects';

export default function ProjectGallery({ project }: { project: Project }) {
  if (!project.gallery?.length) return null;
  return (
    <section aria-labelledby="project-gallery-heading" className="mx-auto mb-14 w-full max-w-5xl md:mb-24">
      <h2 id="project-gallery-heading" className="mt-0 mb-7 px-5 font-display text-[clamp(28px,3vw,44px)] font-medium tracking-[-.045em] sm:px-8 lg:px-12">Projeye yakından bakın.</h2>
      {project.isSample && <p className="mt-0 mb-6 px-5 text-xs leading-relaxed text-ink-muted sm:px-8 lg:px-12">Örnek galeri — farklı projelerden bir görsel seçkisi.</p>}
      <div className="grid gap-5 md:grid-cols-2">{project.gallery.map((image, index) => (
        <figure key={image.src} className={`m-0 border border-solid border-line/40 bg-surface/40 p-4 sm:p-6 ${index % 3 === 0 ? 'md:col-span-2' : ''}`}>
          <div className={`relative ${index % 3 === 0 ? 'aspect-square' : 'aspect-square'}`}><Image src={image.src} alt={image.alt} fill sizes={index % 3 === 0 ? '(max-width: 1024px) 100vw, 1024px' : '(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 512px'} className="object-contain mix-blend-multiply" /></div>
          {image.caption && <figcaption className="mt-4 text-xs text-ink-muted">{image.caption}</figcaption>}
        </figure>
      ))}</div>
    </section>
  );
}

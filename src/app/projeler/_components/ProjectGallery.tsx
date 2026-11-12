import Image from 'next/image';
import type { Project } from '@/constants/projects';

export default function ProjectGallery({ project }: { project: Project }) {
  return (
    <section aria-labelledby="project-gallery-heading">
      <h2 id="project-gallery-heading" className="mt-0 mb-6 text-xl font-medium">Projeye yakından bakın</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { src: project.sketch, label: 'Mimari çizim' },
          { src: project.color, label: 'Mimari görselleştirme' },
        ].map(image => (
          <figure key={image.src} className="m-0 border border-solid border-line/40 bg-paper p-4">
            <div className="relative aspect-square">
              <Image src={image.src} alt={`${project.alt} — ${image.label}`} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-contain mix-blend-multiply" />
            </div>
            <figcaption className="mt-4 font-handwritten text-sm text-ink-muted">{image.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

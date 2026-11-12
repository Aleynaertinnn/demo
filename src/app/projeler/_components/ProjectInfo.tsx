import type { Project } from '@/constants/projects';

export default function ProjectInfo({ project }: { project: Project }) {
  return (
    <section aria-labelledby="project-info-heading" className="mb-12 border-0 border-t border-solid border-line/40 pt-6">
      <h2 id="project-info-heading" className="mt-0 mb-4 text-xl font-medium">Proje hakkında</h2>
      <p className="m-0 max-w-2xl text-lg leading-relaxed text-ink-muted">{project.description}</p>
    </section>
  );
}

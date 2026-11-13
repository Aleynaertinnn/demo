import { projectsIntro } from '@/constants/projects';
import ProjectsGrid from '@/app/projeler/_components/ProjectsGrid';
import ProjectsReveal from './ProjectsReveal';

export default function ProjectsSection() {
  return (
    <ProjectsReveal>
    <section
      id="projeler"
      aria-labelledby="projects-heading"
      className="mx-5 mt-[clamp(64px,9vw,144px)] mb-12 scroll-mt-[100px] text-ink max-[600px]:mx-3"
    >
      <div data-projects-heading className="flex items-end justify-between gap-6 px-[clamp(16px,2vw,32px)] pb-9 max-[600px]:flex-col max-[600px]:items-start max-[600px]:px-2 max-[600px]:pb-7">
        <div>
          <p data-projects-label className="mt-0 mb-3 font-handwritten text-xs leading-5 font-medium tracking-[.06em] sm:text-sm">
            {projectsIntro.eyebrow}
          </p>
          <h2
            id="projects-heading"
            aria-label={projectsIntro.title}
            className="m-0 max-w-[20ch] text-[clamp(30px,3.5vw,56px)] leading-[1.12] font-medium tracking-[-.055em]"
          >
            {projectsIntro.titleLines.map(line => (
              <span key={line} aria-hidden="true" className="block overflow-hidden pb-[.1em] -mb-[.1em]">
                <span data-projects-line className="block">{line}</span>
              </span>
            ))}
          </h2>
        </div>
        <p data-projects-note className="m-0 shrink-0 -rotate-4 font-handwritten text-[13px] leading-[1.6] sm:text-sm max-[600px]:self-end">
          {projectsIntro.noteLines[0]}
          <br />
          {projectsIntro.noteLines[1]}{' '}
          <span aria-hidden="true" className="ml-2 inline-block align-middle text-xl leading-none">
            ↙
          </span>
        </p>
      </div>
      <div data-projects-rule aria-hidden="true" className="h-px origin-left bg-line/40" />
      <ProjectsGrid className="border-t-0" />
    </section>
    </ProjectsReveal>
  );
}

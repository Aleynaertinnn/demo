import { projects } from '@/constants/projects';
import ProjectCard from '../../app/projeler/_components/ProjectCard';

export default function ProjectsSection({
  headingTag: Heading = 'h2',
}: {
  headingTag?: 'h1' | 'h2';
}) {
  return (
    <section
      id="projeler"
      aria-labelledby="projects-heading"
      className="mx-5 mt-[clamp(64px,9vw,144px)] mb-12 scroll-mt-[100px] text-ink max-[600px]:mx-3"
    >
      <div className="flex items-end justify-between gap-6 px-[clamp(16px,2vw,32px)] pb-9 max-[600px]:flex-col max-[600px]:items-start max-[600px]:px-2 max-[600px]:pb-7">
        <div>
          <p className="mt-0 mb-[18px] text-[11px] font-medium tracking-[.12em]">
            ÇİZGİDEN MEKÂNA / PROJELER
          </p>
          <Heading
            id="projects-heading"
            className="m-0 max-w-[20ch] text-[clamp(30px,3.5vw,56px)] leading-[1.12] font-medium tracking-[-.055em]"
          >
            Her çizgide yeni bir yaşam.
          </Heading>
        </div>
        <p className="m-0 shrink-0 -rotate-4 font-handwritten text-[clamp(14px,1.3vw,19px)] leading-[1.5] max-[600px]:self-end">
          Bir eskizle başlar.
          <br />
          Yaşamla renklenir.{' '}
          <span aria-hidden="true" className="ml-3 inline-block text-[28px]">
            ↙
          </span>
        </p>
      </div>
      <div className="grid grid-cols-4 border border-solid border-line/40  max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

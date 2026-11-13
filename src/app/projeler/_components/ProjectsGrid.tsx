import { projects } from '@/constants/projects';
import ProjectCard from './ProjectCard';

export default function ProjectsGrid({ className = '' }: { className?: string }) {
  return (
    <div data-projects-grid className={`grid grid-cols-4 border border-solid border-line/40 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1 ${className}`}>
      {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
    </div>
  );
}

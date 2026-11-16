import { projects, type Project } from '@/constants/projects';
import ProjectCard from './ProjectCard';

export default function ProjectsGrid({ className = '', items = projects }: { className?: string; items?: readonly Project[] }) {
  return (
    <div data-projects-grid className={`grid grid-cols-4 border border-solid border-line/40 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1 ${className}`}>
      {items.map((project) => <ProjectCard key={project.id} project={project} index={projects.findIndex(item => item.id === project.id)} />)}
    </div>
  );
}

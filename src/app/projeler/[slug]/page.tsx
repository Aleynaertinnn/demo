import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/constants/projects';
import ProjectHero from '../_components/ProjectHero';
import ProjectInfo from '../_components/ProjectInfo';
import ProjectGallery from '../_components/ProjectGallery';
import ProjectComparison from '../_components/ProjectComparison';
import ProjectNavigation from '../_components/ProjectNavigation';
import ProjectCta from '../_components/ProjectCta';
import PageLayout from '@/components/layout/PageLayout';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(project => project.slug === slug);
  if (!project) notFound();
  return { title: `${project.category} | Uluk Mimarlık`, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find(project => project.slug === slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const previousProject = projects[(index - 1 + projects.length) % projects.length];
  const nextProject = projects[(index + 1) % projects.length];
  return (
    <PageLayout>
      <ProjectHero project={project} />
      <ProjectInfo project={project} />
      <ProjectComparison project={project} />
      <ProjectGallery project={project} />
      <ProjectCta />
      {projects.length > 1 && <ProjectNavigation previous={previousProject} next={nextProject} />}
    </PageLayout>
  );
}

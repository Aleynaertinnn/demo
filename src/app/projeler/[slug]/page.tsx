import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/constants/projects';
import ProjectHero from '../_components/ProjectHero';
import ProjectInfo from '../_components/ProjectInfo';
import ProjectGallery from '../_components/ProjectGallery';

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

  return (
    <main className="mx-auto mt-16 mb-16 max-w-7xl px-5 text-ink md:mt-24 md:px-8">
      <ProjectHero project={project} />
      <ProjectInfo project={project} />
      <ProjectGallery project={project} />
    </main>
  );
}

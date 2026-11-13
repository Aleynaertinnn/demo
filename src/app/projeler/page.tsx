import { projectsIntro } from '@/constants/projects';
import PageBanner from '@/components/ui/PageBanner';
import ProjectsGrid from './_components/ProjectsGrid';

export const metadata = {
  title: 'Projeler | Uluk Mimarlık',
  description: 'Uluk Mimarlık projeleri: fikirden çizime, çizimden yaşama.',
};

export default function ProjectsPage() {
  return (
    <main className="mx-3 mt-16 mb-12 text-ink sm:mx-5 md:mt-24">
      <PageBanner
        currentPage="Projeler"
        eyebrow={projectsIntro.eyebrow}
        title={projectsIntro.title}
        description="Her projemizde yerin ruhunu, ışığı ve yaşamın ihtiyaçlarını bir araya getiriyoruz. Çizgiden mekâna uzanan çalışmalarımızı keşfedin."
        className="mb-8 md:mb-12"
      />
      <ProjectsGrid />
    </main>
  );
}

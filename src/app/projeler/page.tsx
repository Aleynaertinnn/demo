import { projectsIntro } from '@/constants/projects';
import PageBanner from '@/components/ui/PageBanner';
import PageLayout from '@/components/layout/PageLayout';
import ProjectsListing from './_components/ProjectsListing';

export const metadata = {
  title: 'Projeler | Uluk Mimarlık',
  description: 'Uluk Mimarlık projeleri: fikirden çizime, çizimden yaşama.',
};

export default function ProjectsPage() {
  return (
    <PageLayout>
      <PageBanner
        currentPage="Projeler"
        eyebrow={projectsIntro.eyebrow}
        title={projectsIntro.title}
        description="Her projemizde yerin ruhunu, ışığı ve yaşamın ihtiyaçlarını bir araya getiriyoruz. Çizgiden mekâna uzanan çalışmalarımızı keşfedin."
        className="mb-8 md:mb-12"
      />
      <ProjectsListing />
    </PageLayout>
  );
}

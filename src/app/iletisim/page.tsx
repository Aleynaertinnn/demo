import PageBanner from '@/components/ui/PageBanner';
import PageLayout from '@/components/layout/PageLayout';
import ProjectInquiry from '@/components/contact/ProjectInquiry';
import DirectContact from '@/components/contact/DirectContact';

export const metadata = {
  title: 'İletişim | Uluk Mimarlık',
  description: 'Uluk Mimarlık projeleri: fikirden çizime, çizimden yaşama.',
};

export default function ProjectsPage() {
  return (
    <PageLayout>
      <PageBanner
        currentPage="İletişim"
        eyebrow="İletişim"
        title="İletişim"
        description="Her projemizde yerin ruhunu, ışığı ve yaşamın ihtiyaçlarını bir araya getiriyoruz. Çizgiden mekâna uzanan çalışmalarımızı keşfedin."
        className="mb-8 md:mb-12"
      />
      <ProjectInquiry />
      <DirectContact />
    </PageLayout>
  );
}

import PageBanner from '@/components/ui/PageBanner';

export const metadata = {
  title: 'İletişim | Uluk Mimarlık',
  description: 'Uluk Mimarlık projeleri: fikirden çizime, çizimden yaşama.',
};

export default function ProjectsPage() {
  return (
    <main className="mx-3 mt-3 mb-12 text-ink sm:mx-5 md:mt-4">
      <PageBanner
        currentPage="İletişim"
        eyebrow="İletişim"
        title="İletişim"
        description="Her projemizde yerin ruhunu, ışığı ve yaşamın ihtiyaçlarını bir araya getiriyoruz. Çizgiden mekâna uzanan çalışmalarımızı keşfedin."
        className="mb-8 md:mb-12"
      />
    </main>
  );
}

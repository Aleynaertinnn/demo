import AtelierExperience from '@/features/atelier/AtelierExperience';
import ProjectsSection from '@/components/home/ProjectsSection';
import FounderSection from '@/components/home/founder/FounderSection';
import ServicesIntro from '@/components/home/services/ServicesIntro';
import ServicesExperience from '@/components/home/services/ServicesExperience';

export default function Page() {
  return (
    <main>
      <AtelierExperience />
      <ProjectsSection />
      <FounderSection />
      <ServicesExperience>
        <ServicesIntro />
      </ServicesExperience>
    </main>
  );
}

'use client';

import useScrollJourney from './animation/use-scroll-journey';
import { presentationSteps } from './config/presentation.mjs';
import AtelierCanvas from './scene/AtelierCanvas';
import HeroIntro from '@/components/home/HeroIntro';
import PresentationCaption from './components/PresentationCaption';

export default function AtelierExperience() {
  const { journey, frame, motion } = useScrollJourney();
  return (
    <div className="atelier-experience">
      <section id="surec" aria-label="Bir proje nasıl ilerler?">
        <HeroIntro />
        <div className="atelier-journey" ref={journey}>
          <div className="atelier-frame" ref={frame}>
            <div className="viewport">
              <AtelierCanvas motion={motion} />
              <div className="atelier-grain" aria-hidden="true" />
            </div>
            <div className="presentation-copy">
              {presentationSteps.map((step, index) => (
                <PresentationCaption key={step.label} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

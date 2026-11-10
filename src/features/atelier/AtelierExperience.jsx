'use client';

import useScrollJourney from './animation/use-scroll-journey';
import { presentationSteps } from './config/presentation.mjs';
import AtelierCanvas from './scene/AtelierCanvas';
import HeroIntro from '@/components/home/HeroIntro';

export default function AtelierExperience() {
  const { journey, frame, motion } = useScrollJourney();
  return (
    <main className="atelier-experience">
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
                <article
                  key={step.label}
                  data-presentation-step={index + 1}
                  className={`presentation-step ${index % 2 ? 'presentation-step-left' : 'presentation-step-right'}`}
                >
                  <p className="presentation-label">{step.label}</p>
                  <h2>{step.title}</h2>
                  {step.description && (
                    <p className="presentation-description">
                      {step.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

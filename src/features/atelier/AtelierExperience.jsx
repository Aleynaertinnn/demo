'use client'

import useScrollJourney from './animation/use-scroll-journey'
import { sceneLabels } from './config/journey.mjs'
import AtelierCanvas from './scene/AtelierCanvas'
import HeroIntro from '@/components/home/HeroIntro'
import SceneCaption from './components/SceneCaption'
import FinaleCaption from './components/FinaleCaption'

export default function AtelierExperience() {
  const journey = useScrollJourney()
  return (
    <main className="atelier-experience">
      <section id="surec" aria-label="Bir proje nasıl ilerler?">
        <HeroIntro />
        <div className="atelier-journey" ref={journey.journey}>
          <figure className="atelier-frame">
            <div className="viewport" ref={journey.viewport}>
              <AtelierCanvas motion={journey.motion} />
              <div className="atelier-grain" aria-hidden="true" />
              <SceneCaption {...journey} />
              <FinaleCaption {...journey} />
            </div>
            <figcaption>
              <span>{sceneLabels[journey.stage]}</span>
              <button onClick={journey.replay}>↻ &nbsp;Başa dön</button>
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  )
}

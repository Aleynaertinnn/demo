import { useLayoutEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { MathUtils } from 'three'
import { atelierPose, constructionPose, interiorPose, designPose, dayPose, exteriorPose, finalePose } from './camera-poses.mjs'
import { designAtProgress } from '../config/interior-designs.mjs'
import { sketchStart, exteriorStart, finaleStart, lifeStart, designStart, interiorStart, modelStart } from '../config/journey.mjs'

export default function useScrollJourney() {
  const lenis = useLenis()
  const viewport = useRef(null)
  const journey = useRef(null)
  const motion = useRef(atelierPose(0))
  const [take, setTake] = useState(0)
  const [stage, setStage] = useState(1)
  const [interiorProgress, setInteriorProgress] = useState(0)
  const [designIndex, setDesignIndex] = useState(0)
  const [dayProgress, setDayProgress] = useState(0)
  const [exteriorProgress, setExteriorProgress] = useState(0)
  const [finaleProgress, setFinaleProgress] = useState(0)

  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    function updateJourney() {
      const track = journey.current
      const top = track.getBoundingClientRect().top
      const trackDistance = track.offsetHeight - viewport.current.parentElement.offsetHeight
      const remainingPage = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      const distance = Math.min(trackDistance, remainingPage - top)
      const progress = MathUtils.clamp(-top / Math.max(distance, 1), 0, 1)
      const timeline = preference.matches ? 1 : MathUtils.clamp(progress/finaleStart,0,1)
      const finale = preference.matches ? 1 : MathUtils.clamp((progress-finaleStart)/(1-finaleStart),0,1)
      const build = MathUtils.clamp((timeline - modelStart) / (interiorStart - modelStart), 0, 1)
      const opening=MathUtils.clamp((timeline-interiorStart)/(designStart-interiorStart),0,1)
      const design=designAtProgress(MathUtils.clamp((timeline-designStart)/(lifeStart-designStart),0,1))
      const day=MathUtils.clamp((timeline-lifeStart)/(exteriorStart-lifeStart),0,1)
      const outside=MathUtils.clamp((timeline-exteriorStart)/(1-exteriorStart),0,1)
      Object.assign(motion.current, {finale:0}, progress>=finaleStart || preference.matches ? finalePose(finale) : timeline < modelStart
        ? atelierPose(timeline / modelStart)
        : timeline < interiorStart ? constructionPose(build) : timeline < designStart ? interiorPose(opening) : timeline < lifeStart ? designPose(design) : timeline < exteriorStart ? dayPose(day) : exteriorPose(outside))
      setDesignIndex(Math.round(design))
      setDayProgress(Math.round(day*100))
      setExteriorProgress(Math.round(outside*100))
      setFinaleProgress(Math.round(finale*100))
      setInteriorProgress(Math.round(opening*100))
      setStage(progress>=finaleStart || preference.matches ? 8 : timeline >= exteriorStart ? 7 : timeline >= lifeStart ? 6 : timeline >= designStart ? 5 : timeline >= interiorStart ? 4 : timeline >= modelStart ? 3 : timeline >= sketchStart * modelStart ? 2 : 1)
    }

    updateJourney()
    window.addEventListener('scroll', updateJourney, { passive: true })
    window.addEventListener('resize', updateJourney)
    preference.addEventListener('change', updateJourney)
    return () => {
      window.removeEventListener('scroll', updateJourney)
      window.removeEventListener('resize', updateJourney)
      preference.removeEventListener('change', updateJourney)
    }
  }, [take])

  function replay() {
    setDayProgress(0)
    setExteriorProgress(0)
    setDesignIndex(0)
    setInteriorProgress(0)
    motion.current.finale=0
    setFinaleProgress(0)
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo({ top: 0, behavior: 'instant' })
    setTake(value => value + 1)
  }

  return { viewport, journey, motion, stage, interiorProgress, designIndex, dayProgress, exteriorProgress, finaleProgress, replay }
}

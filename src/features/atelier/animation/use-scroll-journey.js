import { useLayoutEffect, useRef } from 'react'
import { MathUtils } from 'three'
import { atelierPose, constructionPose, interiorPose, designPose, dayPose, exteriorPose, finalePose } from './camera-poses.mjs'
import { designAtProgress } from '../config/interior-designs.mjs'
import { exteriorStart, lifeStart, designStart, interiorStart, modelStart } from '../config/journey.mjs'
import { presentationSteps } from '../config/presentation.mjs'

const clamp = value => MathUtils.clamp(value, 0, 1)
const smooth = (value, start, end) => MathUtils.smoothstep(value, start, end)
const totalWeight = presentationSteps.reduce((sum, step) => sum + (step.weight || 1), 0)

function poseAt(timeline) {
  if (timeline >= 1) return finalePose(clamp(timeline - 1))
  const build = clamp((timeline - modelStart) / (interiorStart - modelStart))
  const opening = clamp((timeline - interiorStart) / (designStart - interiorStart))
  const design = designAtProgress(clamp((timeline - designStart) / (lifeStart - designStart)))
  const day = clamp((timeline - lifeStart) / (exteriorStart - lifeStart))
  const outside = clamp((timeline - exteriorStart) / (1 - exteriorStart))
  return timeline < modelStart ? atelierPose(timeline / modelStart)
    : timeline < interiorStart ? constructionPose(build)
    : timeline < designStart ? interiorPose(opening)
    : timeline < lifeStart ? designPose(design)
    : timeline < exteriorStart ? dayPose(day) : exteriorPose(outside)
}

export default function useScrollJourney() {
  const journey = useRef(null)
  const frame = useRef(null)
  const motion = useRef(atelierPose(0))

  useLayoutEffect(() => {
    const track = journey.current
    const container = frame.current
    const header = document.querySelector('body > header')
    const panels = [...container.querySelectorAll('[data-presentation-step]')]
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let active = -1

    function update() {
      raf = 0
      const reduced = preference.matches
      const headerTop = header ? parseFloat(getComputedStyle(header).top) || 0 : 0
      const headerHeight = header ? header.offsetHeight + headerTop : 0
      const gap = Math.max(12, Math.min(32, window.innerWidth * .018))
      const stickyTop = headerHeight + gap
      const available = Math.max(1, window.innerHeight - stickyTop - gap)
      const top = track.getBoundingClientRect().top
      const initialTop = top + window.scrollY
      const initialHeight = Math.max(180, window.innerHeight - initialTop - gap)
      const expansion = reduced ? 0 : clamp(window.scrollY / Math.max(initialTop - stickyTop, 1))
      const distance = Math.max(1, track.offsetHeight - available)
      const progress = reduced ? 0 : clamp((stickyTop - top) / distance)
      let position = Math.min(progress * totalWeight, totalWeight - 0.000001)
      let index = 0
      while (index < presentationSteps.length - 1 && position >= (presentationSteps[index].weight || 1)) {
        position -= presentationSteps[index].weight || 1
        index++
      }
      const local = position / (presentationSteps[index].weight || 1)
      const step = presentationSteps[index]
      const part = step.finale ? smooth(local, .10, .80) : smooth(local, .16, .86)
      const timeline = MathUtils.lerp(step.start, step.end, part)
      const isMobile = window.matchMedia('(max-width: 700px)').matches
      // The last composition stays in place until the sticky section scrolls away.
      const panelOpacity = smooth(local, .08, .22) * (step.finale ? 1 : 1 - smooth(local, .78, .90))
      const split = smooth(local, .03, .18) * (step.finale ? 1 : 1 - smooth(local, .87, .98))
      const sceneShare = 1 - .35 * split
      const sceneLeft = index % 2 ? 1 - sceneShare : 0
      const direction = index % 2 ? -1 : 1
      const shift = direction * (isMobile ? 12 : 32) * (1 - smooth(local, .08, .22))

      container.style.setProperty('--header-offset', `${stickyTop}px`)
      container.style.setProperty('--available-height', `${available}px`)
      container.style.setProperty('--initial-height', `${initialHeight}px`)
      container.style.setProperty('--expansion', expansion)
      container.style.setProperty('--scene-share', sceneShare)
      container.style.setProperty('--scene-left', sceneLeft)
      container.style.setProperty('--split', split)
      if (!reduced) Object.assign(motion.current, { finale: 0 }, poseAt(timeline))
      else Object.assign(motion.current, { finale: 0 }, atelierPose(0))
      container.style.setProperty('--sketch-note-opacity', reduced ? 1 : smooth(motion.current.sketch || 0, .02, .2))
      panels.forEach((panel, i) => {
        panel.style.setProperty('--panel-opacity', i === index ? panelOpacity : 0)
        panel.style.setProperty('--panel-shift', `${i === index ? shift : 0}px`)
        if (!reduced && i !== active) panel.setAttribute('aria-hidden', i === index && expansion >= .99 ? 'false' : 'true')
      })
      const visible = expansion >= .99 && !reduced ? index : -1
      if (visible !== active) {
        active = visible
        panels.forEach((panel, i) => panel.setAttribute('aria-hidden', reduced || i === visible ? 'false' : 'true'))
        container.dataset.activeStep = visible < 0 ? '' : String(visible + 1)
      }
    }

    function schedule() { if (!raf) raf = requestAnimationFrame(update) }
    const observer = new ResizeObserver(schedule)
    if (header) observer.observe(header)
    observer.observe(track)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    preference.addEventListener('change', schedule)
    update()
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      preference.removeEventListener('change', schedule)
    }
  }, [])

  return { journey, frame, motion }
}

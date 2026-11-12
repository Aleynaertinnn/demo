import gsap from 'gsap'

// The scene and the captions share one scroll position; no second scroll trigger.
export function createCaptionTimelines(panels, steps) {
  return panels.map((panel, index) => {
    const timeline = gsap.timeline({ paused: true })
    timeline.to({}, { duration: 1 }, 0)
      .fromTo(panel, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: .1, ease: 'none' }, .08)
      .fromTo(panel.querySelector('[data-caption-label]'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .12, ease: 'power2.out' }, .1)
      .fromTo(panel.querySelectorAll('[data-caption-line]'), { yPercent: 110 }, { yPercent: 0, duration: .17, stagger: .035, ease: 'power3.out' }, .12)
      .fromTo(panel.querySelector('[data-caption-description]'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .14, ease: 'power2.out' }, .25)
      .fromTo(panel.querySelector('[data-caption-rule]'), { scaleX: 0 }, { scaleX: 1, duration: .3, ease: 'power2.inOut' }, .09)
      .fromTo(panel.querySelectorAll('[data-caption-corner]'), { opacity: 0 }, { opacity: .6, duration: .16 }, .14)
    if (!steps[index].finale) timeline.to(panel, { autoAlpha: 0, y: -14, duration: .12, ease: 'power1.in' }, .8)
    return timeline
  })
}

'use client'

import { useEffect, useState } from 'react'

const LOGO_DURATION = 550
const COLLAPSE_AT = 24
const HIDE_AFTER = 120
const DIRECTION_DISTANCE = 8

export default function useHeaderScroll() {
  const [collapsed, setCollapsed] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let previousY = Math.max(0, window.scrollY)
    let compact = previousY > COLLAPSE_AT
    let direction = 0
    let travel = 0
    let logoAnimating = false
    let pendingHide = false
    let frame = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    setCollapsed(compact)

    function update() {
      frame = 0
      const y = Math.max(0, window.scrollY)
      const delta = y - previousY
      previousY = y

      if (y <= 8) {
        clearTimeout(timer)
        compact = false
        logoAnimating = false
        pendingHide = false
        travel = 0
        direction = 0
        setCollapsed(false)
        setHidden(false)
        return
      }

      if (!compact && y > COLLAPSE_AT) {
        compact = true
        setCollapsed(true)
        // The first departure always completes the wordmark before hiding the bar.
        logoAnimating = !reducedMotion.matches
        timer = setTimeout(() => {
          logoAnimating = false
          if (pendingHide && window.scrollY > HIDE_AFTER) setHidden(true)
        }, reducedMotion.matches ? 0 : LOGO_DURATION)
      }

      if (!delta) return
      const nextDirection = Math.sign(delta)
      if (nextDirection !== direction) {
        direction = nextDirection
        travel = 0
      }
      travel += Math.abs(delta)

      if (direction < 0) {
        pendingHide = false
        if (travel >= DIRECTION_DISTANCE) setHidden(false)
      } else if (travel >= DIRECTION_DISTANCE) {
        pendingHide = compact && y > HIDE_AFTER
        if (pendingHide && !logoAnimating) setHidden(true)
      }
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [])

  return { collapsed, hidden }
}

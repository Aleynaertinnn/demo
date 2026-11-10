'use client'

import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'

export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(!preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  return enabled ? <ReactLenis root options={{ autoRaf: true, anchors: true, lerp: 0.12 }} /> : null
}

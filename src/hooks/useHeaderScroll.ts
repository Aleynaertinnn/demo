'use client'

import { useEffect, useState } from 'react'

export default function useHeaderScroll() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    function update() {
      const y = Math.max(0, window.scrollY)
      setCollapsed(current => y <= 8 ? false : y > 24 ? true : current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return { collapsed }
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import menuIcon from '@iconify-icons/lucide/menu'
import closeIcon from '@iconify-icons/lucide/x'
import Icon from '@/components/ui/Icon'
import VisitButton from '@/components/ui/VisitButton'
import useHeaderScroll from './useHeaderScroll'

import { navigation } from '@/constants/navigation'

const cellClass = 'group relative flex min-h-16 box-border items-start border-0 border-l border-solid border-line/40 px-5 py-3 font-sans text-[0.75rem] font-medium uppercase leading-normal no-underline transition-colors hover:bg-brand/5 hover:text-brand focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand'

function CornerMark() {
  return <span aria-hidden="true" className="absolute right-2.5 bottom-2.5 h-1.5 w-1.5 border-0 border-r border-b border-solid border-line" />
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const { collapsed } = useHeaderScroll()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header data-collapsed={collapsed}
      className="sticky top-3 z-50 mx-3 mt-3 border border-solid border-line/40 bg-paper/75 backdrop-blur-xl font-sans text-ink md:top-4 md:mx-5 md:mt-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto]">
        <Link href="/" aria-label="Uluk Mimarlık — Anasayfa" onClick={() => setMenuOpen(false)}
          className="group/logo flex min-h-16 items-center px-4 py-2 text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand lg:px-6">
          <span className="relative z-10 inline-flex shrink-0">
            <Image src="/images/brand/uluk-logo.svg" alt="" width={36} height={36} className="h-8 w-8 lg:h-9 lg:w-9" />
          </span>
          <span className={`overflow-hidden transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/logo:max-w-[220px] group-focus-visible/logo:max-w-[220px] ${collapsed ? 'max-w-0' : 'max-w-[220px]'}`}>
            <span className={`inline-block pl-2 font-logo-face text-[0.95rem] font-semibold tracking-[-0.035em] whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/logo:translate-x-0 group-focus-visible/logo:translate-x-0 sm:text-[1.1rem] lg:pl-2.5 ${collapsed ? '-translate-x-full' : 'translate-x-0'}`}>ULUK MİMARLIK</span>
          </span>
        </Link>

        <nav aria-label="Ana menü" className="hidden lg:flex">
          {navigation.map(item => (
            <Link key={item.href} href={item.href} prefetch={false} className={`${cellClass} w-[clamp(112px,9.5vw,176px)] text-ink`}>
              {item.label}
              <CornerMark />
            </Link>
          ))}
          <VisitButton />
        </nav>

        <button ref={menuButton} type="button" aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={menuOpen} aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(open => !open)}
          className="flex w-16 cursor-pointer items-center justify-center border-0 border-l border-solid border-line/40 bg-transparent p-0 text-ink hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand lg:hidden">
          <Icon icon={menuOpen ? closeIcon : menuIcon} width={23} height={23} />
        </button>
      </div>

      {menuOpen && <nav id="mobile-navigation" aria-label="Mobil menü" className="grid border-0 border-t border-solid border-line/40 lg:hidden">
        {navigation.map(item => (
          <Link key={item.href} href={item.href} prefetch={false} onClick={() => setMenuOpen(false)}
            className="relative border-0 border-b border-solid border-line/27 px-5 py-3 text-sm font-medium text-ink no-underline hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand">
            {item.label}
            <CornerMark />
          </Link>
        ))}
        <VisitButton variant="mobile" onClick={() => setMenuOpen(false)} />
      </nav>}
    </header>
  )
}

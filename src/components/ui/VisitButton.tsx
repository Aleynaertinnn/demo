'use client'

import type { MouseEventHandler } from 'react'
import Link from 'next/link'
import arrowUpRight from '@iconify-icons/lucide/arrow-up-right'
import Icon from './Icon'

type VisitButtonProps = {
  href?: string
  label?: string
  variant?: 'desktop' | 'mobile'
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

const slide = 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

export default function VisitButton({ href = '/iletisim', label = 'Projenizi konuşalım', variant = 'desktop', onClick }: VisitButtonProps) {
  const desktop = variant === 'desktop'

  return (
    <Link href={href} prefetch={false} onClick={onClick} aria-label={label}
      className={`group relative isolate flex overflow-hidden box-border font-sans font-medium leading-normal text-brand no-underline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand ${desktop
        ? 'min-h-16 w-[clamp(188px,15vw,244px)] items-start border-0 border-l border-solid border-line/40 px-5 py-3 text-[0.75rem] uppercase'
        : 'items-center justify-between px-5 py-3 text-sm'}`}>
      <span aria-hidden="true" className={`absolute inset-0 z-0 -translate-x-full bg-brand group-hover:translate-x-0 group-focus-visible:translate-x-0 ${slide}`} />
      <span aria-hidden="true" className="relative z-10 inline-grid overflow-hidden">
        <span className={`col-start-1 row-start-1 group-hover:-translate-y-full group-focus-visible:-translate-y-full ${slide}`}>{label}</span>
        <span className={`col-start-1 row-start-1 translate-y-full text-on-brand group-hover:translate-y-0 group-focus-visible:translate-y-0 ${slide}`}>{label}</span>
      </span>
      <Icon icon={arrowUpRight} width={19} height={19}
        className={`z-10 shrink-0 transition-colors duration-500 group-hover:text-on-brand group-focus-visible:text-on-brand motion-reduce:transition-none ${desktop ? 'absolute right-3 bottom-2.5' : 'relative'}`} />
    </Link>
  )
}

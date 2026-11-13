'use client';

import { useId, useState } from 'react';
import { useFounderPins } from './FounderPinContext';
import { founder } from '@/constants/founder';

export default function FounderPins({ index, className = '' }: { index: number; className?: string }) {
  const [manualOpen, setOpen] = useState(false);
  const { demoIndex, cancelDemo } = useFounderPins();
  const open = manualOpen || demoIndex === index;
  const tooltipId = useId();
  const pin = founder.pins[index];
  const opensLeft = index % 2 === 1;

  return (
    <span className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 text-left font-sans text-sm leading-normal font-normal tracking-normal normal-case ${className}`}
      onPointerEnter={event => { if (event.pointerType === 'mouse') { cancelDemo(); setOpen(true); } }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setOpen(false); }}
      onKeyDown={event => { if (event.key === 'Escape') { cancelDemo(); setOpen(false); event.stopPropagation(); } }}
    >
      <button type="button" aria-label={pin.title} aria-expanded={open} aria-controls={tooltipId} aria-describedby={open ? tooltipId : undefined}
        onFocus={event => { if (event.currentTarget.matches(':focus-visible')) { cancelDemo(); setOpen(true); } }}
        onBlur={() => setOpen(false)}
        onClick={event => {
          cancelDemo();
          const pointerType = (event.nativeEvent as PointerEvent).pointerType;
          if (pointerType === 'mouse') setOpen(true);
          else setOpen(current => !current);
        }}
        className="relative z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span aria-hidden="true" className={`absolute h-5 w-5 rounded-full bg-ink/40 motion-reduce:animate-none ${open ? '' : 'animate-ping [animation-duration:2.5s]'}`} style={{ animationDelay: `${index * .6}s` }} />
        <span aria-hidden="true" className="relative flex h-5 w-5 items-center justify-center rounded-full border border-solid border-paper bg-ink shadow-[0_0_0_2px_var(--color-paper)]">
          <span className="h-1.5 w-1.5 rounded-full bg-paper" />
        </span>
      </button>
      <span id={tooltipId} role="tooltip" aria-hidden={!open}
        className={`absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-full transition-[clip-path,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${opensLeft ? 'right-[12px]' : 'left-[12px]'} ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        style={{ clipPath: open ? 'inset(0 0 0 0 round 999px)' : opensLeft ? 'inset(0 0 0 100% round 999px)' : 'inset(0 100% 0 0 round 999px)' }}
      >
        <span className={`block w-max whitespace-nowrap bg-ink py-2.5 text-[11px] leading-none font-semibold tracking-[-.01em] text-paper transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none sm:py-3 sm:text-xs ${opensLeft ? 'pr-7 pl-4' : 'pr-4 pl-7'} ${open ? 'translate-x-0' : opensLeft ? 'translate-x-3' : '-translate-x-3'}`}>
          {pin.title}
        </span>
      </span>
    </span>
  );
}

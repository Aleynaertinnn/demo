'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsReveal({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!enabled) return;
    const media = gsap.matchMedia();
    let disposed = false;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const heading = root.current!.querySelector('[data-projects-heading]');
      const timeline = gsap.timeline({ scrollTrigger: { trigger: heading, start: 'top 82%', once: true } });
      timeline
        .fromTo('[data-projects-label]', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, 0)
        .fromTo('[data-projects-line]', { yPercent: 110 }, { yPercent: 0, duration: .85, stagger: .1, ease: 'power3.out' }, .1)
        .fromTo('[data-projects-note]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power2.out' }, .35)
        .fromTo('[data-projects-rule]', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, .1);

      const grid = root.current!.querySelector('[data-projects-grid]')!;
      const cards = Array.from(grid.querySelectorAll<HTMLElement>(':scope > article'));
      const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      cards.forEach((card, index) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 40 }, {
          autoAlpha: 1, y: 0, duration: .9, ease: 'power3.out',
          delay: (index % columns) * .1,
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        });
      });
    }, root);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); };
  }, [enabled]);

  return <div ref={root}>{children}</div>;
}

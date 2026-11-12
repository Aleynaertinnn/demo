'use client';

import { createContext, useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { founder } from '@/constants/founder';

gsap.registerPlugin(ScrollTrigger);

export const FounderPinContext = createContext({ demoIndex: null as number | null, cancelDemo: () => {} });

export default function FounderReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const demo = useRef<gsap.core.Timeline | null>(null);
  const cancelled = useRef(false);
  const [demoIndex, setDemoIndex] = useState<number | null>(null);
  const cancelDemo = useCallback(() => {
    cancelled.current = true;
    demo.current?.pause();
    setDemoIndex(null);
  }, []);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      root.current!.querySelectorAll('[data-founder-ornament-group]').forEach(group => {
        const ornaments = group.querySelectorAll('[data-founder-ornament]');
        const ornamentAccent = gsap.timeline({ paused: true })
          .to(ornaments, { scale: 1.8, color: 'var(--color-brand)', duration: .3, stagger: .08, ease: 'power2.out' }, 0)
          .to(ornaments, { rotation: 360, duration: 1.1, stagger: .08, ease: 'power2.inOut' }, .05)
          .to(ornaments, { scale: 1, color: 'var(--color-ink-muted)', duration: .4, stagger: .08, ease: 'power2.inOut' }, .8);
        const playOrnaments = () => {
          if (ornamentAccent.isActive()) return;
          gsap.set(ornaments, { rotation: 0, scale: 1, color: 'var(--color-ink-muted)' });
          ornamentAccent.invalidate().restart();
        };
        ScrollTrigger.create({
          trigger: group, start: 'center center', end: '+=1',
          onEnter: playOrnaments,
          onEnterBack: playOrnaments,
        });
      });
      const photoFrame = root.current!.querySelector('[data-founder-photo-frame]');
      const photoCorners = Array.from(root.current!.querySelectorAll<HTMLElement>('[data-founder-photo-corner]'));
      const cornerColors = photoCorners.map(corner => getComputedStyle(corner).borderColor);
      const cornerAccent = gsap.timeline({ paused: true })
        .fromTo(photoCorners,
          { scale: 1, borderColor: (index: number) => cornerColors[index] },
          { scale: 1.7, borderColor: 'var(--color-brand)', duration: .65, ease: 'sine.inOut', repeat: 1, yoyo: true });
      const playPhotoCorners = () => {
        if (cornerAccent.isActive()) return;
        cornerAccent.restart();
      };
      ScrollTrigger.create({
        trigger: photoFrame, start: 'center center', end: '+=1',
        onEnter: playPhotoCorners,
        onEnterBack: playPhotoCorners,
      });
      const pinDemo = gsap.timeline({ paused: true });
      demo.current = pinDemo;
      founder.pins.forEach((_, index) => {
        pinDemo.call(() => setDemoIndex(index), [], index * 1.5)
          .call(() => setDemoIndex(null), [], index * 1.5 + 1.1);
      });
      const words = root.current!.querySelectorAll('[data-founder-word]');
      const quoteEnd = .1 + .85 + Math.max(0, words.length - 1) * .055;
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%', once: true } })
        .fromTo('[data-founder-label]', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, 0)
        .fromTo(words,
          { autoAlpha: 0, yPercent: 35, filter: 'blur(6px)' },
          { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: .85, stagger: .055, ease: 'power3.out' }, .1)
        .fromTo('[data-founder-line] button', { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 }, quoteEnd)
        .fromTo('[data-founder-photo]', { filter: 'blur(10px)', autoAlpha: 0, scale: .96 }, { filter: 'blur(0px)', autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, quoteEnd - .3)
        .fromTo('[data-founder-identity]', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power2.out' }, quoteEnd + .1)
        .fromTo('[data-founder-note]', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .6 }, quoteEnd + .25)
        .call(() => { if (!cancelled.current) pinDemo.play(0); }, [], quoteEnd + 1);
      return () => {
        pinDemo.pause();
        demo.current = null;
        setDemoIndex(null);
      };
    }, root);
    return () => media.revert();
  }, []);

  const context = useMemo(() => ({ demoIndex, cancelDemo }), [demoIndex, cancelDemo]);
  return <FounderPinContext.Provider value={context}><div ref={root}>{children}</div></FounderPinContext.Provider>;
}

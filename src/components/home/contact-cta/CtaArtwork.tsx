'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactCta } from '@/constants/contact-cta';
import CtaFrame from './CtaFrame';

gsap.registerPlugin(ScrollTrigger);

export default function CtaArtwork() {
  const artwork = useRef<HTMLDivElement>(null);
  const color = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    let disposed = false;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(color.current, {
        maskImage: 'linear-gradient(to bottom, #000 calc(var(--reveal) - 6%), transparent calc(var(--reveal) + 6%))',
      });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: artwork.current,
          start: 'top 85%',
          end: 'bottom 95%',
          scrub: .6,
          invalidateOnRefresh: true,
        },
      });
      timeline.fromTo(color.current,
        { '--reveal': '-8%' },
        { '--reveal': '108%', duration: 1, ease: 'none' },
      );
    }, artwork);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); };
  }, []);

  return (
    <figure className="relative mx-auto mt-4 mb-0 w-[min(100%,60svh)]">
      <CtaFrame area="artwork" />
      <div ref={artwork} className="relative isolate aspect-[1672/941]">
        <Image src={contactCta.artwork.drawing} alt={contactCta.artwork.alt} fill sizes="(max-width: 640px) 100vw, 60vh" className="object-contain" />
        <div ref={color} aria-hidden="true" className="absolute inset-0">
          <Image src={contactCta.artwork.color} alt="" fill sizes="(max-width: 640px) 100vw, 60vh" className="object-contain" />
        </div>

      </div>

    </figure>
  );
}

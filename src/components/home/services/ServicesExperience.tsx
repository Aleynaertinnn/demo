'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '@/constants/services';
import ServiceCard from './ServiceCard';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const railViewport = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const footer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    let disposed = false;
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 600px)', () => {
      const container = viewport.current!;
      const cards = rail.current!;
      const windowWidth = () => railViewport.current!.clientWidth;
      const distance = () => Math.max(0, cards.scrollWidth - windowWidth());
      const entryX = () => container.clientWidth * .88;
      const restingX = () => container.clientWidth * .56;

      gsap.set(container, { height: '100svh', overflow: 'hidden' });
      gsap.set(intro.current, { position: 'absolute', inset: 0 });
      gsap.set(stage.current, { position: 'absolute', inset: 0, backgroundColor: 'transparent' });
      gsap.set(railViewport.current, { overflow: 'clip', overscrollBehavior: 'auto' });
      gsap.set(footer.current, { autoAlpha: 0 });
      gsap.set(progress.current, { scaleX: 0, transformOrigin: 'left' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${container.clientHeight + restingX() + distance()}`,
          pin: container,
          scrub: .7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      timeline
        .fromTo(cards, { x: entryX, y: () => container.clientHeight * .76 }, { x: restingX, y: 0, duration: .85, ease: 'power1.inOut' })
        .to(footer.current, { autoAlpha: 1, duration: .2 }, .65)
        .to(cards, {
          x: () => -distance(),
          duration: () => Math.max(1, (distance() + restingX()) / container.clientHeight),
          ease: 'none',
          onUpdate() {
            const fraction = this.progress();
            gsap.set(progress.current, { scaleX: fraction });
            if (counter.current) counter.current.textContent = String(Math.min(services.length, 1 + Math.round(fraction * (services.length - 1)))).padStart(2, '0');
          },
        }, .85)
        .to({}, { duration: .15 });

      return () => {
        if (counter.current) counter.current.textContent = '01';
      };
    }, root);

    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); };
  }, []);

  return (
    <div ref={root} className="relative mt-12 bg-ink sm:mt-20">
      <div ref={viewport} className="relative">
        <div ref={intro} className="[&>section]:m-0 [&>section]:flex [&>section]:h-full [&>section]:min-h-[75svh] [&>section]:items-center [&>section]:justify-center">{children}</div>
        <section ref={stage} aria-labelledby="service-cards-heading" className="pointer-events-none relative z-20 flex min-h-[540px] flex-col justify-center bg-ink pt-[110px] pb-10 text-paper">
          <h2 id="service-cards-heading" className="sr-only">Hizmetlerimiz</h2>
          <div ref={railViewport} tabIndex={0} role="region" aria-label="Hizmetler: kartları keşfetmek için kaydırın" className="pointer-events-auto overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-paper">
            <div ref={rail} className="flex h-[clamp(360px,calc(100svh-150px),850px)] w-max gap-0 px-5 sm:px-10">
              {services.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}
            </div>
          </div>
          <div ref={footer} aria-hidden="true" className="absolute inset-x-5 bottom-3 flex items-center gap-5 sm:inset-x-10">
            <span className="text-[9px] tracking-[.1em] tabular-nums"><span ref={counter}>01</span> / 06</span>
            <span className="h-px flex-1 bg-paper/25"><span ref={progress} className="block h-full w-full origin-left scale-x-0 bg-paper" /></span>
            <span className="text-sm">⟶</span>
          </div>
        </section>
      </div>
    </div>
  );
}

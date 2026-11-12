import Image from 'next/image';
import { servicesIntro } from '@/constants/services';

export default function ServicesIntro() {
  return (
    <section
      id="hizmetler"
      aria-labelledby="services-heading"
      className="relative isolate mx-3 mt-12 mb-5 overflow-hidden bg-ink px-6 py-24 text-paper scroll-mt-28 sm:mx-5 sm:mt-20 sm:px-12 sm:py-32 lg:py-40"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image src={servicesIntro.images[0]} alt="" width={576} height={576} sizes="(max-width: 640px) 65vw, 40vw" className="absolute -bottom-12 -left-20 h-auto w-[65vw] max-w-[600px] opacity-[.12] mix-blend-screen sm:-left-24 sm:w-[40vw]" />
        <Image src={servicesIntro.images[1]} alt="" width={768} height={768} sizes="(max-width: 640px) 70vw, 45vw" className="absolute -top-12 -right-20 h-auto w-[70vw] max-w-[720px] opacity-[.12] mix-blend-screen sm:-right-28 sm:w-[45vw]" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <p className="mt-0 mb-8 font-handwritten text-xs leading-relaxed tracking-[.1em] text-paper/80 sm:mb-10 sm:text-sm">{servicesIntro.eyebrow}</p>
        <h2 id="services-heading" lang="tr" className="m-0 font-display text-[clamp(32px,5.8vw,84px)] leading-[1.05] font-semibold tracking-[-.055em] text-balance uppercase">
          {servicesIntro.title.map(line => <span key={line} className="block">{line.toLocaleUpperCase('tr-TR')}</span>)}
        </h2>
        <p className="mx-auto mt-8 mb-0 max-w-[60ch] text-sm leading-[1.9] text-pretty text-paper/80 sm:mt-10 sm:text-base">{servicesIntro.description}</p>
      </div>
    </section>
  );
}

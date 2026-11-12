import Image from 'next/image';
import plus from '@iconify-icons/lucide/plus';
import Icon from '@/components/ui/Icon';
import { founder } from '@/constants/founder';
import FounderPins from './FounderPins';
import FounderReveal from './FounderReveal';
import FounderQuoteLine from './FounderQuoteLine';

export default function FounderSection() {
  return (
    <FounderReveal>
    <section
      aria-labelledby="founder-heading"
      className="relative mx-3 my-0 flex min-h-[calc(100svh-110px)] flex-col items-center justify-center border-0 border-y border-solid border-line/35 px-5 py-[clamp(20px,4svh,40px)] text-center text-ink sm:mx-5 sm:px-10"
    >
      <div data-founder-ornament-group="top" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-between font-sans text-[10px] text-ink-muted">
        <span className="-translate-y-1/2 bg-paper pr-3"><span data-founder-ornament className="inline-flex text-ink-muted"><Icon icon={plus} width={14} height={14} /></span></span>
        <span className="-translate-y-1/2 bg-paper pl-3"><span data-founder-ornament className="inline-flex text-ink-muted"><Icon icon={plus} width={14} height={14} /></span></span>
      </div>

      <h2 data-founder-label id="founder-heading" className="m-0 font-handwritten text-sm leading-5 font-bold tracking-[.2em] uppercase sm:text-base">
        BAKIŞ AÇIMIZ
      </h2>

      <figure className="mx-auto mt-[clamp(16px,3svh,28px)] mb-0 w-full max-w-[1120px]">
        <div className="relative">
        <blockquote lang="tr" className="m-0 font-display text-[clamp(24px,min(5.6vw,7.5svh),80px)] leading-[1.12] font-semibold tracking-[-.065em] text-balance text-brand uppercase">
          <p className="m-0">
            <span className="block">
              <FounderQuoteLine text={founder.quote.opening} className="inline-block">
                <FounderPins index={0} className="left-[24%] top-1/2" />
              </FounderQuoteLine>
            </span>
            <span className="mt-[.12em] block">
              <FounderQuoteLine text={founder.quote.emphasis} className="inline-block">
                <FounderPins index={1} className="left-[78%] top-1/2" />
              </FounderQuoteLine>
            </span>
            <FounderQuoteLine text={founder.quote.closing} className="mx-auto mt-[.12em] block max-w-[24ch]">
              <FounderPins index={2} className="left-[20%] top-[25%]" />
              <FounderPins index={3} className="left-[78%] top-[75%]" />
            </FounderQuoteLine>
          </p>
        </blockquote>
        </div>

        <figcaption className="mt-[clamp(16px,3svh,28px)] flex flex-col items-center">
          <span aria-hidden="true" className="mb-[clamp(12px,2svh,20px)] h-[clamp(12px,3svh,28px)] w-px bg-line/40" />
          <div className="flex items-center gap-5 text-left">
            <div data-founder-photo-frame className="relative p-1.5">
              <span data-founder-photo-corner aria-hidden="true" className="absolute top-0 left-0 h-3 w-3 origin-top-left border-0 border-t border-l border-solid border-line/70" />
              <span data-founder-photo-corner aria-hidden="true" className="absolute right-0 bottom-0 h-3 w-3 origin-bottom-right border-0 border-r border-b border-solid border-line/70" />
              <Image data-founder-photo src={founder.image} alt={`${founder.name}, Uluk Mimarlık kurucu ortağı`} width={88} height={104} sizes="88px" className="block h-[clamp(64px,12svh,96px)] w-auto aspect-[88/104] object-cover object-[center_30%]" />
            </div>
            <div data-founder-identity>
              <p className="m-0 font-display text-xl leading-tight font-medium tracking-[-.035em] sm:text-2xl">{founder.name}</p>
              <p className="mt-2 mb-0 text-[10px] leading-relaxed tracking-[.12em] text-ink-muted uppercase">{founder.role}</p>
            </div>
          </div>
        </figcaption>
      </figure>

      <p data-founder-note className="mx-auto mt-[clamp(16px,3svh,28px)] mb-0 max-w-[32ch] font-handwritten text-xs leading-relaxed text-ink-muted sm:max-w-none sm:text-sm">{founder.note}</p>

      <div data-founder-ornament-group="bottom" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between font-sans text-[10px] text-ink-muted">
        <span className="translate-y-1/2 bg-paper pr-3"><span data-founder-ornament className="inline-flex text-ink-muted"><Icon icon={plus} width={14} height={14} /></span></span>
        <span className="translate-y-1/2 bg-paper pl-3"><span data-founder-ornament className="inline-flex text-ink-muted"><Icon icon={plus} width={14} height={14} /></span></span>
      </div>
    </section>
    </FounderReveal>
  );
}

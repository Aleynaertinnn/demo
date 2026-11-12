import CtaButton from '@/components/ui/CtaButton';
import { contactCta } from '@/constants/contact-cta';
import CtaArtwork from './CtaArtwork';
import CtaFrame from './CtaFrame';

export default function ContactCta() {
  return (
    <section aria-labelledby="contact-cta-heading" className="relative mx-3 mt-8 flex min-h-[calc(100svh-110px)] flex-col items-center justify-center py-[clamp(16px,3svh,28px)] text-ink sm:mx-5">
      <div className="relative mx-auto w-full max-w-4xl px-5 text-center">
        <p className="mt-0 mb-3 font-handwritten text-[10px] leading-relaxed tracking-[.06em] text-ink-muted">{contactCta.eyebrow}</p>
        <h2 id="contact-cta-heading" lang="tr" className="m-0 font-display text-[clamp(26px,min(3.5vw,4.5svh),48px)] leading-[1.08] font-semibold tracking-[-.05em] text-balance uppercase">
          {contactCta.title.map(line => <span key={line} className="block">{line.toLocaleUpperCase('tr-TR')}</span>)}
        </h2>
        <p className="mx-auto mt-4 mb-0 max-w-[53ch] text-[13px] leading-[1.65] text-pretty text-ink-muted">{contactCta.description}</p>
        <CtaFrame />
        <CtaButton href={contactCta.button.href} label={contactCta.button.label} className="mt-5" />
      </div>
      <CtaArtwork />
    </section>
  );
}

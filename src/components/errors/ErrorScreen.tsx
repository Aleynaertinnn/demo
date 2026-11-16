import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import CtaButton from '@/components/ui/CtaButton';

type ErrorScreenProps = {
  code: string;
  title: string;
  description: string;
  retry?: () => void;
};

export default function ErrorScreen({ code, title, description, retry }: ErrorScreenProps) {
  return (
    <PageLayout>
      <section aria-labelledby="error-title" className="relative grid min-h-[65svh] items-center gap-8 overflow-hidden border border-solid border-line/40 bg-surface/50 px-6 py-12 sm:px-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="relative flex min-h-48 items-center justify-center border-0 border-b border-solid border-line/30 pb-8 lg:min-h-80 lg:border-r lg:border-b-0 lg:pr-12 lg:pb-0">
          <span className="font-logo-face text-[clamp(100px,18vw,240px)] leading-none font-medium tracking-[-.08em] text-ink/15">{code}</span>
          <svg viewBox="0 0 180 160" fill="none" stroke="currentColor" strokeWidth="1" className="absolute h-40 w-44 text-ink/65 sm:h-48 sm:w-56">
            <path d="M20 130V40h70v30h60v60H20Z M50 40v45h40V40 M90 100v30 M120 70v30h30 M20 100h40v30" />
            <path strokeDasharray="3 5" d="M8 20h156M8 145h156M8 8v145M164 8v145" opacity=".5" />
            <path d="m103 111 32-22m-14 1 14-1-5 13" />
          </svg>
          <span className="absolute right-4 bottom-3 -rotate-4 font-handwritten text-sm text-ink-muted lg:right-10">Yeni bir çizgiden devam.</span>
        </div>
        <div className="max-w-xl">
          <p className="mt-0 mb-5 text-[10px] font-medium text-ink-muted">ULUK MİMARLIK / {code}</p>
          <h1 id="error-title" className="mt-0 mb-6 font-logo-face text-[clamp(32px,4vw,60px)] leading-[1.08] font-medium tracking-[-.045em] text-balance">{title}</h1>
          <p className="mt-0 mb-8 max-w-[43ch] text-sm leading-[1.9] text-ink-muted sm:text-base">{description}</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-5">
            {retry ? <button type="button" onClick={retry} className="min-h-14 cursor-pointer border-0 bg-ink px-6 py-4 text-xs font-medium text-paper transition-colors hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">Tekrar dene ↗</button> : <CtaButton href="/" label="Anasayfaya dön" />}
            <Link href={retry ? '/' : '/projeler'} className="inline-flex min-h-11 items-center gap-3 text-sm text-ink underline decoration-line/50 underline-offset-8 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">{retry ? 'Anasayfaya dön' : 'Projeleri keşfet'}<span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

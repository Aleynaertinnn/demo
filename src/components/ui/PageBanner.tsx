import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type PageBannerProps = {
  title: string;
  description: string;
  /** Parent pages, in order. The current page is added automatically. */
  breadcrumbs?: readonly BreadcrumbItem[];
  currentPage: string;
  eyebrow?: string;
  className?: string;
};

const homeBreadcrumb: readonly BreadcrumbItem[] = [{ label: 'Anasayfa', href: '/' }];

export default function PageBanner({
  title,
  description,
  breadcrumbs = homeBreadcrumb,
  currentPage,
  eyebrow,
  className = '',
}: PageBannerProps) {
  return (
    <header className={`relative overflow-hidden border border-solid border-line/40 bg-surface/50 text-ink ${className}`}>
      <nav aria-label="Sayfa yolu" className="border-0 border-b border-solid border-line/30 px-5 py-4 sm:px-8 lg:px-12">
        <ol className="m-0 flex list-none flex-wrap items-center gap-x-3 gap-y-2 p-0 text-xs leading-relaxed sm:text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={`${item.href}-${index}`} className="flex min-w-0 items-center gap-3">
              <Link href={item.href} className="text-ink-muted no-underline transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                {item.label}
              </Link>
              <span aria-hidden="true" className="text-line">/</span>
            </li>
          ))}
          <li aria-current="page" className="min-w-0 font-medium break-words">{currentPage}</li>
        </ol>
      </nav>

      <div className="relative px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <span aria-hidden="true" className="absolute top-5 right-5 h-4 w-4 border-0 border-t border-r border-solid border-line/60 sm:right-8 lg:right-12" />
        {eyebrow && <p className="mt-0 mb-5 font-handwritten text-xs leading-relaxed tracking-[.08em] text-ink-muted sm:text-sm">{eyebrow}</p>}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h1 className="m-0 max-w-[22ch] font-display text-[clamp(32px,4.5vw,68px)] leading-[1.1] font-medium tracking-[-.055em] text-balance break-words">{title}</h1>
          <p className="m-0 max-w-[48ch] text-sm leading-[1.9] text-pretty text-ink-muted sm:text-base">{description}</p>
        </div>
        <span aria-hidden="true" className="absolute bottom-5 left-5 h-4 w-4 border-0 border-b border-l border-solid border-line/60 sm:left-8 lg:left-12" />
      </div>
    </header>
  );
}

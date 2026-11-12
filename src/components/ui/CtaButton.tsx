import Link from 'next/link';

type CtaButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export default function CtaButton({ href, label, className = '' }: CtaButtonProps) {
  return (
    <Link href={href} prefetch={false} lang="tr"
      className={`group relative isolate inline-flex min-h-14 items-stretch overflow-hidden bg-brand font-sans text-on-brand no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none" />
      <span className="relative z-10 flex items-center px-5 py-4 text-xs leading-normal font-medium tracking-[.04em] uppercase sm:px-6">{label}</span>
      <span aria-hidden="true" className="relative z-10 flex w-14 shrink-0 items-center justify-center">
        <span className="absolute inset-y-2 left-0 border-0 border-l border-dashed border-on-brand/75" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none">
          <path d="M4 12h16m-6-6 6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

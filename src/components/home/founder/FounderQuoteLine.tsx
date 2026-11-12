import { Fragment, type ReactNode } from 'react';

export default function FounderQuoteLine({ text, children, className = '' }: { text: string; children?: ReactNode; className?: string }) {
  const words = text.toLocaleUpperCase('tr-TR').split(/\s+/);
  return (
    <span data-founder-line className={`relative ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            {index > 0 ? ' ' : null}
            <span className="inline-block overflow-hidden px-[max(8px,.16em)] py-[.2em] -mx-[max(8px,.16em)] -my-[.2em] align-bottom leading-[1.18]">
              <span data-founder-word className="inline-block">{word}</span>
            </span>
          </Fragment>
        ))}
      </span>
      {children}
    </span>
  );
}

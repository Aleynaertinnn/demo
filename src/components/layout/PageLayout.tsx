import type { ComponentPropsWithoutRef } from 'react';
import PageContainer from './PageContainer';

type PageLayoutProps = ComponentPropsWithoutRef<'main'> & {
  as?: 'main' | 'footer';
};

export default function PageLayout({ as: Tag = 'main', children, className = '', ...props }: PageLayoutProps) {
  const spacing = Tag === 'footer'
    ? 'mt-10 mb-3 sm:mb-5 [body:has([data-contact-cta])_&]:mt-0'
    : 'mt-3 mb-12 text-ink md:mt-4';

  return (
    <PageContainer as={Tag} {...props} className={`${spacing} ${className}`}>
      {children}
    </PageContainer>
  );
}

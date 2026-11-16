import type { ComponentPropsWithoutRef } from 'react';

type PageContainerProps = ComponentPropsWithoutRef<'div'> & {
  as?: 'div' | 'main' | 'section' | 'header' | 'footer';
};

export default function PageContainer({
  as: Tag = 'div',
  children,
  className = '',
  ...props
}: PageContainerProps) {
  return (
    <Tag {...props} className={`mx-3 sm:mx-5 ${className}`}>
      {children}
    </Tag>
  );
}

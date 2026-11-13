'use client';

import type { ReactNode } from 'react';
import { FounderPinProvider } from './FounderPinContext';
import useFounderAnimation from './useFounderAnimation';

function AnimatedFounder({ children }: { children: ReactNode }) {
  const root = useFounderAnimation();
  return <div ref={root}>{children}</div>;
}

export default function FounderReveal({ children }: { children: ReactNode }) {
  return (
    <FounderPinProvider>
      <AnimatedFounder>{children}</AnimatedFounder>
    </FounderPinProvider>
  );
}

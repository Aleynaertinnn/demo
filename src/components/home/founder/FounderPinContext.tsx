'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type Dispatch, type ReactNode, type RefObject, type SetStateAction } from 'react';
import type gsap from 'gsap';

type FounderPinState = {
  demoIndex: number | null;
  cancelDemo: () => void;
  demo: RefObject<gsap.core.Timeline | null>;
  cancelled: RefObject<boolean>;
  setDemoIndex: Dispatch<SetStateAction<number | null>>;
};

const FounderPinContext = createContext<FounderPinState | null>(null);

export function FounderPinProvider({ children }: { children: ReactNode }) {
  const demo = useRef<gsap.core.Timeline | null>(null);
  const cancelled = useRef(false);
  const [demoIndex, setDemoIndex] = useState<number | null>(null);
  const cancelDemo = useCallback(() => {
    cancelled.current = true;
    demo.current?.pause();
    setDemoIndex(null);
  }, []);
  const context = useMemo(() => ({ demoIndex, cancelDemo, demo, cancelled, setDemoIndex }), [demoIndex, cancelDemo]);
  return <FounderPinContext.Provider value={context}>{children}</FounderPinContext.Provider>;
}

export function useFounderPins() {
  const context = useContext(FounderPinContext);
  if (!context) throw new Error('Founder pin components must be inside FounderPinProvider.');
  return context;
}

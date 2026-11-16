'use client';

import { OPEN_COOKIE_PREFERENCES } from '@/lib/cookie-preferences';

export default function CookieSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES))} className="inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 text-[10px] text-paper/70 hover:text-paper hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper">Çerez tercihleri</button>;
}

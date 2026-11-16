export const CONSENT_COOKIE = 'uluk_cookie_preferences';
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const OPEN_COOKIE_PREFERENCES = 'uluk:open-cookie-preferences';

export function hasValidPreferences(cookieString: string): boolean {
  const value = cookieString.split(';').map(item => item.trim()).find(item => item.startsWith(`${CONSENT_COOKIE}=`))?.slice(CONSENT_COOKIE.length + 1);
  if (!value) return false;
  try {
    const saved = JSON.parse(decodeURIComponent(value));
    return saved.version === CONSENT_VERSION && saved.necessary === true && saved.analytics === false && saved.marketing === false;
  } catch { return false; }
}

export function preferenceCookie(secure: boolean): string {
  const value = encodeURIComponent(JSON.stringify({ version: CONSENT_VERSION, necessary: true, analytics: false, marketing: false }));
  return `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure ? '; Secure' : ''}`;
}

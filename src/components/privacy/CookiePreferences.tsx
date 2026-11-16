'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { hasValidPreferences, OPEN_COOKIE_PREFERENCES, preferenceCookie } from '@/lib/cookie-preferences';

const buttonClass = 'min-h-11 cursor-pointer border border-solid border-ink/40 bg-paper px-5 py-3 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink motion-reduce:transition-none';

export default function CookiePreferences() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  function openPreferences() {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setError('');
    dialog.current?.showModal();
  }
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let loaded = false;
    const schedule = () => {
      if (loaded) return;
      loaded = true;
      timer = setTimeout(() => setVisible(!hasValidPreferences(document.cookie)), 1200);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    const open = () => openPreferences();
    const sync = () => { if (hasValidPreferences(document.cookie)) setVisible(false); };
    window.addEventListener(OPEN_COOKIE_PREFERENCES, open);
    window.addEventListener('focus', sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', schedule);
      window.removeEventListener(OPEN_COOKIE_PREFERENCES, open);
      window.removeEventListener('focus', sync);
    };
  }, []);

  function save() {
    try {
      document.cookie = preferenceCookie(window.location.protocol === 'https:');
      if (!hasValidPreferences(document.cookie)) throw new Error('storage unavailable');
      setVisible(false); setError('');
      setStatus('Çerez tercihiniz kaydedildi. Analitik ve reklam çerezleri kullanılmıyor.');
      dialog.current?.close();
    } catch {
      setError('Tarayıcınız tercihin kaydedilmesine izin vermedi. İsteğe bağlı çerezler yine de çalıştırılmaz.');
    }
  }

  return (
    <>
      <p role="status" className="sr-only">{status}</p>
      {visible && <section aria-labelledby="cookie-banner-title" className="fixed right-3 bottom-3 left-3 z-[80] max-h-[65svh] overflow-y-auto border border-solid border-line/35 bg-paper/85 p-3 text-ink shadow-[0_4px_20px_rgb(35_61_114_/_0.06)] backdrop-blur-xl sm:right-auto sm:bottom-5 sm:left-5 sm:w-[310px] sm:p-3.5">
        <button type="button" onClick={save} aria-label="Yalnızca gerekli tercihle çerez bildirimini kapat" title="Yalnızca gerekli tercihle kapat" className="absolute top-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center border-0 bg-transparent text-xl text-ink hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink">×</button>
        <div className="grid gap-2.5">
          <div><p className="mt-0 mb-2 pr-7 text-[9px] font-semibold text-brand">GİZLİLİK TERCİHLERİ</p><h2 id="cookie-banner-title" className="mt-0 mb-2 font-display text-sm leading-tight font-semibold tracking-[-.035em]">Küçük bir gizlilik notu.</h2><p className="m-0 text-[10px] leading-relaxed text-ink-muted">Analitik ve reklam çerezi kullanmıyoruz. Yalnızca tercihinizi hatırlıyoruz. <Link href="/yasal/cerez-politikasi" className="text-ink underline underline-offset-3 focus-visible:outline-2 focus-visible:outline-ink">Çerez Politikası</Link>.</p></div>
          <div className="grid grid-cols-2 gap-2"><button type="button" onClick={save} className={`${buttonClass} px-3 py-2 text-[10px]`}>Anladım, kapat</button><button type="button" onClick={openPreferences} className={`${buttonClass} px-3 py-2 text-[10px]`}>Tercihler</button></div>
        </div>
        {error && <p role="alert" className="mt-4 mb-0 text-xs leading-relaxed">{error}</p>}
      </section>}
      <dialog data-lenis-prevent ref={dialog} aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-description" onClose={() => { if (opener.current?.isConnected) opener.current.focus({ preventScroll: true }); }} className="fixed inset-0 m-auto max-h-[85svh] w-[calc(100%_-_24px)] max-w-xl overflow-y-auto border border-solid border-line/60 bg-paper p-0 text-ink backdrop:bg-ink/35">
        <div className="p-6 sm:p-9">
          <div className="mb-6 flex items-start justify-between gap-4"><div><p className="mt-0 mb-3 text-[9px] font-bold text-brand">SİZİN TERCİHİNİZ</p><h2 id="cookie-settings-title" className="m-0 font-display text-2xl font-semibold tracking-[-.04em]">Çerez tercihleri.</h2></div><button type="button" onClick={() => dialog.current?.close()} aria-label="Çerez tercihlerini kapat" className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-solid border-line/40 bg-transparent text-xl text-ink focus-visible:outline-2 focus-visible:outline-ink">×</button></div>
          <p id="cookie-settings-description" className="mt-0 mb-6 text-sm leading-[1.8] text-ink-muted">Mevcut kullanım aşağıda açıklanmıştır. Bu paneli footer’daki “Çerez tercihleri” bağlantısından yeniden açabilirsiniz.</p>
          <dl className="m-0">
            <div className="border-0 border-t border-solid border-line/30 py-5"><dt className="flex flex-wrap justify-between gap-2 text-sm font-semibold">Gerekli tercih kaydı<span className="text-[10px] font-medium text-ink-muted">HER ZAMAN ETKİN</span></dt><dd className="mx-0 mt-3 mb-0 text-xs leading-[1.8] text-ink-muted">Çerez bandını her ziyarette tekrar göstermemek için seçiminizi 180 gün hatırlar. Reklam veya analiz amacı taşımaz.</dd></div>
            {['Analitik', 'Reklam ve pazarlama'].map(category => <div key={category} className="border-0 border-t border-solid border-line/30 py-5"><dt className="flex flex-wrap justify-between gap-2 text-sm font-semibold">{category}<span className="text-[10px] font-medium text-ink-muted">KULLANILMIYOR</span></dt><dd className="mx-0 mt-3 mb-0 text-xs leading-[1.8] text-ink-muted">Bu kategoride bir hizmet bağlı değildir; isteğe bağlı çerez çalıştırılmaz.</dd></div>)}
          </dl>
          <Link href="/yasal/cerez-politikasi" className="inline-flex min-h-11 items-center text-xs text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ink">Çerez Politikası’nı incele</Link>
          {error && <p role="alert" className="text-xs leading-relaxed">{error}</p>}
          <div className="mt-5 flex flex-wrap gap-3 border-0 border-t border-solid border-line/30 pt-6"><button type="button" onClick={save} className={buttonClass}>Tercihimi kaydet</button><button type="button" onClick={() => dialog.current?.close()} className={buttonClass}>Kapat</button></div>
        </div>
      </dialog>
    </>
  );
}

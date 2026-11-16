'use client';

// This fallback replaces the root layout. Keep it independent of stylesheet and
// next/font imports so its unused CSS is not preloaded on healthy pages.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="tr">
      <head><title>Bir sorun oluştu | Uluk Mimarlık</title></head>
      <body style={{ margin: 0, background: '#f6f3e8', color: '#233d72', fontFamily: 'Arial, sans-serif' }}>
        <main style={{ minHeight: '100svh', display: 'grid', alignItems: 'center', padding: 'clamp(20px, 6vw, 80px)', boxSizing: 'border-box' }}>
          <section aria-labelledby="global-error-heading" style={{ maxWidth: 760, width: '100%', margin: '0 auto', boxSizing: 'border-box', border: '1px solid #7089ad', padding: 'clamp(24px, 5vw, 64px)' }}>
            <p style={{ margin: '0 0 32px', fontSize: 11, fontWeight: 700 }}>ULUK MİMARLIK / 500</p>
            <h1 id="global-error-heading" style={{ margin: '0 0 24px', fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1, letterSpacing: '-.04em' }}>Kaldığımız yerden devam edelim.</h1>
            <p style={{ margin: '0 0 32px', maxWidth: '46ch', fontSize: 16, lineHeight: 1.8, color: '#58749d' }}>Siteyi yüklerken beklenmedik bir sorun oluştu. Lütfen tekrar deneyin veya anasayfaya dönün.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
              <button type="button" onClick={retry} style={{ minHeight: 56, padding: '16px 24px', border: 0, background: '#233d72', color: '#f6f3e8', font: 'inherit', cursor: 'pointer' }}>Tekrar dene ↗</button>
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: '#233d72', textUnderlineOffset: 6 }}>Anasayfaya dön</a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}

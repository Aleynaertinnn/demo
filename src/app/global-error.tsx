'use client';

import localFont from 'next/font/local';
import ErrorScreen from '@/components/errors/ErrorScreen';
import './globals.css';

const body = localFont({ src: './fonts/DMSans-Variable.ttf', variable: '--font-body', display: 'swap' });
const logo = localFont({ src: './fonts/SpaceGrotesk-Variable.ttf', variable: '--font-logo', display: 'swap' });
const notes = localFont({ src: './fonts/ArchitectsDaughter-Regular.ttf', variable: '--font-notes', weight: '400', display: 'swap' });

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="tr" className={`${body.variable} ${logo.variable} ${notes.variable}`}>
      <head><title>Bir sorun oluştu | Uluk Mimarlık</title></head>
      <body>
        <ErrorScreen code="500" title="Kaldığımız yerden devam edelim." description="Siteyi yüklerken beklenmedik bir sorun oluştu. Lütfen tekrar deneyin veya anasayfaya dönün." retry={retry} />
      </body>
    </html>
  );
}

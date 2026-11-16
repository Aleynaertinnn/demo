'use client';

import ErrorScreen from '@/components/errors/ErrorScreen';

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return <ErrorScreen code="500" title="Çizgilere kısa bir ara." description="Sayfayı yüklerken beklenmedik bir sorun oluştu. Yeniden deneyebilir veya anasayfaya dönebilirsiniz." retry={retry} />;
}

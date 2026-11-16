import ErrorScreen from '@/components/errors/ErrorScreen';

export default function NotFound() {
  return <ErrorScreen code="404" title="Bu sayfa planda yok." description="Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Anasayfadan devam edebilir, projelerimize göz atabilirsiniz." />;
}

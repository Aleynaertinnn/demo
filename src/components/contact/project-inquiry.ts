export const projectTypes = ['Konut', 'Ticari mekân', 'Ofis', 'Diğer'] as const;
export const serviceTypes = ['Mimari tasarım', 'İç mekân tasarımı', 'Uygulama projesi', 'Henüz emin değilim'] as const;
export const steps = [
  { name: 'Fikriniz', title: 'Nasıl bir proje düşünüyorsunuz?', help: 'Size en yakın seçeneği işaretleyin.' },
  { name: 'İhtiyacınız', title: 'Size hangi konuda eşlik edelim?', help: 'Birden fazla seçenek işaretleyebilirsiniz.' },
  { name: 'Detaylar', title: 'Projenizden biraz bahsedin.', help: 'Bildiğiniz kadarı yeterli. Bu detayları daha sonra birlikte netleştirebiliriz.' },
  { name: 'Tanışalım', title: 'Size nasıl ulaşalım?', help: 'Projeniz üzerine konuşabilmek için iletişim bilgilerinizi bırakın.' },
];
export type Inquiry = {
  projectType: string; services: string[]; location: string; area: string;
  note: string; name: string; email: string; phone: string;
};
export type Errors = Partial<Record<keyof Inquiry, string>>;
export function validateInquiry(data: Inquiry, step: number): Errors {
  const errors: Errors = {};
  if (step === 0 && !projectTypes.some(type => type === data.projectType)) errors.projectType = 'Lütfen bir proje türü seçin.';
  if (step === 1 && !data.services.length) errors.services = 'Lütfen en az bir hizmet seçin.';
  if (step === 2) {
    if (data.area && (!Number.isFinite(Number(data.area)) || Number(data.area) <= 0)) errors.area = 'Lütfen sıfırdan büyük, geçerli bir alan girin.';
    if (data.note.length > 1500) errors.note = 'Proje notu en fazla 1500 karakter olabilir.';
  }
  if (step === 3) {
    if (!data.name.trim()) errors.name = 'Lütfen adınızı ve soyadınızı yazın.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Lütfen geçerli bir e-posta adresi yazın.';
  }
  return errors;
}
// Connect the real server integration here. Never report success without a server response.
export async function submitInquiry(_data: Inquiry): Promise<void> {
  throw new Error('Gönderim hizmeti henüz kullanıma açılmadı. Bilgileriniz gönderilmedi; lütfen daha sonra tekrar deneyin.');
}

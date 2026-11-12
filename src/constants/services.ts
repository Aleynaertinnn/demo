export const servicesIntro = {
  eyebrow: 'ULUK MİMARLIK / HİZMETLERİMİZ',
  title: ['Fikrinizden,', 'yaşadığınız mekâna.'],
  description:
    'İhtiyaçlarınızı dinliyor, mekânın potansiyelini birlikte keşfediyoruz. Mimari tasarımdan iç mekâna, malzeme seçiminden uygulama detaylarına kadar her adımı aynı özenle ele alıyor; estetiği, işlevi ve bütçenizi bir arada düşünüyoruz.',
  images: ['/images/bg-1.webp', '/images/bg-2.webp'],
} as const;

export const services = [
  { id: 'mimari', title: 'Mimari Tasarım', description: 'İhtiyaçtan yola çıkan, yerin karakterine ve yaşama uyum sağlayan yapılar tasarlıyoruz.' },
  { id: 'ic-mekan', title: 'İç Mekân Tasarımı', description: 'Malzeme, ışık ve işlevi birlikte düşünerek bütünlüklü mekânlar oluşturuyoruz.' },
  { id: 'konsept', title: 'Konsept Geliştirme', description: 'Projenin kimliğini belirleyen fikirleri kütle ve mekân çalışmalarıyla şekillendiriyoruz.' },
  { id: 'uygulama', title: 'Uygulama Projeleri', description: 'Tasarım kararlarını, yapım sürecine rehberlik eden teknik çizim ve detaylara dönüştürüyoruz.' },
  { id: 'gorsellestirme', title: '3D Görselleştirme', description: 'Mekânın malzemesini, ışığını ve atmosferini henüz uygulanmadan görünür kılıyoruz.' },
  { id: 'takip', title: 'Uygulama Takibi', description: 'Tasarımın sahaya doğru aktarılması için uygulama sürecini takip ediyoruz.' },
] as const;

export type Service = (typeof services)[number];

export type Project = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  sketch: string;
  color?: string;
  alt: string;
};

export const projects: readonly Project[] = [
  {
    id: 'a',
    slug: 'dusey-yasam',
    category: 'Düşey yaşam',
    title: 'Kentle yükselen çizgiler.',
    description: 'Ritim, oran ve ışığın cephede kurduğu dengeli bir mimari dil.',
    sketch: '/images/projects/dusey-yasam/drawing.png',
    color: '/images/projects/dusey-yasam/rendered.png',
    alt: 'Düşey cephe elemanları ve geniş giriş basamaklarıyla yüksek yapı',
  },
  {
    id: 'b',
    slug: 'ortak-mekan',
    category: 'Ortak mekân',
    title: 'Bir araya getiren mekânlar.',
    description: 'Şeffaf yüzeyler ve güçlü kütlelerle şekillenen bir buluşma alanı.',
    sketch: '/images/projects/ortak-mekan/drawing.png',
    alt: 'Geniş cam girişi ve terrakota cephe panelleriyle modern yapı',
  },
  {
    id: 'c',
    slug: 'avlulu-yasam',
    category: 'Avlulu yaşam',
    title: 'Yaşamın merkezinde bir avlu.',
    description: 'İç ve dış mekânın su, doğal malzeme ve gün ışığıyla buluşması.',
    sketch: '/images/projects/avlulu-yasam/drawing.png',
    color: '/images/projects/avlulu-yasam/rendered.png',
    alt: 'Havuzlu avlu etrafında düzenlenmiş iki katlı taş konut',
  },
  {
    id: 'd',
    slug: 'akdeniz-yasami',
    category: 'Akdeniz yaşamı',
    title: 'Yere ait, zamana açık.',
    description: 'Taşın dokusu, gölgeli teraslar ve doğayla iç içe bir yaşam fikri.',
    sketch: '/images/projects/akdeniz-yasami/drawing.png',
    color: '/images/projects/akdeniz-yasami/rendered.png',
    alt: 'Kemerli açıklıkları, ahşap kepenkleri ve yeşil teraslarıyla taş konut',
  },
];

export const projectsIntro = {
  eyebrow: 'SEÇİLİ PROJELER',
  title: 'Yaşama alan açan mekânlar.',
  titleLines: ['Yaşama alan açan', 'mekânlar.'],
  noteLines: ['İhtiyaçlarınıza göre tasarlanır.', 'Yaşamınıza uyum sağlar.'],
} as const;

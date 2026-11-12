export type Project = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  sketch: string;
  color: string;
  alt: string;
};

export const projects: readonly Project[] = [
  {
    id: 'a',
    slug: 'dusey-yasam',
    category: 'Düşey yaşam',
    title: 'Kentle yükselen çizgiler.',
    description: 'Ritim, oran ve ışığın cephede kurduğu dengeli bir mimari dil.',
    sketch: '/images/projects/proje-1.avif',
    color: '/images/projects/proje-a1.png',
    alt: 'Düşey cephe elemanları ve geniş giriş basamaklarıyla yüksek yapı',
  },
  {
    id: 'b',
    slug: 'ortak-mekan',
    category: 'Ortak mekân',
    title: 'Bir araya getiren mekânlar.',
    description: 'Şeffaf yüzeyler ve güçlü kütlelerle şekillenen bir buluşma alanı.',
    sketch: '/images/projects/proje-b1.png',
    color: '/images/projects/proje-b.png',
    alt: 'Geniş cam girişi ve terrakota cephe panelleriyle modern yapı',
  },
  {
    id: 'c',
    slug: 'avlulu-yasam',
    category: 'Avlulu yaşam',
    title: 'Yaşamın merkezinde bir avlu.',
    description: 'İç ve dış mekânın su, doğal malzeme ve gün ışığıyla buluşması.',
    sketch: '/images/projects/proje-c1.png',
    color: '/images/projects/proje-c.png',
    alt: 'Havuzlu avlu etrafında düzenlenmiş iki katlı taş konut',
  },
  {
    id: 'd',
    slug: 'akdeniz-yasami',
    category: 'Akdeniz yaşamı',
    title: 'Yere ait, zamana açık.',
    description: 'Taşın dokusu, gölgeli teraslar ve doğayla iç içe bir yaşam fikri.',
    sketch: '/images/projects/proje-d1.png',
    color: '/images/projects/proje-d.png',
    alt: 'Kemerli açıklıkları, ahşap kepenkleri ve yeşil teraslarıyla taş konut',
  },
];

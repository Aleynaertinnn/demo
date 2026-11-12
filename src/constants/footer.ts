export const footer = {
  brand: 'ULUK MİMARLIK',
  logo: '/images/uluk-mimarlik-u-logo.svg',
  description: 'İnsanı, yeri ve yaşamı birlikte düşünen mimarlık.',
  note: 'Her ölçekte, aynı özen.',
  navigationLabel: 'KEŞFEDİN',
  signature: 'FİKİR / MEKÂN / YAŞAM',
  socialLabel: 'ATÖLYEDEN / DİJİTALDE',
  credit: { label: 'Made by', name: 'Studio AE', href: 'https://studioae.com.tr' },
} as const;

export type FooterSocial = {
  platform: 'instagram' | 'youtube' | 'twitter' | 'linkedin';
  label: string;
  href: string | null;
};

export const footerSocials: readonly FooterSocial[] = [
  { platform: 'instagram', label: 'Instagram', href: null },
  { platform: 'youtube', label: 'YouTube', href: null },
  { platform: 'twitter', label: 'Twitter', href: null },
  { platform: 'linkedin', label: 'LinkedIn', href: null },
];

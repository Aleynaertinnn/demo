# Uluk Mimarlık

Next.js App Router, React Three Fiber, GSAP ve Tailwind CSS ile hazırlanan
mimarlık sitesi. Ana sayfada kaydırmayla ilerleyen 3D atölye, seçili projeler,
kurucu görüşü, yatay hizmet kartları ve iletişim daveti bulunur.

## Çalıştırma

Node.js 20.9 veya üzeri gerekir.

```sh
npm install
npm run dev
npm run build
npm run start
```

Geliştirme adresi: http://localhost:3000

## Klasör düzeni

```text
scripts/
  models/build-atelier-models.mjs   Node.js ile GLB üretimi
src/
  app/
    layout.jsx                     Fontlar, ortak header ve footer
    page.jsx                       Ana sayfa bölümlerinin birleşimi
    globals.css                    Tailwind, ortak renkler ve kâğıt dokusu
    fonts/                         Yerel fontlar ve lisansları
    projeler/
      page.tsx                     Proje listesi
      [slug]/page.tsx               Proje detayı
      _components/                 Projeler alanının ortak bileşenleri
        ProjectsGrid.tsx           Ana sayfa ve liste için ortak grid
        ProjectCard.tsx
        ProjectHero.tsx
        ProjectInfo.tsx
        ProjectGallery.tsx
  components/
    home/
      projects/                    Ana sayfa vitrini ve giriş animasyonu
      founder/                     Kurucu görünümü, pin durumu ve animasyonu
      services/                    Hizmet paftaları ve yatay GSAP akışı
      contact-cta/                 İletişim daveti ve görsel geçişi
    layout/
      header/                      Header ve yalnız ona ait scroll hook'u
      footer/                      Footer ve sosyal medya hücreleri
      SmoothScroll.tsx             Site genelindeki Lenis kaydırması
    ui/                            Ortak Icon, CtaButton ve VisitButton
  constants/                       Projeler, metinler, menü ve görsel yolları
  features/atelier/
    AtelierExperience.jsx          3D deneyimin giriş noktası
    components/                    HeroIntro ve PresentationCaption
    scene/                         Three.js sahnesi ve sahne bileşenleri
    animation/                     Kamera, kaydırma ve açıklama animasyonları
    geometry/                      Prosedürel bina ve iç mekân geometrisi
    materials/                     Ortak illüstrasyon malzemeleri
    config/                        Ölçüler, plan, akış ve model yolları
    atelier.css                    3D deneyimin yerleşim stilleri
public/
  images/
    brand/                         Logo
    founder/                       Ali Uluk portresi
    services/                      Hizmet arka plan görselleri
    contact-cta/                   Çizim ve renklendirilmiş görsel
    projects/<slug>/               Proje çizimi ve varsa renkli görseli
  models/                          Üretilen GLB dosyaları
design-references/                Canlı sitede kullanılmayan görsel alternatifleri
```

`app` sayfaları bölümleri birleştirir. Ana sayfa proje vitrini ve `/projeler`,
`app/projeler/_components/ProjectsGrid.tsx` kullanır; proje listesi ana sayfa
bileşenlerine bağımlı değildir. `_components` bir URL oluşturmaz.
Bölüme özel hook ve durum dosyaları ilgili bölüm klasöründe kalır.

## İçerik ve görseller

- Proje verileri ve ana sayfa proje metinleri: `src/constants/projects.ts`
- Kurucu ve pin metinleri: `src/constants/founder.ts`
- Hizmetler: `src/constants/services.ts`
- İletişim daveti: `src/constants/contact-cta.ts`
- Ortak header/footer menüsü: `src/constants/navigation.ts`
- Footer, sosyal medya ve Studio AE bağlantısı: `src/constants/footer.ts`

Proje görselleri `public/images/projects/<slug>/drawing.png` ve
`rendered.png` olarak tutulur. `color` alanı isteğe bağlıdır: renkli görsel
bulunmuyorsa kart çizimi gösterir, renk geçişi etkinleşmez ve detay galerisi
var olmayan dosyayı istemez. `ortak-mekan` projesinin renkli görseli henüz yoktur.

Eski görsel alternatifleri `design-references/` altında saklanır. Bu klasör
`public` dışında olduğu için uygulama tarafından sunulmaz.

`/ofis` ve `/iletisim` bağlantıları planlanan sayfalardır; henüz sayfaları yoktur.
Sosyal medya hesap adresleri istek doğrultusunda `null` tutulur; adres eklenene
kadar hücreler bağlantı olarak davranmaz.

## Animasyonlar

- Atölyede sahne ve metinler aynı kaydırma ilerlemesini kullanır.
- Ana sayfa proje metinleri ve kartları GSAP ile bir kez görünür.
- Kurucu metinleri kelime kelime yükselip netleşir. `FounderPinContext.tsx`
  pin durumunu, `useFounderAnimation.ts` animasyonları yönetir. Kullanıcı bir
  pine geçtiğinde otomatik pin tanıtımı durur.
- Üst/alt süsler ve fotoğraf köşeleri kendi konumlarında bağımsız tetiklenir.
- İlk hizmet kartı sağ alttan girer; devamında kartlar yatay ilerler.
- CTA çizimi yukarıdan aşağıya yumuşak bir maske ile renklenir.

Hareket azaltma tercihinde GSAP girişleri çalışmaz; metinler ve görseller
okunabilir kalır, hizmetler doğal yatay kaydırmayla erişilir. Atölye ilk
kompozisyonda kalır; bölüm metinleri normal sayfa akışında gösterilir.

## Atölye yapılandırması

- Kamera: `src/features/atelier/animation/camera-poses.mjs`
- Kaydırma: `src/features/atelier/animation/use-scroll-journey.js`
- Metin zamanlaması: `src/features/atelier/animation/caption-timelines.js`
- Bölüm metinleri: `src/features/atelier/config/presentation.mjs`
- Bölüm sınırları: `src/features/atelier/config/journey.mjs`
- Oda ölçüleri: `src/features/atelier/config/layout.mjs`
- Plan: `src/features/atelier/config/project-plan.mjs`
- Model yolları: `src/features/atelier/config/assets.mjs`

Sahneye ait teknik yapılandırma özelliğin içinde kalır. Model üretici de
aynı ölçü ve model yolu dosyalarını kullanır.

## Model üretimi

```sh
npm run models
npm run models -- desk
npm run models -- sofa small-bookcase
```

Betik `scripts/models/build-atelier-models.mjs` konumundadır. Çıktılar çalışma
dizininden bağımsız olarak deponun `public/models/` klasörüne yazılır.
Bina ve iç mekân geometrisi plan verisinden canlı üretilir.
Saklanan figür modeli dahil ayrıntılar: [public/models/README.md](public/models/README.md).

## Tasarım sistemi

Yeni arayüzler Tailwind ile yazılır. Ortak renklerin kaynağı
`src/app/globals.css` içindeki `@theme` bloğudur:

| Token | Kullanım |
| --- | --- |
| `paper`, `surface` | Krem kâğıt ve açık yüzeyler |
| `ink`, `ink-muted` | Mürekkep mavisi ve ikincil metin |
| `brand`, `brand-strong` | Ana mavi ve vurgu |
| `on-brand` | Koyu zemindeki açık metin |
| `line`, `line-strong` | Çerçeve ve kılavuz çizgileri |

3D sahnenin malzeme renkleri kendi özellik dosyalarında kalır.
Tailwind Preflight sıfırlaması yüklenmez.

Fontlar `src/app/fonts/` altında lisanslarıyla saklanır ve `next/font/local`
ile sunulur: Montserrat başlıklarda, Space Grotesk logoda, DM Sans gövde
metninde, Architects Daughter notlarda kullanılır.

Iconify ikonları yerel `@iconify-icons/lucide` paketinden alınır ve
`src/components/ui/Icon.tsx` üzerinden gösterilir. Dış ikon API'si kullanılmaz.
Dekoratif ikonlar ekran okuyucudan gizlenir; yalnız ikonlu düğmelerin açıklayıcı
bir erişilebilir adı olmalıdır.

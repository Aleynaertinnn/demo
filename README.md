# Kâğıt Atölyesi

Next.js ve React Three Fiber ile hazırlanan, kaydırmayla ilerleyen mimarlık atölyesi.
Eskizden makete, iç mekândan gece cephesine ve yeni bir çizgiye uzanan sekiz sahne içerir.

## Çalıştırma

Node.js 20.9 veya üzeri gerekir.

```sh
npm install
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

```sh
npm run build    # Üretim derlemesi
npm run start    # Derlenen siteyi çalıştırır
```

## Dosya düzeni

```text
app/                         Next.js sayfası, kök layout ve genel stiller
components/                  Site genelinde kullanılabilen Header gibi bileşenler
features/atelier/
  AtelierExperience.jsx      Deneyimin istemci giriş noktası
  atelier.css                Atölyeye ait arayüz stilleri
  components/                Başlık, bölüm açıklamaları ve final yazısı
  scene/                     Canlı Three.js sahnesi ve sahne bileşenleri
  materials/                 Ortak illüstrasyon malzemeleri ve gece paleti
  geometry/                  Maket ve iç mekânın prosedürel geometrisi
  animation/                 Kamera rotası, kaydırma ve gün/gece geçişleri
  config/                    Ölçüler, kat planı, tasarımlar ve model yolları
public/models/
  furniture/                 Masa, sandalye, dolap, kanepe ve masa aksesuarları
  architecture/              Kapı ve atölye penceresi
  characters/                Sahnede kullanılmayan, saklanan figür modeli
scripts/models/              GLB modellerini üreten kaynak kod
```

`app/page.jsx` yalnızca atölye deneyimini çağırır. Bütün 3D içerik aynı Canvas içinde
kalır; animasyonlar sayfanın kaydırma ilerlemesinden hesaplanır. Yukarı kaydırma
sahneleri geri alır. **Başa dön** akışı sıfırlar. İşletim sisteminde hareket azaltma
tercihi açıksa doğrudan final gösterilir.

## Nerede değişiklik yapılır?

- Kamera kadrajı ve rotası: `features/atelier/animation/camera-poses.mjs`
- Bölüm süreleri ve etiketleri: `features/atelier/config/journey.mjs`
- Kaydırma ve yeniden başlatma: `features/atelier/animation/use-scroll-journey.js`
- Odanın duvarları: `features/atelier/scene/Room.jsx`
- Mobilyaların yerleşimi: `features/atelier/scene/Furniture.jsx`
- Masa ve oda ölçüleri: `features/atelier/config/layout.mjs`
- Plan ve maket geometrisi: `features/atelier/config/project-plan.mjs`, `features/atelier/geometry/`
- Model dosyalarının adresleri: `features/atelier/config/assets.mjs`

GLB dosyaları `public/models` altında sunulur. Maket ve iç mekân ise plan verisinden
canlı olarak üretilir; ayrı bir bina GLB dosyasına bağlı değildir.

## Model üretimi

```sh
npm run models              # Bütün modelleri yeniden üretir
npm run models -- desk      # Yalnızca masayı yeniden üretir
npm run models -- sofa small-bookcase
```

Üretici ve web sahnesi aynı ölçü ve model yolu yapılandırmasını kullanır.
Modellerin ayrıntıları için [model açıklamalarına](public/models/README.md) bakın.

## Tipografi

Fontlar `app/fonts/` altında lisanslarıyla birlikte saklanır; `next/font/local`
ile sunulur. `app/layout.jsx` içindeki CSS değişkenleri:

- `--font-heading`: Space Grotesk — ana ve bölüm başlıkları.
- `--font-body`: DM Sans — menü, paragraflar ve proje bilgileri.
- `--font-notes`: Architects Daughter — başlık üstü açıklamalar ve eskiz notları.

3D paftalardaki yazı dokuları da not fontunun yüklenmesini izler.

## Tailwind ve ikonlar

Tailwind CSS 4, `postcss.config.mjs` ve `src/app/globals.css` üzerinden bağlıdır.
Mevcut 3D sahne görünümünü korumak için tema ve utility katmanları yüklenir;
Preflight sıfırlaması uygulanmaz. Yeni arayüzlerde Tailwind sınıfları kullanılabilir.
`font-sans`, `font-display`, `font-handwritten` mevcut üç fontu;
`text-ink`, `bg-paper`, `text-brand` ortak renkleri kullanır.

Iconify için ortak bileşen `src/components/ui/Icon.tsx` dosyasıdır.
İkon verileri yerel paketten tek tek içe aktarılır; dış API isteği gerekmez:

```tsx
import arrowUpRight from '@iconify-icons/lucide/arrow-up-right'
import Icon from '@/components/ui/Icon'

<Icon icon={arrowUpRight} className="text-brand" width={20} height={20} />
```

İkonlar varsayılan olarak dekoratiftir; yalnız ikon içeren düğmelere açıklayıcı
bir `aria-label` verin.

## Renk teması

Ortak renklerin tek kaynağı `src/app/globals.css` içindeki `@theme` bloğudur.
Arayüz bileşenlerinde doğrudan hex kodu yerine tema sınıflarını kullanın:

| Renk | Kod | Kullanım |
| --- | --- | --- |
| Kâğıt kremi | `#f6f3e8` | `bg-paper` / `bg-background` |
| Açık yüzey | `#fbf9ef` | `bg-surface` / `bg-card` |
| Koyu mavi mürekkep | `#233d72` | `text-ink` / `text-foreground` |
| Ana mavi | `#2452c7` | `text-brand` / `bg-primary` |
| Koyu vurgu | `#2451bb` | `bg-brand-strong` |
| Soluk mavi metin | `#58749d` | `text-ink-muted` |
| Kenar çizgisi | `#7089ad` | `border-line/27` |

`text-on-brand` koyu mavi zemin üzerindeki açık yazılar içindir.
3D malzemelerin ve iç mekân tasarımlarının kendi renkleri sahne dosyalarında kalır.

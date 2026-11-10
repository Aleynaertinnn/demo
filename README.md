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

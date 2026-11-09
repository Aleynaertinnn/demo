# Kâğıt Atölyesi

Illoca’dan esinlenen bir Next.js hero denemesi. Masa, maket ve lamba Three.js geometrileriyle oluşturulur.

Node.js 20.9 veya üzeriyle proje dizininde çalıştır.

```bash
npm install
npm run dev
```

Tarayıcıda http://localhost:3000 adresini aç. “Tekrar oynat” düğmesi açılışı baştan oynatır.

- `app/hero.jsx` içindeki `Desk` sahnesi, kameranın konumunu her karede günceller.
- `Hero` içindeki GSAP timeline'ı kameranın ilerleme değerini, sahnenin CSS maskesini ve başlığı birlikte animasyonlu gösterir.
- `app/style.css` kâğıt ızgarasını ve sayfa düzenini tanımlar.

## Masayı keşfet

Plan, Maket veya Malzemeler düğmesini seç. Kamera ilgili bölgeye yaklaşır ve bilgi paneli sahnenin altında açılır. Malzemeler panelindeki seçenekler maketin cephe rengini değiştirir. Genel görünüm düğmesi kamerayı geri getirir.

`stops` dizisi kamera konumlarını ve içerikleri bir arada tutar. `Desk`, işaretlerin 3D konumlarını her karede ekran koordinatlarına çevirir. `Hero`, aktif durak ve cephe seçimini React state ile yönetir.

## Eskizden Makete

Sahnenin altındaki sürgü, kamera açısını ve üç katın yükselmesini birlikte kontrol eder. Plan ve Maket düğmeleri sürgünün iki ucuna götürür. Tamamlanan maketin panelinden cephe seçimine geçebilirsin.

## Çizim masası

Genel görünümde iki mimarı ve plan, eskiz ile cephe çizimlerini görebilirsin. İlk mimarın kalemi ilerlerken plan çizgileri belirir. Diğer mimar cephe paftası üzerinde çalışır. Karakterler ve kâğıtlar `app/architects.jsx` içinde Three.js geometrileriyle oluşturulur.

Açılıştaki kırmızı atölye illüstrasyonu `public/atolye-kirmizi.webp` dosyasında. **3D masayı keşfet** düğmesi canlı sahneyi gösterir. Plan, Maket, Malzemeler ve sürgü de doğrudan canlı sahneye geçer.

Açılış animasyonunda GSAP illüstrasyonu hafifçe yakınlaştırır. İllüstrasyonla aynı kadrajdaki SVG katmanı, kalemi plan çizgisi boyunca hareket ettirir. **Tekrar oynat** animasyonu baştan başlatır.

# Atölye mobilyaları

Özgün, prosedürel model seti: `desk.glb`, `chair.glb`, `lamp.glb`.

Kaynak: `scripts/build-atelier-models.mjs`. Yeniden üretmek için proje kökünde:

```sh
node scripts/build-atelier-models.mjs
```

Blender veya başka bir paket gerektirmez; projedeki Three.js sürümünü kullanır.
GLB dosyaları Blender'da **File → Import → glTF 2.0** ile açılabilir.
Parçalar adlandırılmıştır; geometri ve malzemeler dosyanın içindedir.

Y ekseni yukarıdır. Masa tablasının merkezi yerel başlangıç noktasıdır;
sandalye zemine oturur ve +Z yönüne bakar; lamba tabanı Y=0 üzerindedir.
Sahnede malzemeler ortak illüstratif palete dönüştürülür.
Bina maketi ve kaydırma animasyonu ayrı, mevcut plan geometrisini kullanır.

Masanın ölçüleri `app/atelier-layout.mjs` içindeki `deskLayout` verisinden GLB'ye işlenir.
Sahnede masa birim ölçekte kullanılır; ayak ve bağlantı çapları tabla ile esnetilmez.
Yalnızca masayı yeniden üretmek için `node scripts/build-atelier-models.mjs desk` çalıştırın.

`cabinet.glb`: 3.78 × 5.46 × 0.68 birimlik, zeminden tavana uzanan atölye kitaplığı.
Alt kapaklar, girintili kulplar, asimetrik raflar, arşiv kutuları ve seramik teşhir nişi içerir.
Yalnız bu modeli üretmek için: `node scripts/build-atelier-models.mjs cabinet`.
Kitaplar malzemeye göre birleştirilmiştir; gövde panelleri Blender'da ayrı adlarla düzenlenebilir.

`plant.glb`: Ficus elastica esintili ofis bitkisi; içi boş seramik saksı, toprak,
iki odunsu gövde, 17 farklı yönde kıvrımlı yaprak, saplar ve yüzeyi takip eden damarlar.
Üretim: `node scripts/build-atelier-models.mjs plant`. Yapraklar çift taraflıdır;
ikincil damarlar çizim çağrılarını azaltmak için birleştirilmiştir.

`window.glb`: 13 metre/birim boyunca, oda zemini ile tavanı arasında uzanan beş açıklıklı cam cephe.
Yuvarlatılmış alüminyum profiller, iç kapaklar, contalar, ara çıtalar, denizlik ve
kalınlığı olan saydam cam paneller içerir. Cam ve metal fiziksel malzemelerini korur;
sahnede hafif ortam yansımaları uygulanır, camlar gün ışığı gölgelerini kapatmaz.
Yerel Y=0 zemindir, Z cephe boyunca uzanır; X profil derinliğidir.
Üretim: `node scripts/build-atelier-models.mjs window`.

`pencil-holder.glb`: İçi boş, ince yivli seramik kalemlik; dört sivriltilmiş altıgen
kalem, iki halkalı makas ve sürgülü falçata içerir. Krem, açık gri ve soluk mavi
malzemeler GLB içinde kayıtlıdır. Yerel Y=0 masa yüzeyidir.
Üretim: `node scripts/build-atelier-models.mjs pencil-holder`.

`sofa.glb`: Üç kişilik ofis kanepesi; krem deri minderler, üç ayrı sırt yastığı,
ince mavi metal ayaklar, döşeme biyeleri ve deri kaplı düğmeler içerir.
Yerel Y=0 zemindir; ön yüz +Z yönüne bakar. Başlangıç kamerasının arkasında kalan duvar boyunca, odaya bakacak şekilde konumlandırılmıştır.
Üretim: `node scripts/build-atelier-models.mjs sofa`.

`small-bookcase.glb`: Üç açık raflı küçük kitaplık; krem gövde, açık mavi arka panel,
farklı boyutlarda kitaplar ve yatay dergi yığını içerir. Koltuğun yanında, kameranın
arkasında kalan duvar boyunca yerleştirilmiştir. Y=0 zemin, ön yüz +Z yönüdür.
Üretim: `node scripts/build-atelier-models.mjs small-bookcase`.

`door.glb`: Krem panelli ofis kapısı; mavi kasa, pervaz, menteşeler, metal kol,
anahtar deliği ve eşik içerir. İlk kadrajın sağ duvarında, kameraya yakın köşededir.
Duvar açıklığı 1.65 × 3.15 birimdir. Y=0 zemin, iç yüz +Z yönüdür.
Üretim: `node scripts/build-atelier-models.mjs door`.

`architect.glb`: Sandalyede çizim yapan, kısa saçlı ve gözlüklü stilize erkek mimar figürü.
Portre referansından esinlenen çok kısa saç, kısa sakal, belirgin çene ve ceket
detayları krem ve gri-mavi illüstrasyon paletine uyarlanmıştır.
Gömlek, pantolon, ayakkabılar, doğal saç silüeti, Wayfarer esintili gözlük,
parmaklar ve eldeki kalem ayrı adlarla düzenlenebilir.
Poz `chair.glb` ile aynı başlangıç noktasını kullanır; +Z yönüne bakar, Y=0 zemindir.
Krem ve gri-mavi malzemeler içerir. Daha geniş omuzlar, uzun gövde ve büyük baş
masa ölçeğine göre düzenlenmiştir; el ve ayak temasları korunur.
Baş ve omuz grupları sahnede kaydırmaya bağlı olarak maketi izler ve kalemle işaret eder.
İskelet animasyonu içermez; hareketler adlandırılmış grup pivotlarını kullanır.
Üretim: `node scripts/build-atelier-models.mjs architect`.

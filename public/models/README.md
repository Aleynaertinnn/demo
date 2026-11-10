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

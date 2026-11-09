# Kâğıt Atölyesi

Next.js, React Three Fiber ve GSAP ile hazırlanan etkileşimli mimarlık atölyesi.

Node.js 20.9 veya üzeriyle proje dizininde çalıştır.

```bash
npm install
npm run dev
```

Tarayıcıda http://localhost:3000 adresini aç. Aşağı kaydırdıkça kamera gün batımındaki atölyenin içinden çizim masasına yaklaşır. **Başa dön** yolculuğu sıfırlar. Hareket azaltma tercihi açıksa sahne doğrudan masa kadrajına geçer.

Masanın altındaki Plan, Maket ve Malzemeler kontrolleri mevcut model denemesini açar. `app/hero.jsx` oda ve kamera rotasını, `app/drafting-sheets.jsx` masadaki paftaları içerir.

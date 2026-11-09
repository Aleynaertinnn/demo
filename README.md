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

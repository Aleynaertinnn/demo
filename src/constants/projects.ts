export type Project = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  sketch: string;
  color?: string;
  alt: string;
  isSample?: boolean;
  location?: string;
  year?: string;
  projectType?: string;
  area?: string;
  status?: string;
  designIdea?: string;
  designNote?: string;
  designTopics?: readonly { title: string; text: string }[];
  gallery?: readonly { src: string; alt: string; caption?: string }[];
};

export const projects: readonly Project[] = [
  {
    id: 'a',
    gallery: [
      {
            "src": "/images/projects/dusey-yasam/rendered.png",
            "alt": "Düşey yaşam — renkli mimari görünüm",
            "caption": "Düşey yaşam — renkli mimari görünüm"
      },
      {
            "src": "/images/projects/avlulu-yasam/drawing.png",
            "alt": "Avlulu yaşam — mimari eskiz",
            "caption": "Avlulu yaşam — mimari eskiz"
      },
      {
            "src": "/images/projects/akdeniz-yasami/rendered.png",
            "alt": "Akdeniz yaşamı — renkli mimari görünüm",
            "caption": "Akdeniz yaşamı — renkli mimari görünüm"
      }
],
    isSample: true,
    location: "İstanbul / Kadıköy",
    year: "2025",
    projectType: "Konut",
    area: "4.800 m²",
    status: "Konsept proje",
    designIdea: "Yüksek bir yapının kentle ilişkisi yalnızca siluetinde değil, zemine nasıl dokunduğunda da kurulur. Düşey Yaşam, cephedeki tekrarın düzenini geniş bir giriş eşiğiyle bir araya getiriyor. Düşey elemanlar kütleyi daha ince parçalara ayırırken, açıklıklarla dolu yüzeyler arasındaki oran yapının bütününü tanımlıyor.",
    designNote: "Yükselirken zeminle bağını korumak.",
    designTopics: [
      {
            "title": "Kentle kurulan eşik",
            "text": "Geniş basamaklar, yaklaşma güzergâhını belirginleştiren bir ön alan oluşturuyor. Yapının yükselen ölçeği, girişte yatay bir hareketle dengeleniyor. Böylece cephe, uzaktan okunan bir yüzey olmanın yanında yakından deneyimlenen bir sınıra dönüşüyor."
      },
      {
            "title": "Cephede ritim ve derinlik",
            "text": "Düşey elemanların tekrarı, cepheyi tek bir büyük yüzey yerine katmanlar halinde okumaya imkân veriyor. Cam açıklıkların bu ritim içindeki konumu, doluluk ve boşluk arasındaki dengeyi kuruyor."
      },
      {
            "title": "Işıkla değişen yüzey",
            "text": "Öne çıkan cephe elemanları ile geride kalan açıklıklar arasındaki derinlik, gölgeyi tasarımın bir parçası haline getiriyor. Gün ışığının farklı açılarında bu katmanlar görünür oluyor; yapının çizgisel karakteri güçleniyor."
      }
],
    slug: 'dusey-yasam',
    category: 'Düşey yaşam',
    title: 'Kentle yükselen çizgiler.',
    description: 'Ritim, oran ve ışığın cephede kurduğu dengeli bir mimari dil.',
    sketch: '/images/projects/dusey-yasam/drawing.png',
    color: '/images/projects/dusey-yasam/rendered.png',
    alt: 'Düşey cephe elemanları ve geniş giriş basamaklarıyla yüksek yapı',
  },
  {
    id: 'b',
    gallery: [
      {
            "src": "/images/projects/ortak-mekan/drawing.png",
            "alt": "Ortak mekân — mimari eskiz",
            "caption": "Ortak mekân — mimari eskiz"
      },
      {
            "src": "/images/projects/dusey-yasam/rendered.png",
            "alt": "Düşey yaşam — renkli mimari görünüm",
            "caption": "Düşey yaşam — renkli mimari görünüm"
      },
      {
            "src": "/images/projects/avlulu-yasam/rendered.png",
            "alt": "Avlulu yaşam — renkli mimari görünüm",
            "caption": "Avlulu yaşam — renkli mimari görünüm"
      }
],
    isSample: true,
    location: "İzmir / Bornova",
    year: "2024",
    projectType: "Sosyal ve kültürel yapı",
    area: "1.250 m²",
    status: "Konsept proje",
    designIdea: "Ortak Mekân, bir araya gelme fikrini girişin açıklığı ve kütlelerin okunaklı ilişkisi üzerinden ele alıyor. Geniş cam yüzey, iç mekân ile yaklaşma alanı arasında görsel bir bağ kurarken, terrakota tonlu paneller bu açıklığı daha belirgin bir çerçeve içine alıyor. Projenin ana fikri, davetkâr bir eşik ile güçlü bir mimari kimliği aynı kompozisyonda buluşturmak.",
    designNote: "Bir araya gelmeye alan açmak.",
    designTopics: [
      {
            "title": "Buluşmayı tarifleyen giriş",
            "text": "Girişin geniş ve şeffaf tutulması, yapının odak noktasını görünür kılıyor. Kapalı yüzeyler ile cam açıklık arasındaki karşıtlık, yaklaşma yönünü ve girişin yerini mimari elemanlarla tarifliyor."
      },
      {
            "title": "Kütleler arasında denge",
            "text": "Farklı yüzeylerin yan yana gelişi, yapının hacmini parçalara ayırarak okunmasını sağlıyor. Girişteki açıklık, daha ağır algılanan kapalı kütlelerle dengeleniyor."
      },
      {
            "title": "Malzemenin sıcaklığı",
            "text": "Terrakota tonlu cephe panelleri ile cam yüzeylerin birlikteliği, sıcaklık ve hafiflik arasında bir ilişki kuruyor. Panel düzeni, cepheye insan ölçeğinde bir ritim kazandırıyor."
      }
],
    slug: 'ortak-mekan',
    category: 'Ortak mekân',
    title: 'Bir araya getiren mekânlar.',
    description: 'Şeffaf yüzeyler ve güçlü kütlelerle şekillenen bir buluşma alanı.',
    sketch: '/images/projects/ortak-mekan/drawing.png',
    alt: 'Geniş cam girişi ve terrakota cephe panelleriyle modern yapı',
  },
  {
    id: 'c',
    gallery: [
      {
            "src": "/images/projects/avlulu-yasam/rendered.png",
            "alt": "Avlulu yaşam — renkli mimari görünüm",
            "caption": "Avlulu yaşam — renkli mimari görünüm"
      },
      {
            "src": "/images/projects/akdeniz-yasami/drawing.png",
            "alt": "Akdeniz yaşamı — mimari eskiz",
            "caption": "Akdeniz yaşamı — mimari eskiz"
      },
      {
            "src": "/images/projects/ortak-mekan/drawing.png",
            "alt": "Ortak mekân — mimari eskiz",
            "caption": "Ortak mekân — mimari eskiz"
      }
],
    isSample: true,
    location: "Muğla / Bodrum",
    year: "2025",
    projectType: "Müstakil konut",
    area: "420 m²",
    status: "Konsept proje",
    designIdea: "Avlulu Yaşam, konutu yalnızca kapalı odalardan oluşan bir bütün olarak değil, açık ve yarı açık alanlarla birlikte düşünüyor. İki katlı taş kütlelerin çevrelediği havuzlu avlu, projenin görsel ve mekânsal odağını oluşturuyor. Su yüzeyi, açıklıklar ve taş dokusu aynı merkez etrafında bir araya gelerek iç ve dış mekân arasında süreklilik kuruyor.",
    designNote: "Evin kalbinde gökyüzüne bir açıklık.",
    designTopics: [
      {
            "title": "Avlu etrafında yaşam",
            "text": "Kütlelerin avluya yönelmesi, açık alanı yapının dışında kalan bir boşluk olmaktan çıkarıyor. Avlu, farklı cephelerin birbirleriyle ilişki kurduğu ve konutun bütününün algılandığı ortak bir merkez haline geliyor."
      },
      {
            "title": "İçerisi ile dışarısı arasında",
            "text": "Avluya açılan yüzeyler, kapalı alanlarla açık mekân arasındaki sınırı yumuşatıyor. Yapının iki katlı ölçeği ve avlunun açıklığı birlikte, çevrelenme hissini gökyüzüyle temas halinde tutuyor."
      },
      {
            "title": "Taş, su ve gün ışığı",
            "text": "Taşın belirgin dokusu ile suyun yansıtıcı yüzeyi farklı duyusal nitelikleri bir araya getiriyor. Doluluk, açıklık ve yansıma arasındaki ilişki, avlu kompozisyonuna derinlik katıyor."
      }
],
    slug: 'avlulu-yasam',
    category: 'Avlulu yaşam',
    title: 'Yaşamın merkezinde bir avlu.',
    description: 'İç ve dış mekânın su, doğal malzeme ve gün ışığıyla buluşması.',
    sketch: '/images/projects/avlulu-yasam/drawing.png',
    color: '/images/projects/avlulu-yasam/rendered.png',
    alt: 'Havuzlu avlu etrafında düzenlenmiş iki katlı taş konut',
  },
  {
    id: 'd',
    gallery: [
      {
            "src": "/images/projects/akdeniz-yasami/rendered.png",
            "alt": "Akdeniz yaşamı — renkli mimari görünüm",
            "caption": "Akdeniz yaşamı — renkli mimari görünüm"
      },
      {
            "src": "/images/projects/avlulu-yasam/rendered.png",
            "alt": "Avlulu yaşam — renkli mimari görünüm",
            "caption": "Avlulu yaşam — renkli mimari görünüm"
      },
      {
            "src": "/images/projects/dusey-yasam/drawing.png",
            "alt": "Düşey yaşam — mimari eskiz",
            "caption": "Düşey yaşam — mimari eskiz"
      }
],
    isSample: true,
    location: "Antalya / Kaş",
    year: "2026",
    projectType: "Müstakil konut",
    area: "360 m²",
    status: "Konsept proje",
    designIdea: "Akdeniz Yaşamı, taş yüzeyleri, kemerli açıklıkları ve ahşap kepenkleri açık havayla kurulan bir yaşam fikri etrafında bir araya getiriyor. Yeşil teraslar ve gölgeli alanlar, yapının kütlesine eşlik eden yaşanabilir eşikler olarak ele alınıyor. Projenin karakteri, malzemeyi öne çıkaran yalın bir kompozisyon ile açıklıkların ritminden doğuyor.",
    designNote: "Gölgeye, dokuya ve açık havaya yer açmak.",
    designTopics: [
      {
            "title": "Açık havaya uzanan yaşam",
            "text": "Terasların kütleyle birlikte okunması, dış mekânı konutun bir devamı haline getiriyor. Yeşil dokunun teraslara eşlik etmesi, sert yüzeyler ile bitkisel katman arasında dengeli bir geçiş oluşturuyor."
      },
      {
            "title": "Açıklıkların mimari dili",
            "text": "Kemerli açıklıklar cephede tekrarlanan bir geometri kurarken, ahşap kepenkler bu düzene daha küçük ölçekli bir katman ekliyor. Derinlikli açıklıklar ve gölgeli eşikler, cepheyi yalnızca yüzey olarak değil, hacim olarak da tanımlıyor."
      },
      {
            "title": "Malzeme ve peyzaj birlikteliği",
            "text": "Taşın dokusu, ahşabın sıcaklığı ve bitkilerin yumuşak çizgileri aynı paletin parçalarını oluşturuyor. Malzemelerin birlikte kullanımı, yapının doğayla kurduğu ilişkinin görsel temelini belirliyor."
      }
],
    slug: 'akdeniz-yasami',
    category: 'Akdeniz yaşamı',
    title: 'Yere ait, zamana açık.',
    description: 'Taşın dokusu, gölgeli teraslar ve doğayla iç içe bir yaşam fikri.',
    sketch: '/images/projects/akdeniz-yasami/drawing.png',
    color: '/images/projects/akdeniz-yasami/rendered.png',
    alt: 'Kemerli açıklıkları, ahşap kepenkleri ve yeşil teraslarıyla taş konut',
  },
];

export const projectsIntro = {
  eyebrow: 'SEÇİLİ PROJELER',
  title: 'Yaşama alan açan mekânlar.',
  titleLines: ['Yaşama alan açan', 'mekânlar.'],
  noteLines: ['İhtiyaçlarınıza göre tasarlanır.', 'Yaşamınıza uyum sağlar.'],
} as const;

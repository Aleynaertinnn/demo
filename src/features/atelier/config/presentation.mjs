import { exteriorStart, interiorStart, lifeStart, modelStart } from './journey.mjs';

export const presentationSteps = [
  {
    label: '01 / FİKRİNİZLE BAŞLAR',
    title: 'Her mekân bir fikirle başlar.',
    titleLines: ['Her mekân', 'bir fikirle', 'başlar.'],
    description:
      'Sizi, ihtiyaçlarınızı ve hayallerinizi dinler, projenizin ilk çizgilerini birlikte oluştururuz.',
    start: 0,
    end: modelStart,
    weight: 1.5,
  },
  {
    label: '02 / FİKİR ŞEKİLLENİR',
    title: 'Fikriniz boyut kazanır.',
    titleLines: ['Fikriniz', 'boyut kazanır.'],
    description:
      'Tasarımı üç boyutta ele alır, mekânın biçimini, oranlarını ve çevresiyle ilişkisini geliştiririz.',
    start: modelStart,
    end: interiorStart,
  },
  {
    label: '03 / SİZE GÖRE TASARLANIR',
    title: 'Yaşamınıza yer açarız.',
    titleLines: ['Yaşamınıza', 'yer açarız.'],
    description:
      'Yerleşimden malzemelere kadar farklı seçenekleri birlikte değerlendirir, günlük yaşamınıza uyum sağlayan mekânlar tasarlarız.',
    start: interiorStart,
    end: lifeStart,
  },
  {
    label: '04 / YAŞAM CANLANIR',
    title: 'İlk adımı, yapılmadan atın.',
    titleLines: ['İlk adımı,', 'yapılmadan', 'atın.'],
    description:
      'Mekânı günün farklı saatlerinde keşfedin, ışığın ve malzemelerin oluşturduğu atmosferi henüz yapılmadan deneyimleyin.',
    start: lifeStart,
    end: exteriorStart,
  },
  {
    label: '05 / TASARIM BÜTÜNLENİR',
    title: 'Her detay yerini bulur.',
    titleLines: ['Her detay', 'yerini bulur.'],
    description:
      'İç mekândan cepheye, tüm tasarım kararlarını bir araya getirir, projenizi bir bütün olarak ortaya koyarız.',
    start: exteriorStart,
    end: 1,
  },
  {
    label: 'SON / YENİ BİR BAŞLANGIÇ',
    title: 'Bir sonraki çizgi sizin olsun.',
    titleLines: ['Bir sonraki', 'çizgi sizin', 'olsun.'],
    description: 'Aklınızdaki projeyi konuşalım, ilk çizgiyi birlikte atalım.',
    start: 1,
    end: 2,
    weight: 1.3,
    finale: true,
  },
];

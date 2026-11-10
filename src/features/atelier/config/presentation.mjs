import { exteriorStart, interiorStart, lifeStart, modelStart } from './journey.mjs'

// Values through 1 follow the building; 1–2 return to the blank finale sheet.
export const presentationSteps = [
  { label: '01 / FİKRİNİZLE BAŞLAR', title: 'Her mekân bir fikirle başlar.', description: 'İhtiyaçlarınızı ve hayallerinizi dinler, birlikte ilk çizgileri oluştururuz.', start: 0, end: modelStart, weight: 1.5 },
  { label: '02 / FİKİR ŞEKİLLENİR', title: 'Çizgiler mekâna dönüşür.', description: 'İlk eskizleri geliştirir, projenizin biçimini ve çevresiyle ilişkisini ortaya çıkarırız.', start: modelStart, end: interiorStart },
  { label: '03 / SİZE GÖRE TASARLANIR', title: 'Aynı mekân, size özel bir yaşam.', description: 'Farklı yerleşim ve tasarım seçeneklerini birlikte değerlendirir, yaşamınıza en uygun çözümü buluruz.', start: interiorStart, end: lifeStart },
  { label: '04 / YAŞAM CANLANIR', title: 'Henüz yapılmadan, içinde hissedin.', description: 'Günün farklı saatlerinde mekânın ışığını, atmosferini ve kullanımını keşfedin.', start: lifeStart, end: exteriorStart },
  { label: '05 / PROJENİZ TAMAMLANIR', title: 'Hayaliniz artık bütün.', start: exteriorStart, end: 1 },
  { label: 'SON / YENİ BİR ÇİZGİ', title: 'Her yeni hikâye bir çizgiyle başlar.', description: 'Sizin hayaliniz de birlikte çizeceğimiz ilk çizgiyle hayat bulabilir.', start: 1, end: 2, weight: 1.3, finale: true },
]

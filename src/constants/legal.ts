export type LegalDocument = {
  slug: string;
  title: string;
  description: string;
  sections: readonly { id: string; title: string; paragraphs: readonly string[] }[];
};

export const legalDocuments: readonly LegalDocument[] = [
  {
    slug: 'kvkk-aydinlatma-metni', title: 'KVKK Aydınlatma Metni',
    description: 'Proje tanışma formu ve iletişim süreçlerinde kişisel verilerin işlenmesine ilişkin bilgilendirme.',
    sections: [
      { id: 'veri-sorumlusu', title: 'Veri sorumlusu', paragraphs: ['Bu metin, Uluk Mimarlık web sitesindeki proje tanışma ve iletişim akışı için hazırlanmış bir taslaktır. Veri sorumlusunun tam ticari unvanı, adresi ve başvuru kanalı henüz doğrulanmamıştır. Bu bilgiler tamamlanmadan metin nihai aydınlatma metni olarak kullanılmamalıdır.'] },
      { id: 'veriler', title: 'Formda yer alan bilgiler', paragraphs: ['Proje tanışma formunda ad soyad, e-posta, isteğe bağlı telefon, proje türü, hizmet tercihi ve isteğe bağlı konum, alan ve proje notu alanları bulunur. Serbest metin alanına özel nitelikli kişisel veri veya üçüncü kişilere ait gereksiz bilgiler yazılmamalıdır.', 'Mevcut sürümde formun sunucuya gönderim entegrasyonu bulunmamaktadır. Cevaplar formun açık olduğu sırada bileşen belleğinde tutulur; uygulama bu cevapları localStorage’a kaydetmez.'] },
      { id: 'amac-ve-hukuki-sebep', title: 'Amaç ve hukuki sebep', paragraphs: ['Planlanan iletişim süreci, proje talebinin değerlendirilmesi ve ziyaretçiye dönüş yapılmasıdır. Gönderim altyapısı devreye alınırken her işleme faaliyeti için geçerli hukuki sebep, veri toplama yöntemi ve işlenen veri kapsamı belirlenerek bu metne eklenmelidir.'] },
      { id: 'aktarim-saklama', title: 'Aktarım ve saklama', paragraphs: ['Gönderim, e-posta, barındırma ve varsa diğer hizmet sağlayıcıların veri akışları doğrulanmalıdır. Alıcı grupları, aktarım amaçları, varsa yurt dışı aktarım koşulları ve saklama süreleri bu gerçek akışa göre tamamlanacaktır. Henüz doğrulanmamış süre veya aktarım taahhüdü verilmemektedir.'] },
      { id: 'haklar', title: 'İlgili kişi hakları ve başvuru', paragraphs: ['KVKK’nın 11. maddesi kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işleme amacını ve amaca uygun kullanımını öğrenme, aktarılan üçüncü kişileri bilme, eksik veya yanlış verilerin düzeltilmesini ve kanuni koşullarda silinmesini veya yok edilmesini isteme haklarınız bulunur.', 'Ayrıca düzeltme ve silme işlemlerinin aktarım yapılan üçüncü kişilere bildirilmesini isteme, münhasıran otomatik analiz nedeniyle aleyhinize çıkan sonuca itiraz etme ve hukuka aykırı işleme nedeniyle zarara uğramanız halinde giderilmesini talep etme haklarınız vardır. Başvurunun usulü ve doğrulanmış iletişim kanalı, veri sorumlusu bilgileri tamamlandığında burada açıklanacaktır.'] },
    ],
  },
  {
    slug: 'gizlilik-politikasi', title: 'Gizlilik Politikası',
    description: 'Web sitesindeki bilgi paylaşımı, iletişim bağlantıları ve veri güvenliği yaklaşımı.',
    sections: [
      { id: 'kapsam', title: 'Kapsam', paragraphs: ['Bu taslak politika, Uluk Mimarlık web sitesinin ziyaret edilmesi ve proje tanışma formunun kullanılmasıyla ilgili mevcut uygulama davranışlarını açıklar. Hizmet sağlayıcılar ve canlı ortam ayarları doğrulandıktan sonra güncellenecektir.'] },
      { id: 'form', title: 'Proje tanışma formu', paragraphs: ['Form cevapları, adımlar arasında ilerleyebilmeniz için geçici olarak bileşen belleğinde tutulur. Mevcut sürümde bu cevapları alan bir gönderim servisi bağlı değildir. Gönderim altyapısı kurulmadan form başarılı teslim bildirimi göstermez.', 'İletişim alanındaki e-posta ve telefon şu anda örnek bilgilerdir. Gerçek başvuru veya iletişim kanalı olarak kullanılmamalıdır.'] },
      { id: 'baglantilar', title: 'Harici bağlantılar', paragraphs: ['E-posta ve telefon bağlantıları cihazınızdaki ilgili uygulamayı açabilir. Sosyal medya veya diğer harici bağlantılar üzerinden ziyaret ettiğiniz hizmetlerin veri uygulamaları kendi politikalarına tabidir.'] },
      { id: 'teknik-veriler', title: 'Teknik veriler ve hizmet sağlayıcılar', paragraphs: ['Barındırma altyapısı, erişim kayıtları, hata izleme ve e-posta sağlayıcılarına ilişkin canlı ortam yapılandırması henüz doğrulanmamıştır. Bu hizmetlerde işlenen teknik veriler ve saklama süreleri, altyapı envanteri tamamlandığında burada açıklanmalıdır.'] },
      { id: 'guvenlik', title: 'Güvenlik ve güncellemeler', paragraphs: ['Kişisel veri akışı devreye alınırken erişim yetkileri, aktarım güvenliği, saklama ve silme süreçleri kullanılan altyapıyla birlikte belirlenmelidir. Bu taslak, henüz uygulanmamış güvenlik tedbirleri için bir taahhüt içermez.'] },
    ],
  },
  {
    slug: 'cerez-politikasi', title: 'Çerez Politikası',
    description: 'Çerezler, tarayıcı depolaması ve tercihlere ilişkin açıklamalar.',
    sections: [
      { id: 'cerez-nedir', title: 'Çerez nedir?', paragraphs: ['Çerezler, ziyaret ettiğiniz sitelerin tarayıcınızda saklayabildiği küçük veri kayıtlarıdır. Oturum yönetimi, tercihlerin hatırlanması veya kullanım ölçümü gibi farklı amaçlarla kullanılabilir.'] },
      { id: 'mevcut-durum', title: 'Mevcut uygulama', paragraphs: ['İncelenen uygulama kodunda bir analitik veya reklam çerezi entegrasyonu tanımlı değildir. Proje tanışma formu cevaplarını localStorage’a yazmaz. Bu açıklama, barındırma platformu veya diğer altyapı hizmetlerinin canlı ortamda çerez kullanmadığı anlamına gelmez.'] },
      { id: 'envanter', title: 'Canlı ortam çerez envanteri', paragraphs: ['Çerez adı, sağlayıcı, amaç, tür ve süre bilgileri canlı ortamda yapılacak denetimle doğrulanmalıdır. Henüz doğrulanmış bir envanter olmadığı için örnek çerez adları veya süreleri yayımlanmamıştır.'] },
      { id: 'tercihler', title: 'Tercihlerin yönetimi', paragraphs: ['Açık rıza gerektiren çerezler eklenirse, bu çerezler çalışmadan önce uygun tercih mekanizması sunulmalı; reddetme ve verilen rızayı geri alma seçenekleri sağlanmalıdır.', 'Tarayıcı ayarlarından çerezleri görüntüleyebilir, silebilir veya engelleyebilirsiniz. Bu tercihler bazı site işlevlerini etkileyebilir.'] },
    ],
  },
  {
    slug: 'kullanim-kosullari', title: 'Kullanım Koşulları ve Telif',
    description: 'Site içerikleri, proje sunumları ve görsellerin kullanımına ilişkin koşullar.',
    sections: [
      { id: 'icerik', title: 'Sitenin amacı', paragraphs: ['Bu web sitesi mimari yaklaşımı, proje sunumlarını ve iletişim olanaklarını tanıtmak için hazırlanmıştır. Sitedeki açıklamalar tek başına teklif, hizmet sözleşmesi veya uygulamaya esas teknik proje oluşturmaz.'] },
      { id: 'ornek-projeler', title: 'Örnek proje içerikleri', paragraphs: ['Örnek olarak işaretlenen proje künyelerindeki konum, yıl, alan ve durum bilgileri gösterim amacıyla eklenmiştir. Örnek galeriler farklı projelerden görseller içerebilir. Bu bilgiler gerçekleşmiş bir işe veya tamamlanmış uygulamaya ilişkin doğrulanmış referans olarak değerlendirilmemelidir.'] },
      { id: 'telif', title: 'Görseller, çizimler ve metinler', paragraphs: ['Görsellerin, mimari çizimlerin, metinlerin ve diğer içeriklerin kullanımında ilgili hak sahiplerinin haklarına uyulmalıdır. Yeniden yayımlama, ticari kullanım veya çoğaltma için kullanım hakkı ve gerekli izinler doğrulanmalıdır. Bu metin, üçüncü kişilere ait içeriklerin hak sahipliğini Uluk Mimarlık adına varsaymaz.'] },
      { id: 'hizmet', title: 'Proje talepleri ve hizmet kapsamı', paragraphs: ['Form doldurulması veya iletişim kurulması kendiliğinden hizmet sözleşmesi oluşturmaz. Projenin kapsamı, teslimleri, takvimi ve bedeli taraflar arasında ayrıca belirlenir.'] },
      { id: 'guncelleme', title: 'İçeriklerin güncellenmesi', paragraphs: ['Proje bilgileri ve site işlevleri zaman içinde değişebilir. Bu metin de gerçek şirket bilgileri ve hizmet süreçleri doğrulandığında nihai hale getirilecektir.'] },
    ],
  },
];

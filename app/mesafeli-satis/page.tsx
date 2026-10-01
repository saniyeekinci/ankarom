import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi | ANKAROM",
  description:
    "ANKAROM üzerinden verilen siparişlere ilişkin mesafeli satış sözleşmesi.",
};

const sections = [
  {
    id: "taraflar",
    title: "Taraflar",
    paragraphs: [
      "Bu sözleşme; sipariş sırasında bilgileri ve iletişim kanalları paylaşılan satıcı ile sipariş formunda bilgileri yer alan tüketici arasında, elektronik ortamda kurulur.",
      "Satıcının tam ticari unvanı, MERSİS veya vergi numarası ve tebligat adresi, sipariş tamamlanmadan önce sunulan Ön Bilgilendirme Formu ve sipariş özetiyle birlikte değerlendirilmelidir. ANKAROM marka adıdır; hukuki satıcı bilgileri sipariş belgelerinde esas alınır.",
    ],
  },
  {
    id: "konu",
    title: "Sözleşmenin konusu",
    paragraphs: [
      "Sözleşmenin konusu; tüketicinin ANKAROM internet sitesi üzerinden elektronik ortamda sipariş verdiği ürünün satışı ve teslimi ile tarafların 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerinden doğan hak ve yükümlülükleridir.",
    ],
  },
  {
    id: "siparis",
    title: "Sipariş ve ürün bilgileri",
    paragraphs: [
      "Siparişe konu römorkun modeli, temel teknik özellikleri, varsa siparişe özel ölçü ve donanımları, vergiler dâhil satış bedeli ve ödeme yöntemi; sipariş onayından önce ürün sayfası, Ön Bilgilendirme Formu ve sipariş özeti üzerinden belirlenir. Ürüne özel üretim veya ek donanım talebi varsa kapsamı ve bedeli sipariş öncesinde açıkça bildirilir.",
      "Tüketici, siparişi onaylamadan önce sipariş özeti ve toplam ödeme tutarını kontrol eder. Siparişin elektronik ortamda onaylanmasıyla sözleşme kurulur ve siparişe ilişkin kayıtlar elektronik ortamda saklanır.",
    ],
  },
  {
    id: "uretim",
    title: "Üretim ve sipariş değişiklikleri",
    paragraphs: [
      "Sipariş üzerine üretilecek römorklarda üretim planı ve tahmini tamamlanma süresi, ürünün teknik özellikleri ve üretim yoğunluğu dikkate alınarak sipariş öncesinde tüketiciye bildirilir. Kesinleşen ürün özellikleri ve varsa özel üretim talepleri sipariş belgelerinde esas alınır.",
      "Üretim başladıktan sonra teknik özelliklerde değişiklik yapılması, tarafların yazılı mutabakatına ve doğabilecek fiyat veya süre değişikliğinin tüketiciye önceden bildirilmesine bağlıdır. Üretimin başlamış olması tek başına mevzuattan doğan cayma veya diğer tüketici haklarını ortadan kaldırmaz.",
    ],
  },
  {
    id: "bedel-odeme",
    title: "Bedel ve ödeme",
    paragraphs: [
      "Tüketici, sipariş sırasında kendisine bildirilen vergiler dâhil toplam bedeli ve seçtiği ödeme yöntemini kullanarak öder. Siparişe özel üretim, ek donanım veya taraflarca kararlaştırılan teslim organizasyonundan kaynaklanan ek bedeller varsa, sipariş tamamlanmadan önce ayrıca gösterilir.",
      "Satıcı, tüketicinin açık onayı olmaksızın sipariş bedeli dışında ek bir ücret talep edemez.",
    ],
  },
  {
    id: "teslimat",
    title: "Üretimin tamamlanması ve teslim",
    paragraphs: [
      "Römorkun üretim süresi ve hazır olacağı tarih veya tahmini zaman aralığı sipariş öncesinde tüketiciye bildirilir ve sipariş belgelerinde yer alır. Ürün hazır olduğunda satıcı tüketiciye bilgi verir.",
      "Römorkun satıcıdan teslim alınacağı yer veya varsa satıcı tarafından yapılacak teslim organizasyonunun kapsamı, zamanı ve bedeli sipariş öncesinde taraflarca kararlaştırılarak Ön Bilgilendirme Formu ve sipariş özetinde belirtilir. Römorklar için standart kargo gönderimi öngörülmez; kararlaştırılmamış bir taşıma hizmeti veya ücreti tüketiciye yüklenemez.",
      "Teslim sırasında tüketici ve satıcı, römorkun görünür durumunu ve sipariş belgelerinde belirtilen temel özelliklerini birlikte kontrol edebilir. Teslim tutanağı düzenlenmesi tüketicinin mevzuattan doğan ayıplı mala ilişkin haklarını ortadan kaldırmaz.",
    ],
  },
  {
    id: "cayma-hakki",
    title: "Cayma hakkı",
    paragraphs: [
      "Tüketici, mevzuattaki istisnalar saklı kalmak kaydıyla, mal satışlarında ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma bildirimi, bu süre içinde satıcıya yazılı olarak veya kalıcı veri saklayıcısı aracılığıyla iletilmelidir.",
      "Cayma bildirimi aşağıdaki iletişim kanallarından yazılı olarak iletilebilir. Römorkun boyutu ve niteliği nedeniyle iade tesliminin nasıl yapılacağı ve varsa iade taşıma giderleri, siparişe ve yürürlükteki mevzuata göre belirlenir; standart kargo gönderimi varsayılmaz.",
    ],
  },
  {
    id: "istisnalar",
    title: "Cayma hakkının istisnaları",
    paragraphs: [
      "Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda özel olarak hazırlanan römorklar bakımından cayma hakkı, yalnızca ilgili mevzuattaki istisna şartlarının somut siparişte karşılanması hâlinde kullanılamayabilir. Standart ürün siparişi veya üretimin başlamış olması tek başına cayma hakkını ortadan kaldırmaz. Uygulanabilecek istisna, sipariş öncesinde tüketiciye açıkça bildirilir.",
    ],
  },
  {
    id: "iade-bedel",
    title: "İade ve bedel iadesi",
    paragraphs: [
      "Cayma hakkının geçerli şekilde kullanılması hâlinde bedel iadesi ve varsa teslim organizasyonuna ilişkin masraflar yürürlükteki mevzuata göre değerlendirilir. İade, tüketicinin ödeme sırasında kullandığı araca uygun şekilde ve yasal süreler içinde yapılır.",
      "Römorkun iadesi gerektiğinde teslim yeri, zamanının planlanması ve varsa taşıma giderlerinin kime ait olacağı sipariş koşulları ve yürürlükteki mevzuata göre belirlenir. Satıcı, tüketiciye kargo ile gönderim şartı koymaz; taraflar mevzuata uygun bir teslim yöntemi üzerinde bilgilendirilir.",
    ],
  },
  {
    id: "uyusmazlik",
    title: "Uyuşmazlıkların çözümü",
    paragraphs: [
      "Sözleşmeden doğabilecek uyuşmazlıklarda, tüketicinin yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı yerdeki tüketici hakem heyetleri ve tüketici mahkemeleri, mevzuatta belirlenen görev ve parasal sınırlar çerçevesinde yetkilidir.",
    ],
  },
  {
    id: "yururluk",
    title: "Yürürlük ve kabul",
    paragraphs: [
      "Tüketici, siparişini tamamlayarak bu sözleşmenin siparişe ilişkin Ön Bilgilendirme Formu ve sipariş özetiyle birlikte sunulduğunu ve elektronik ortamda onaylandığını kabul eder. Sözleşme, siparişin elektronik ortamda onaylandığı tarihte yürürlüğe girer.",
    ],
  },
];

export default function DistanceSalesAgreementPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#202522]">
      <header className="border-b border-[#e5e4df] bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-8 sm:px-10 sm:pb-16 lg:px-16">
          <nav aria-label="İçerik yolu" className="mb-12 text-sm text-[#778078]">
            <Link href="/" className="transition-colors hover:text-[#29483c]">
              Anasayfa
            </Link>
            <span className="mx-3 text-[#b7bdb8]">/</span>
            <span aria-current="page" className="text-[#29483c]">
              Mesafeli Satış Sözleşmesi
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64766b]">
                <span className="h-px w-8 bg-[#8d9b90]" />
                ANKAROM <span className="text-[#c4c9c4]">/</span> YASAL METİNLER
              </p>
              <h1 className="max-w-195 text-[38px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[52px] lg:text-[62px]">
                Mesafeli Satış Sözleşmesi
              </h1>
              <p className="mt-6 max-w-170 text-[16px] leading-8 text-[#626a64]">
                ANKAROM üzerinden verilen römork siparişlerinde üretim,
                teslim, cayma ve iade koşullarını açıklayan sözleşme.
              </p>
            </div>

            <div className="border-l-2 border-[#71877a] pl-5 text-sm leading-6 text-[#626a64]">
              <p className="font-semibold text-[#29483c]">Siparişe özel bilgiler</p>
              <p className="mt-2">
                Römorkun teknik özellikleri, üretim süresi, teslim alma
                düzenlemesi, toplam bedel ve satıcının yasal kimlik bilgileri
                sipariş öncesi sunulan belgelerde esas alınır.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-20 lg:px-16">
        <aside className="self-start lg:sticky lg:top-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
            Sözleşme bölümleri
          </p>
          <nav aria-label="Sözleşme bölümleri">
            <ol className="grid grid-cols-2 gap-x-5 gap-y-2 border-l border-[#d8ddd8] pl-4 text-[13px] leading-5 sm:grid-cols-3 lg:grid-cols-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="group flex gap-2 py-1 text-[#68716b] transition-colors hover:text-[#29483c]"
                  >
                    <span className="font-mono text-[11px] text-[#9aa49c] group-hover:text-[#547261]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 border-t border-[#dedfda] pt-5 text-[13px] leading-6 text-[#727a74]">
            <p className="font-medium text-[#29483c]">Satıcı iletişimi</p>
            <a className="mt-2 block hover:text-[#29483c]" href="mailto:info@ankarom.com">
              info@ankarom.com
            </a>
            <a className="mt-1 block hover:text-[#29483c]" href="tel:+905079586868">
              +90 (507) 958 68 68
            </a>
            <p className="mt-1">Türkiye / Ankara</p>
          </div>
        </aside>

        <article className="min-w-0">
          <div className="mb-10 border border-[#e3d8bd] bg-[#fbf8f0] px-5 py-4 text-[13px] leading-6 text-[#665d4e] sm:px-6">
            <p className="font-semibold text-[#4d463a]">Yayına almadan önce</p>
            <p className="mt-1">
              Satıcının tam ticari unvanı, MERSİS veya vergi numarası ve açık
              tebligat adresi henüz bu sayfada yer almıyor. Bu yasal bilgiler
              sipariş kabul edilmeden önce sözleşme ve Ön Bilgilendirme
              Formunda tamamlanmalıdır.
            </p>
          </div>

          <div className="divide-y divide-[#e2e4df] border-y border-[#d9ddd8]">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8 py-8 sm:py-10"
                aria-labelledby={`${section.id}-heading`}
              >
                <div className="grid gap-4 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-6">
                  <span className="pt-1 font-mono text-[12px] tracking-[0.08em] text-[#8b998f]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2
                      id={`${section.id}-heading`}
                      className="text-[21px] font-medium tracking-[-0.02em] text-[#27342c] sm:text-[23px]"
                    >
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4 text-[15px] leading-8 text-[#58615b]">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-[#d9ddd8] pt-6 text-[13px] leading-6 text-[#737b75] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Sorularınız için{" "}
              <a className="font-medium text-[#29483c] underline decoration-[#aebbb1] underline-offset-4" href="mailto:info@ankarom.com">
                info@ankarom.com
              </a>
              {" "}adresinden bize ulaşabilirsiniz.
            </p>
            <Link href="/" className="font-medium text-[#29483c] hover:text-[#547261]">
              ANKAROM ana sayfasına dön <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İptal ve İade Koşulları | ANKAROM",
  description:
    "ANKAROM römork siparişlerinde cayma hakkı, iptal, iade ve taşıma koşulları.",
};

const sections = [
  {
    id: "cayma-hakki",
    title: "Cayma hakkı",
    paragraphs: [
      "Tüketici, mevzuatta yer alan istisnalar saklı kalmak üzere, mesafeli olarak satın aldığı ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma bildiriminin bu süre içinde satıcıya yazılı olarak veya kalıcı veri saklayıcısı aracılığıyla iletilmesi gerekir.",
      "Cayma bildiriminizi info@ankarom.com adresine sipariş numaranızla birlikte iletebilirsiniz. Bildirimin bize ulaştığını teyit edebilmemiz için e-posta göndermenizi öneririz. Telefonla bilgi almak için +90 (507) 958 68 68 numarasından bize ulaşabilirsiniz; telefon görüşmesi tek başına yazılı cayma bildiriminin yerine geçmez.",
    ],
  },
  {
    id: "iade-tasimasi",
    title: "İade taşıması ve nakliye giderleri",
    paragraphs: [
      "Römorklar boyutları ve ağırlıkları nedeniyle standart kargo gönderisine uygun değildir. Cayma hakkı kapsamında iade gerektiğinde ürünün teslim yeri, taşıma yöntemi ve varsa yükleme veya nakliye gideri sipariş öncesinde Ön Bilgilendirme Formunda açıklanır.",
      "Cayma hakkının kullanıldığı ve ürünün ayıplı ya da siparişe aykırı olmadığı iadelerde, iade taşıma gideri yürürlükteki mevzuatın izin verdiği ve sipariş öncesinde tüketiciye açıkça bildirilen ölçüde alıcıya aittir. İade taşımasının alıcı tarafından organize edilmesi gerekiyorsa, ürün yola çıkarılmadan önce bizimle iletişime geçerek teslim yeri ve taşıma planını teyit edin. Önceden bildirilmeyen veya mevzuat gereği satıcı tarafından karşılanması gereken bir gider alıcıya yüklenmez.",
      "Ürünün ayıplı olması, sipariş edilenden farklı gönderilmesi ya da iade nedeninin satıcıdan kaynaklanması hâlinde iade ve taşıma giderleri yürürlükteki mevzuata göre satıcı tarafından karşılanır. Bu durumlarda lütfen ürünü göndermeden önce fotoğraf ve sipariş numarasıyla bize ulaşın; uygun iade veya inceleme yöntemi tarafınıza bildirilecektir.",
    ],
  },
  {
    id: "ozel-uretim",
    title: "Siparişe özel üretim ürünler",
    paragraphs: [
      "Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda kişiye özel hazırlanan ürünlerde cayma hakkı, Mesafeli Sözleşmeler Yönetmeliğinde düzenlenen istisna şartlarının ilgili sipariş için gerçekleşmesi hâlinde kullanılamayabilir. Bu istisna ürün ve sipariş bazında değerlendirilir ve sipariş tamamlanmadan önce tüketiciye bildirilir.",
      "Standart bir ürünün satın alınmış olması veya üretimin başlamış olması tek başına cayma hakkını ortadan kaldırmaz. Siparişe özel ölçü, donanım veya teknik değişiklik talebiniz varsa kapsamı ve cayma hakkına etkisi sipariş öncesinde tarafınıza açıkça bildirilir. Ayıplı mala ilişkin yasal haklarınız saklıdır.",
    ],
  },
  {
    id: "iptal",
    title: "Sipariş iptali",
    paragraphs: [
      "Siparişinizi iptal etmek veya sipariş üzerinde değişiklik talep etmek için mümkün olan en kısa sürede info@ankarom.com adresinden sipariş numaranızla bize ulaşın. Üretim veya teslimat sürecinin başlamış olması, talebin siparişin durumuna ve yürürlükteki mevzuata göre değerlendirilmesini gerektirebilir; tek başına tüketicinin yasal haklarını ortadan kaldırmaz.",
      "Mevzuatta cayma hakkı istisnası bulunan siparişe özel ürünlerde iptal ve ücret iadesi, ürünün niteliği ve sipariş aşaması dikkate alınarak ilgili mevzuat ve tarafların sipariş öncesinde kararlaştırdığı koşullar çerçevesinde değerlendirilir.",
    ],
  },
  {
    id: "bedel-iadesi",
    title: "Bedel iadesi",
    paragraphs: [
      "Cayma hakkının mevzuata uygun biçimde kullanılması hâlinde, tahsil edilen bedeller yürürlükteki yasal süre ve koşullara göre, tüketicinin kullandığı ödeme aracına uygun şekilde iade edilir. İade taşıma giderlerinin kime ait olduğu, yukarıdaki koşullar ve sipariş öncesinde sunulan Ön Bilgilendirme Formu esas alınarak belirlenir.",
      "İade sürecinin başlatılabilmesi için sipariş numaranızı ve cayma bildiriminizi info@ankarom.com adresine iletin. Ürünün iadesi gereken durumlarda, iade teslimi veya taşıma planı tarafımızla teyit edilmeden ürünü göndermeyin.",
    ],
  },
  {
    id: "iletisim",
    title: "İletişim",
    paragraphs: [
      "İptal, cayma veya iade talepleriniz için info@ankarom.com adresine yazabilir ya da +90 (507) 958 68 68 numarasından bize ulaşabilirsiniz. Başvurunuzda adınızı, sipariş numaranızı ve talebinizin nedenini belirtmeniz işlemin daha hızlı yürütülmesine yardımcı olur.",
    ],
  },
];

export default function CancellationAndReturnsPage() {
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
              İptal ve İade Koşulları
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64766b]">
                <span className="h-px w-8 bg-[#8d9b90]" />
                ANKAROM <span className="text-[#c4c9c4]">/</span> YASAL METİNLER
              </p>
              <h1 className="max-w-195 text-[38px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[52px] lg:text-[62px]">
                İptal ve İade Koşulları
              </h1>
              <p className="mt-6 max-w-170 text-[16px] leading-8 text-[#626a64]">
                Römork siparişlerinde cayma hakkı, siparişe özel üretim ve iade
                taşıma sürecine ilişkin bilgilendirme.
              </p>
            </div>

            <div className="border-l-2 border-[#71877a] pl-5 text-sm leading-6 text-[#626a64]">
              <p className="font-semibold text-[#29483c]">Römork iadeleri</p>
              <p className="mt-2">
                Ürünlerin hacmi nedeniyle iade taşıması standart kargo ile
                yapılamaz. Taşıma yöntemi ve varsa giderler sipariş öncesinde
                bildirilir.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-20 lg:px-16">
        <aside className="self-start lg:sticky lg:top-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
            Sayfa bölümleri
          </p>
          <nav aria-label="İptal ve iade bölümleri">
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
          <div className="mb-10 border border-[#d8ddd8] bg-white px-5 py-4 text-[13px] leading-6 text-[#626a64] sm:px-6">
            Cayma hakkı ve iade koşulları, 6502 sayılı Tüketicinin Korunması
            Hakkında Kanun ile Mesafeli Sözleşmeler Yönetmeliği çerçevesinde
            uygulanır. Siparişe özel taşıma bedeli ve satıcının yasal kimlik
            bilgileri, sipariş öncesinde sunulan Ön Bilgilendirme Formunda ayrıca
            yer alır.
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
              Ayrıntılar için{" "}
              <Link
                href="/mesafeli-satis"
                className="font-medium text-[#29483c] underline decoration-[#aebbb1] underline-offset-4"
              >
                Mesafeli Satış Sözleşmesini
              </Link>{" "}
              inceleyebilirsiniz.
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
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik ve Güvenlik Politikası | ANKAROM",
  description:
    "ANKAROM kişisel verilerin işlenmesi, gizlilik ve çevrimiçi ödeme güvenliği politikası.",
};

const sections = [
  {
    id: "gizlilik",
    title: "Veri sorumlusu ve kapsam",
    paragraphs: [
      "Bu politika, ANKAROM internet sitesi üzerinden sunulan hizmetlerde kişisel verilerin işlenmesi ve korunması hakkında bilgi verir. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu, sipariş ve Ön Bilgilendirme Formunda bilgileri yer alan satıcıdır. ANKAROM marka adıdır; satıcının ticari unvanı ve iletişim bilgileri sipariş öncesinde sunulan yasal belgelerde belirtilir.",
      "Kişisel verileriniz; hesabınızın oluşturulması ve yönetilmesi, sipariş ve teslimat süreçlerinin yürütülmesi, taleplerinizin yanıtlanması, hizmet güvenliğinin sağlanması ve kanuni yükümlülüklerin yerine getirilmesi amaçlarıyla işlenir. Veriler, bu amaçlar için gerekli olduğu ve ilgili mevzuattaki saklama süreleri boyunca muhafaza edilir; süre sonunda silinir, yok edilir veya anonim hâle getirilir.",
    ],
  },
  {
    id: "veri-kategorileri",
    title: "İşlenen veriler",
    paragraphs: [
      "Hizmetin kullanımına göre ad ve soyad, e-posta adresi, telefon numarası, teslimat adresi, hesap ve sipariş bilgileri, destek taleplerinizde paylaştığınız içerikler ve işlem güvenliği kayıtları işlenebilir. Hesap parolaları veritabanında açık metin olarak tutulmaz; tek yönlü kriptografik özetleme yöntemiyle korunur.",
      "Google ile giriş seçeneğini kullandığınızda, kimlik doğrulama ve hesabınızın oluşturulması için Google üzerinden ad, e-posta ve hesap tanımlayıcısı gibi gerekli bilgiler alınabilir. Google'ın kendi hizmetleri kapsamında yaptığı veri işleme, Google'ın gizlilik açıklamalarına tabidir.",
    ],
  },
  {
    id: "isleme-hukuki-sebepler",
    title: "İşleme amaçları ve hukuki sebepler",
    paragraphs: [
      "Verileriniz; üyelik ve müşteri hesabı işlemleri, satış sözleşmesinin kurulması ve ifası, ödeme ve teslimatın yürütülmesi, müşteri desteği, bilgi güvenliği ve kötüye kullanımın önlenmesi, finansal ve hukuki kayıtların tutulması amaçlarıyla işlenebilir.",
      "İşleme, KVKK'nın 5. maddesinde belirtilen sözleşmenin kurulması veya ifası, hukuki yükümlülüğün yerine getirilmesi, bir hakkın tesisi veya korunması ve temel haklarınıza zarar vermemek kaydıyla meşru menfaat hukuki sebeplerine dayanır. Açık rıza gereken hâllerde verileriniz rızanıza dayanılarak işlenir.",
    ],
  },
  {
    id: "veri-paylasimi",
    title: "Verilerin aktarılması",
    paragraphs: [
      "Kişisel verileriniz satılmaz ve izniniz olmadan üçüncü kişilerin bağımsız reklam veya pazarlama faaliyetleri için paylaşılmaz. Hizmetin sunulması için gerekli olduğu ölçüde veriler; barındırma ve veri tabanı hizmeti sağlayıcıları, ödeme kuruluşu veya banka, teslimat ve taşıma firmaları, iletişim/destek hizmeti sağlayıcıları ve yetkili kamu kurumlarıyla sınırlı olarak paylaşılabilir.",
      "Aktarılan veri, alıcının hizmeti yerine getirmesi için gerekli olanla sınırlıdır. Yurt dışındaki hizmet sağlayıcıların kullanılması hâlinde kişisel veriler, KVKK'nın yurt dışına aktarım hükümlerine ve gerekli güvencelere uygun şekilde aktarılır.",
    ],
  },
  {
    id: "odeme-guvenligi",
    title: "Kredi kartı ve ödeme güvenliği",
    paragraphs: [
      "Sanal POS üzerinden yapılan ödemelerde kredi kartı numarası, son kullanma tarihi ve güvenlik kodu (CVV) ANKAROM tarafından görüntülenmez ve ANKAROM'un uygulama sunucularında saklanmaz. Kart bilgileri, ödeme işleminin gerçekleştirilmesi için bankanın veya yetkili ödeme kuruluşunun güvenli ödeme ekranına iletilir ve bu kuruluş tarafından işlenir.",
      "Kart bilgilerinin ödeme kuruluşuna aktarımı, SSL/TLS korumalı bağlantı üzerinden 256-bit şifreleme kullanılarak gerçekleştirilir. Kart bilgilerinizin işlenmesi, ilgili banka veya ödeme kuruluşunun güvenlik ve gizlilik koşullarına da tabidir. Ödeme kuruluşunun adı ve ilgili koşullar ödeme adımında gösterilir.",
    ],
  },
  {
    id: "guvenlik",
    title: "Bilgi güvenliği",
    paragraphs: [
      "Kişisel verilerin yetkisiz erişime, kayba, değiştirilmeye veya hukuka aykırı kullanıma karşı korunması için erişim yetkilendirmesi, parola güvenliği ve uygun teknik ve idari tedbirler uygulanır. İnternet üzerinden veri aktarımında HTTPS üzerinden SSL/TLS şifrelemesi kullanılır. Bununla birlikte, internet üzerinden gerçekleşen hiçbir aktarım yöntemi mutlak güvenlik garantisi vermez.",
      "Hesap parolanızı başkalarıyla paylaşmayın; herkese açık veya ortak cihazlarda oturumunuzu kapatın. Hesabınızla ilgili şüpheli bir durum fark ederseniz info@ankarom.com adresinden bize bildirin.",
    ],
  },
  {
    id: "yerel-depolama",
    title: "Tarayıcıda yerel depolama",
    paragraphs: [
      "Oturumun devamlılığını sağlamak için hesap bilgileri ve oturum belirteci tarayıcınızın yerel depolama alanında tutulabilir. Tarayıcı verilerini temizleyerek bu bilgileri silebilirsiniz; bu durumda hesabınıza yeniden giriş yapmanız gerekir. Yerel depolama tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz.",
    ],
  },
  {
    id: "kvkk-haklari",
    title: "KVKK kapsamındaki haklarınız",
    paragraphs: [
      "KVKK'nın 11. maddesi kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme, aktarım yapılan üçüncü kişileri bilme, eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme ve kanuni şartlar dâhilinde silinmesini veya yok edilmesini talep etme haklarına sahipsiniz. Kanunda öngörülen şartlarda otomatik analiz sonucuna itiraz edebilir ve zararınızın giderilmesini talep edebilirsiniz.",
      "Haklarınıza ilişkin taleplerinizi kimliğinizi doğrulamaya elverişli bilgilerle birlikte info@ankarom.com adresine iletebilirsiniz. Başvurularınız KVKK ve ilgili mevzuatta belirtilen usul ve süreler çerçevesinde yanıtlanır.",
    ],
  },
  {
    id: "guncelleme",
    title: "Politika güncellemeleri",
    paragraphs: [
      "Mevzuat veya hizmetlerimizdeki değişiklikler doğrultusunda bu politika güncellenebilir. Güncel metin bu sayfada yayımlandığı tarihten itibaren geçerlidir.",
    ],
  },
];

export default function PrivacyAndSecurityPage() {
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
              Gizlilik ve Güvenlik Politikası
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64766b]">
                <span className="h-px w-8 bg-[#8d9b90]" />
                ANKAROM <span className="text-[#c4c9c4]">/</span> YASAL METİNLER
              </p>
              <h1 className="max-w-195 text-[38px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[52px] lg:text-[62px]">
                Gizlilik ve Güvenlik Politikası
              </h1>
              <p className="mt-6 max-w-170 text-[16px] leading-8 text-[#626a64]">
                Kişisel verilerinizin kullanımı, paylaşımı ve çevrimiçi ödeme
                güvenliği hakkında bilgilendirme.
              </p>
            </div>

            <div className="border-l-2 border-[#71877a] pl-5 text-sm leading-6 text-[#626a64]">
              <p className="font-semibold text-[#29483c]">Ödeme güvenliği</p>
              <p className="mt-2">
                Kart bilgileriniz sanal POS sağlayıcısı tarafından işlenir; ANKAROM
                sunucularında saklanmaz.
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
          <nav aria-label="Gizlilik ve güvenlik bölümleri">
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
            <p className="font-medium text-[#29483c]">Veri sorumlusu iletişimi</p>
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
            Verileriniz yalnızca hizmetlerimizin sunulması, yasal
            yükümlülüklerimizin yerine getirilmesi ve burada açıklanan amaçlarla
            işlenir. Verilerinizi satmayız veya bağımsız reklam amacıyla
            paylaşmayız; hizmetin yürütülmesi için gerekli sınırlı aktarımlar
            aşağıda açıklanmıştır.
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

          <div className="mt-10 border-t border-[#d9ddd8] pt-6 text-[13px] leading-6 text-[#737b75]">
            Sorularınız veya KVKK kapsamındaki talepleriniz için{" "}
            <a
              className="font-medium text-[#29483c] underline decoration-[#aebbb1] underline-offset-4"
              href="mailto:info@ankarom.com"
            >
              info@ankarom.com
            </a>{" "}
            adresinden bize ulaşabilirsiniz.
          </div>
        </article>
      </div>
    </main>
  );
}
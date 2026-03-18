import Image from "next/image";
import Link from "next/link";

const technicalSpecs = [
  { label: "Taşıma Kapasitesi", value: "3.500 KG" },
  { label: "Toplam Uzunluk", value: "6.8 M" },
  { label: "Platform Genişliği", value: "2.2 M" },
  { label: "Aks Sistemi", value: "Çift Aks" },
  { label: "Fren", value: "Elektrikli + Hidrolik" },
  { label: "Garanti", value: "2 Yıl" },
];

const highlights = [
  {
    title: "Düşük Platform Geometrisi",
    text: "Süpersport araçlar için optimize edilen alçak açı sayesinde sürtme riskini azaltır ve güvenli yükleme sağlar.",
  },
  {
    title: "Profesyonel Yol Stabilitesi",
    text: "Yük dağılımını koruyan şasi yapısı ve çok noktalı sabitleme çözümleri ile uzun mesafede daha dengeli sürüş sunar.",
  },
  {
    title: "Markanıza Uygun Konfigürasyon",
    text: "Renk, jant, rampa tipi ve ekipman seçenekleri ile ihtiyaca göre kişiselleştirilebilir profesyonel paketler sunar.",
  },
];

export default function ProductDetailExperience() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8">
        <div className="grid gap-7 lg:grid-cols-12 lg:gap-8">
          <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-[0_24px_70px_rgba(2,6,23,0.5)] backdrop-blur-xl lg:col-span-6">
            <div className="relative min-h-110 w-full sm:min-h-130">
              <Image
                src="/products/fleet-management-v2.jpg"
                alt="Super Sport Low Trailer"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/45 to-slate-950/15" />

              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-slate-900/55 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-md">
                Premium Seri
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                  Ankarom Product Line
                </p>
                <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-5xl">
                  Super Sport
                  <span className="bg-linear-to-r from-amber-300 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                    {" "}
                    Lowering Trailer
                  </span>
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
                  Üst segment araç taşımacılığı için geliştirilen bu model, düşük yükleme açısı ve yüksek stabilite kombinasyonu ile
                  showroom, motorsport ve operasyonel filo kullanımlarında premium performans sunar.
                </p>
              </div>
            </div>
          </article>

          <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.5)] backdrop-blur-xl sm:p-6 lg:col-span-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative z-10 space-y-5">
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Model Özeti</p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Super Sport Lowering Trailer</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Alçak yükleme geometrisi, güçlendirilmiş şasi yapısı ve profesyonel sabitleme altyapısı ile premium sınıf araç
                  transferinde güvenli operasyon sağlar.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Başlangıç Fiyatı</p>
                  <p className="mt-1 text-xl font-bold text-amber-300">₺2.450.000 + KDV</p>
                </article>
                <article className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Teslim Süresi</p>
                  <p className="mt-1 text-sm font-semibold text-white">4–6 Hafta (Siparişe Özel Üretim)</p>
                </article>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Hizmet Kapsamı</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  <li>• Projeye özel konfigürasyon ve ekipman seçimi</li>
                  <li>• Kurumsal filo kullanımına uygun teknik danışmanlık</li>
                  <li>• Satış sonrası bakım ve servis planlama desteği</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">Hızlı Teklif</p>
                <p className="mt-2 text-sm leading-relaxed text-amber-100">
                  Satın alma ekibinize özel fiyatlandırma, teslim takvimi ve opsiyon listesi için bizimle iletişime geçin.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/iletisim"
                    className="rounded-xl bg-amber-700 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-amber-800"
                  >
                    Teklif Al
                  </Link>
                  <a
                    href="#urun-detayli-bilgi"
                    className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
                  >
                    Teknik Detay
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-7 lg:grid-cols-12 lg:gap-8">
          <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-7 lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {technicalSpecs.map((spec) => (
                <article key={spec.label} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{spec.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{spec.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-6 lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Varyantlar</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <p className="font-semibold text-white">Urban Pack</p>
                <p className="mt-1 text-slate-300">Kompakt şasi, şehir içi seri operasyonlara uygun.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <p className="font-semibold text-white">Track Pack</p>
                <p className="mt-1 text-slate-300">Yüksek performanslı araç transferi için güçlendirilmiş yapı.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <p className="font-semibold text-white">Premium Pack</p>
                <p className="mt-1 text-slate-300">Tam donanımlı görünüm ve üst segment ekipman paketi.</p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
          <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-slate-300">Neden Bu Model?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/35 p-5">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="urun-detayli-bilgi"
          className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Detaylı Bilgi</p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Super Sport Lowering Trailer Teknik Detayı</h2>
          <p className="mt-4 max-w-5xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Bu model, düşük gövdeli spor araçların hasarsız yüklenmesi için optimize edilmiş rampa açısı ve güçlendirilmiş şasi yapısı ile
            geliştirilmiştir. Yük sabitleme noktaları, uzun mesafeli taşımalarda dahi güvenli pozisyon koruyacak şekilde konumlandırılmıştır.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-slate-950/35 p-5">
              <h3 className="text-base font-semibold text-white">Operasyonel Avantajlar</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-300">
                <li>• Düşük açı sayesinde hızlı ve güvenli yükleme süreci</li>
                <li>• Çift aks mimarisi ile daha dengeli yol tutuş performansı</li>
                <li>• Yoğun kullanım için dayanıklı taşıyıcı platform</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-slate-950/35 p-5">
              <h3 className="text-base font-semibold text-white">Konfigürasyon Seçenekleri</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-300">
                <li>• Gövde rengi ve marka kimliğine özel görünüm paketi</li>
                <li>• Rampa ve sabitleme ekipmanında ihtiyaca göre özelleştirme</li>
                <li>• Kurumsal filolar için bakım ve servis destek planı</li>
              </ul>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

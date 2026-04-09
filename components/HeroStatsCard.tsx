import Link from "next/link"; // Link bileşenini ekledik

export default function HeroStatsCard() {
  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-8 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -left-8 bottom-16 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl sm:-left-12" />
      </div>

      {/* rounded-[32px] yerine rounded-4xl kullandık */}
      <div className=" mx-auto w-full max-w-360 rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10 lg:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
          <div className="flex flex-col gap-4 space-y-7 lg:col-span-7">
            <span className="inline-flex items-center rounded-full   px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              GÜVENİLİR VE SERTİFİKALI TAŞIMA ÇÖZÜMLERİ
            </span>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl">
              O1 ve O2 Belgeli, Her Araca Uygun, Üstün Kaliteli Römork İmalatı
            </h1>

            <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Ankarom olarak; tekneden jet skiye, ATV’den motosiklete kadar tüm
              taşıma ihtiyaçlarınız için uluslararası standartlarda, dayanıklı
              ve güvenli römorklar üretiyoruz.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* a etiketlerini Link olarak değiştirdik */}
              <Link
                href="/iletisim"
                className="rounded-xl bg-blue-600 !text-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                İletişime Geç
              </Link>
              <Link
                href="/urunler"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-slate-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Ürünleri İncele
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-linear-to-tr from-blue-400/10 via-sky-400/10 to-transparent blur-2xl" />
            <div className="relative rounded-[30px] border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    MEMNUN MÜŞTERİ
                  </p>
                  <p className="mt-2 text-4xl font-bold text-slate-900">+240</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    TESLİM EDİLEN RÖMORK
                  </p>
                  <p className="mt-2 text-4xl font-bold text-slate-900">17</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    GARANTİ SÜRESİ
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    2 Yıl
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

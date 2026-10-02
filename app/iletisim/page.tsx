import type { Metadata } from "next";
import {
  ArrowUpRightIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "İletişim | ANKAROM",
  description:
    "ANKAROM iletişim bilgileri, Ankara merkezimiz ve teslimat süreçleri.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#eeece7] text-[#171715]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#eeece7]">
        {/* Decorative oversized typography */}
        <div className="pointer-events-none absolute -right-8 top-20 hidden select-none xl:block">
          <span className="text-[240px] font-medium leading-none tracking-[-0.09em] text-[#e4e1da]">
            A
          </span>
        </div>

        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-14 xl:px-20">
          <div className="grid min-h-[calc(100vh-82px)] lg:grid-cols-[1.1fr_0.9fr]">
            {/* =====================================================
                LEFT SIDE
            ===================================================== */}
            <div className="relative flex flex-col justify-between py-14 sm:py-20 lg:py-24 lg:pr-20 xl:py-28">
              {/* Top label */}
              <div>
                <div className="flex items-center gap-5">
                  <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-[#7d7972]">
                    01
                  </span>

                  <span className="h-px w-12 bg-[#9c978e]" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#7d7972]">
                    İLETİŞİM
                  </span>
                </div>

                {/* Main title */}
                <h1 className="mt-16 max-w-[850px] text-[58px] font-medium leading-[0.91] tracking-[-0.065em] sm:text-[78px] md:text-[92px] lg:mt-24 lg:text-[100px] xl:text-[116px]">
                  <span className="block">Sizin için</span>

                  <span className="block text-[#918c84]">
                    buradayız.
                  </span>
                </h1>

                <p className="mt-10 max-w-[490px] text-[14px] leading-8 text-[#67635d] sm:text-[15px]">
                  Yeni bir römork, özel üretim çözümü veya ürünlerimiz
                  hakkında bilgi almak için ANKAROM ekibiyle doğrudan
                  iletişime geçin.
                </p>
              </div>

              {/* Bottom information */}
              <div className="mt-20 border-t border-[#d2cec6] pt-7 lg:mt-32">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#99938a]">
                      MERKEZ
                    </p>

                    <p className="mt-3 text-[13px] font-medium">
                      Ankara
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#99938a]">
                      HİZMET
                    </p>

                    <p className="mt-3 text-[13px] font-medium">
                      Türkiye Geneli
                    </p>
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#99938a]">
                      MARKA
                    </p>

                    <p className="mt-3 text-[13px] font-medium">
                      ANKAROM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
              RIGHT CONTACT PANEL
            ===================================================== */}
            <div className="relative mt-8 overflow-hidden border border-[#dedad2] bg-[#f8f7f4] text-[#272522] lg:mt-0">
              {/* Fine decorative circles */}
              <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-[#d8d3ca]/70" />

              <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border border-[#d8d3ca]/55" />

              <div className="flex min-h-[680px] flex-col justify-between p-7 sm:p-10 lg:min-h-full lg:p-14 xl:p-16">
                {/* Top */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.35em] text-[#77716a]">
                      ANKAROM
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#96918a]">
                      2026
                    </span>
                  </div>

                  <div className="mt-24 lg:mt-32">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#77716a]">
                      Doğrudan iletişim
                    </p>

                    <p className="mt-5 max-w-[330px] text-[25px] font-light leading-[1.25] tracking-[-0.025em] text-[#272522] sm:text-[30px]">
                      Taşıma ihtiyaçlarınızı
                      <br />
                      birlikte
                      <span className="text-[#918c84]"> planlayalım.</span>
                    </p>
                  </div>
                </div>

                {/* Contact links */}
                <div className="mt-20">
                  <a
                    href="tel:+905079586868"
                    className="group block border-t border-[#d8d3ca] py-9"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.3em] text-[#96918a]">
                          TELEFON
                        </p>

                        <p className="mt-4 text-[18px] font-light tracking-[-0.01em] text-[#272522] sm:text-[20px]">
                          +90 507 958 68 68
                        </p>
                      </div>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c9c4bb] transition-all duration-500 group-hover:border-[#29483c] group-hover:bg-[#29483c] group-hover:text-white">
                        <PhoneIcon className="h-4 w-4 stroke-[1.2]" />
                      </span>
                    </div>
                  </a>
                  <a
                    href="mailto:info@ankarom.com"
                    className="group block border-t border-[#d8d3ca] py-9"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.3em] text-[#96918a]">
                          E-POSTA
                        </p>

                        <p className="mt-4 text-[18px] font-light tracking-[-0.01em] text-[#272522] sm:text-[20px]">
                          info@ankarom.com
                        </p>
                      </div>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c9c4bb] transition-all duration-500 group-hover:border-[#29483c] group-hover:bg-[#29483c] group-hover:text-white">
                        <EnvelopeIcon className="h-4 w-4 stroke-[1.2]" />
                      </span>
                    </div>
                  </a>
 <div className="border-t border-[#d8d3ca] py-9">
                    <div className="flex items-start gap-5">
                      <MapPinIcon className="mt-1 h-5 w-5 shrink-0 stroke-[1.2] text-[#827d74]" />

                      <div>
                        <p className="text-[8px] uppercase tracking-[0.3em] text-[#96918a]">
                          ADRES
                        </p>

                        <p className="mt-4 max-w-[290px] text-[15px] font-light leading-7 text-[#55514b]">
                          Hasköy Mahallesi Eczacılar sokak Emek Sokak 3/A
                          Keçiören Ankara
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 flex items-end justify-between gap-6">
                  <p className="max-w-[230px] text-[10px] leading-6 text-[#77716a]">
                    Ürün, sipariş ve özel üretim talepleriniz için doğrudan
                    bizimle iletişime geçebilirsiniz.
                  </p>

                  <span className="hidden text-[8px] uppercase tracking-[0.3em] text-[#96918a] sm:block">
                    A / 01
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          DELIVERY SECTION
      ========================================================= */}
      <section className="border-t border-[#d6d2ca] bg-[#eeece7]">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-14 xl:px-20">
          <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
            {/* Section title */}
            <div className="border-b border-[#d6d2ca] py-16 lg:border-b-0 lg:border-r lg:py-24 lg:pr-20">
              <div className="flex items-center gap-4">
                <span className="text-[9px] tracking-[0.3em] text-[#a19c93]">
                  02
                </span>

                <span className="h-px w-10 bg-[#a19c93]" />

                <span className="text-[9px] uppercase tracking-[0.3em] text-[#858078]">
                  SÜREÇ
                </span>
              </div>

              <h2 className="mt-10 max-w-[400px] text-[42px] font-medium leading-[0.98] tracking-[-0.05em] sm:text-[54px]">
                Zamanınız
                <br />
                <span className="text-[#918c84]">önemli.</span>
              </h2>

              <p className="mt-7 max-w-[330px] text-[13px] leading-7 text-[#706b64]">
                Üretim ve teslimat süreçlerimizi mümkün olduğunca net ve
                öngörülebilir şekilde yürütüyoruz.
              </p>
            </div>

            {/* Process */}
            <div className="lg:pl-20">
              <div className="grid sm:grid-cols-2">
                {/* Standard */}
                <div className="border-b border-[#d6d2ca] py-14 sm:border-r sm:pr-14 lg:py-24">
                  <span className="text-[10px] tracking-[0.25em] text-[#aaa49b]">
                    01
                  </span>

                  <h3 className="mt-7 text-[25px] font-medium tracking-[-0.025em]">
                    Standart ürünler
                  </h3>

                  <div className="mt-10">
                    <span className="text-[58px] font-medium leading-none tracking-[-0.06em]">
                      3
                    </span>

                    <span className="ml-3 text-[11px] uppercase tracking-[0.2em] text-[#88827a]">
                      iş günü
                    </span>
                  </div>

                  <p className="mt-7 max-w-[280px] text-[12px] leading-7 text-[#77716f]">
                    Stokta bulunan standart ürünlerin hazırlık ve teslim
                    süreci.
                  </p>
                </div>

                {/* Special */}
                <div className="py-14 sm:pl-14 lg:py-24">
                  <span className="text-[10px] tracking-[0.25em] text-[#aaa49b]">
                    02
                  </span>

                  <h3 className="mt-7 text-[25px] font-medium tracking-[-0.025em]">
                    Özel üretim
                  </h3>

                  <div className="mt-10 gap-4">
                    <span className="text-[58px] font-medium leading-none tracking-[-0.06em]">
                      10 – 15 
                    </span>

                    <span className="ml-6 text-[11px] uppercase tracking-[0.2em] text-[#88827a]">
                      iş günü
                    </span>
                  </div>

                  <p className="mt-7 max-w-[280px] text-[12px] leading-7 text-[#77716f]">
                    Özel ölçü ve ihtiyaçlara göre hazırlanan römorkların
                    üretim süreci.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="border-t border-[#d6d2ca] py-8">
                <a
                  href="https://wa.me/905079586868?text=İyi%20günler,%20hizmetleriniz%20hakkında%20detaylı%20bilgi%20alabilir%20miyim?"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-5 text-[9px] font-medium uppercase tracking-[0.28em] text-[#272522]"
                >
                  WhatsApp üzerinden ulaşın

                  <span className="flex h-10 w-10 items-center justify-center border border-[#bdb8b0] transition-all duration-300 group-hover:border-[#272522] group-hover:bg-[#272522] group-hover:text-white">
                    <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL BRAND LINE
      ========================================================= */}
      <section className="overflow-hidden border-t border-[#dedad2] bg-[#f8f7f4]">
        <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#77716a]">
              ANKAROM / TAŞIMACILIK ÇÖZÜMLERİ
            </p>

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#96918a]">
              ANKARA — TÜRKİYE
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
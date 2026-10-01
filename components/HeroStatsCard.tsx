"use client";

import Link from "next/link";
import {
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";

const whatsappHref =
  "https://wa.me/905079586868?text=İyi%20günler,%20hizmetleriniz%20hakkında%20detaylı%20bilgi%20alabilir%20miyim?";

const advantages = [
  {
    icon: ShieldCheckIcon,
    title: "O1 / O2",
    subtitle: "Tip Onay",
    text: "Belgelendirilmiş üretim standartları.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Teknik",
    subtitle: "Destek",
    text: "Satış sonrası sürdürülebilir hizmet.",
  },
  {
    icon: GlobeAltIcon,
    title: "Türkiye",
    subtitle: "Geneli Teslimat",
    text: "Ankara merkezli üretim ve lojistik.",
  },
];

export default function HeroStatsCard() {
  return (
    <section className="relative overflow-hidden bg-[#faf9f7] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      
      {/* Çok hafif dekoratif alan */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[50%] top-[50%] h-162.5 w-162.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ece9e3]" />

        <div className="absolute left-0 top-[50%] h-px w-full bg-[#efede8]" />

        <div className="absolute left-[50%] top-0 h-full w-px bg-[#efede8]" />
      </div>

      <div className="relative mx-auto! w-full max-w-345">

        {/* ÜST KÜÇÜK BAŞLIK */}
        <div className="mb-20 flex justify-center">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#bcb6ad]" />

            <span className="text-[9px] font-medium uppercase tracking-[0.38em] text-[#918b83]">
              ANKAROM / GÜVENİLİR TAŞIMA
            </span>

            <span className="h-px w-12 bg-[#bcb6ad]" />
          </div>
        </div>

        {/* ANA ALAN */}
        <div className="mx-auto! w-full max-w-5xl">

          {/* SOL TARAF */}
          <div className="relative z-10 text-center">

            <p className="mb-8 text-[10px] font-medium uppercase leading-7 tracking-[0.3em] text-[#a09a92]">
              Daha fazlası için değil.
              <br />
              Doğrusu için.
            </p>

            <h2 className="mx-auto! max-w-175 text-[44px] font-medium leading-[1.16] tracking-[-0.045em] text-[#171717] sm:text-6xl lg:text-[76px]">
              Taşımak
              <br />
              <span className="text-[#9c968e]">
                güven ister.
              </span>
            </h2>

            <p className="mx-auto! mt-10 max-w-155 text-sm leading-8 text-[#77716f] sm:text-base sm:leading-9">
              Ankarom, farklı taşıma ihtiyaçları için güvenlik, dayanıklılık
              ve mühendislik yaklaşımını bir araya getirir. Üretimden teslimata
              kadar her aşamada işlevsel çözümler geliştirmeyi hedefler.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <Link
                href="/urunler"
                className="group inline-flex items-center gap-5 border border-[#1e344f] bg-white px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-[#1e344f] transition-all duration-300 hover:border-[#1e344f] hover:bg-[#1e344f] hover:text-white"
              >
                Kataloğu Keşfet

                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 border border-[#c5d3e4] bg-white px-7 py-4 text-[9px] font-medium uppercase tracking-[0.24em] text-[#252320] transition-all duration-300 hover:border-[#7896bb] hover:bg-[#f1f5fa] hover:text-[#52749b]"
              >
                Teklif Al

                <span className="text-[#aaa49c] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* SAĞ TARAF */}
          <div className="relative z-10 mt-20">

            <div className="mx-auto! max-w-170">

              {/* Büyük sembol */}
              <div className="mb-14 flex justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[#dcd8d1] bg-[#faf9f7]">

                  <div className="absolute inset-5 rounded-full border border-[#e8e5df]" />

                  <span className="text-[38px] font-light tracking-[-0.05em] text-[#292622]">
                    A
                  </span>

                  <span className="absolute bottom-4 text-[7px] uppercase tracking-[0.3em] text-[#aaa49f]">
                    ANKAROM
                  </span>
                </div>
              </div>

              {/* AVANTAJLAR */}
              <div className="space-y-0 border-y border-[#d9e3ef]">
                {advantages.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group flex items-center gap-6 border-b border-[#d9e3ef] py-8 last:border-b-0 sm:gap-8"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#c5d3e4] bg-white transition-all duration-300 group-hover:border-[#7896bb]">
                        <Icon className="h-5 w-5 stroke-[1.2] text-[#77716f] transition-colors group-hover:text-[#52749b]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="text-lg font-medium tracking-[-0.02em] text-[#252320]">
                            {item.title}
                          </span>

                          <span className="text-[8px] uppercase tracking-[0.2em] text-[#aaa49f]">
                            {item.subtitle}
                          </span>
                        </div>

                        <p className="mt-3 text-[11px] leading-7 text-[#89837c]">
                          {item.text}
                        </p>
                      </div>

                      <span className="text-[10px] text-[#c1bcb4] transition-transform duration-300 group-hover:translate-x-1">
                        0{index + 1}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* ALT MESAJ */}
        <div className="relative z-10 mt-24 flex justify-center">
          <p className="max-w-175 text-center text-[10px] uppercase leading-6 tracking-[0.28em] text-[#aaa49f]">
            GÜVENLİK &nbsp; / &nbsp; DAYANIKLILIK &nbsp; / &nbsp; MÜHENDİSLİK
          </p>
        </div>

      </div>
    </section>
  );
}
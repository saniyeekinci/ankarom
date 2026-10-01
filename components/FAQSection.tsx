"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type Category = {
  id: string;
  label: string;
  items: FaqItem[];
};

const categories: Category[] = [
  {
    id: "teknik",
    label: "Teknik & Belgeler",
    items: [
      {
        question: "O1 ve O2 belgesi nedir, farkları nelerdir?",
        answer:
          "O1 belgesi 750 kg altı römorklar içindir; tescil ve muayene gerektirmez. O2 belgesi ise 750 kg - 3500 kg arasıdır, ruhsat ve plaka zorunluluğu vardır. Tüm ürünlerimiz tip onay belgelidir.",
      },
      {
        question: "Römorklarım için ayrı bir sigorta yaptırmalı mıyım?",
        answer:
          "O1 belgeli römorklar çekici aracın sigortasına dahildir. O2 belgeli römorklar için ise ayrı mali mesuliyet sigortası gerekebilir.",
      },
      {
        question: "B sınıfı ehliyet ile römork kullanabilir miyim?",
        answer:
          "Toplam yüklü ağırlık 3500 kg'ı geçmediği sürece O1 belgeli römorkları B sınıfı ehliyet ile kullanabilirsiniz.",
      },
    ],
  },
  {
    id: "uretim",
    label: "Üretim & Garanti",
    items: [
      {
        question: "Römorklarda hangi malzemeleri kullanıyorsunuz?",
        answer:
          "Tamamı sıcak daldırma galvaniz kaplı, korozyona dayanıklı yüksek mukavemetli çelik şaseler kullanıyoruz. Paslanmaya karşı uzun ömür garantilidir.",
      },
      {
        question: "Garanti süresi ve kapsamı nedir?",
        answer:
          "Üretim hatalarına karşı tüm römorklarımız 2 yıl resmi garanti kapsamındadır. Ayrıca yedek parça desteği sunmaktayız.",
      },
      {
        question: "Kişiye özel veya farklı ölçülerde üretim yapıyor musunuz?",
        answer:
          "Evet, teknenizin veya aracınızın ölçülerine göre mühendislik ekibimizle özel konfigürasyonlar hazırlayabiliyoruz.",
      },
    ],
  },
  {
    id: "siparis",
    label: "Sipariş & Teslimat",
    items: [
      {
        question: "Teslimat süreniz ne kadardır?",
        answer:
          "Stoktaki standart modellerimiz hemen teslim edilirken, özel üretim projelerimiz ortalama 10-15 iş günü içinde tamamlanmaktadır.",
      },
      {
        question: "Türkiye geneline gönderim yapıyor musunuz?",
        answer:
          "Evet, Ankara merkezli fabrikamızdan Türkiye’nin her yerine güvenli lojistik ağımızla gönderim sağlıyoruz.",
      },
    ],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const current =
    categories.find((category) => category.id === activeCategory) ??
    categories[0];

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-[#fcfcfb] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="!mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="!mx-auto max-w-3xl text-center">

          {/* SOL */}
          <div>
            <div className="flex items-center justify-center gap-4">
              

              <span className="h-px w-9 bg-[#d2cec7]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#9a958d]">
                DESTEK
              </span>
            </div>

            <h2 className="mt-7 text-[40px] font-medium leading-[1.08] tracking-[-0.045em] text-[#191919] sm:text-[48px]">
              Merak
              <br />
              <span className="text-[#9c968d]">
                ettikleriniz.
              </span>
            </h2>
          </div>

          {/* SAĞ */}
          <div className="mt-6">
            <p className="mx-auto max-w-[570px] text-[15px] leading-8 text-[#706c65] sm:text-[16px]">
              Belgelerden üretim sürecine, garanti koşullarından teslimata
              kadar Ankarom hakkında en çok merak edilen soruların
              cevaplarını burada bulabilirsiniz.
            </p>
          </div>
        </div>

        {/* =====================================================
            CATEGORY NAVIGATION
        ===================================================== */}
        <div className="!mx-auto mt-16 max-w-4xl border-y border-[#e5e2dc]">

          <div className="flex justify-start overflow-x-auto scrollbar-none sm:justify-center">
            {categories.map((category, index) => {
              const active = category.id === activeCategory;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenIndex(null);
                  }}
                  className={`group relative flex min-w-fit items-center gap-4 px-6 py-5 text-left transition-colors duration-300 first:pl-0 ${
                    active
                      ? "text-[#171717]"
                      : "text-[#99948c] hover:text-[#45413c]"
                  }`}
                >
                  <span
                    className={`text-[10px] font-medium tracking-[0.2em] transition-colors ${
                      active ? "text-[#171717]" : "text-[#b3aea6]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.12em]">
                    {category.label}
                  </span>

                  <span
                    className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                      active
                        ? "w-full bg-[#171717]"
                        : "w-0 bg-[#171717] group-hover:w-full"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            FAQ LIST
        ===================================================== */}
        <div className="!mx-auto mt-12 w-full max-w-4xl">

          {current.items.map((item, index) => {
            const open = openIndex === index;

            return (
              <div
                key={`${current.id}-${index}`}
                className="border-b border-[#e5e2dc]"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={open}
                  className="group flex w-full items-center gap-6 py-7 text-left sm:py-8"
                >
                  {/* NUMARA */}
                  <span
                    className={`hidden w-8 shrink-0 text-[10px] font-medium tracking-[0.2em] transition-colors sm:block ${
                      open ? "text-[#171717]" : "text-[#aaa49b]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* SORU */}
                  <span
                    className={`flex-1 pr-4 text-[16px] font-medium leading-7 tracking-[-0.01em] transition-colors sm:text-[17px] ${
                      open
                        ? "text-[#171717]"
                        : "text-[#45413d] group-hover:text-[#171717]"
                    }`}
                  >
                    {item.question}
                  </span>

                  {/* ICON */}
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-300 ${
                      open
                        ? "border-[#171717] bg-[#171717] text-white"
                        : "border-[#dedbd5] text-[#8f8981] group-hover:border-[#aaa49f]"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {/* CEVAP */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-8 pl-0 sm:pl-14 sm:pr-16">
                      <div className="border-l border-[#d9d5ce] pl-5 sm:pl-6">
                        <p className="max-w-[760px] text-[14px] leading-7 text-[#77726b] sm:text-[15px]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            ALT BİLGİ
        ===================================================== */}
        <div className="!mx-auto mt-14 flex w-full max-w-4xl flex-col items-center gap-5 border-t border-[#e5e2dc] pt-7 text-center sm:flex-row sm:justify-center">

          <p className="text-[11px] uppercase tracking-[0.18em] text-[#aaa49b]">
            Aradığınız cevabı bulamadınız mı?
          </p>

          <a
            href="/iletisim"
            className="group inline-flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#37332f]"
          >
            <span className="border-b border-[#bcb7af] pb-1 transition-colors group-hover:border-[#171717]">
              Bize Ulaşın
            </span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>

        </div>
      </div>
    </section>
  );
}
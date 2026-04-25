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
        answer: "Stoktaki standart modellerimiz hemen teslim edilirken, özel üretim projelerimiz ortalama 10-15 iş günü içinde tamamlanmaktadır.",
      },
      {
        question: "Türkiye geneline gönderim yapıyor musunuz?",
        answer: "Evet, Ankara merkezli fabrikamızdan Türkiye’nin her yerine güvenli lojistik ağımızla gönderim sağlıyoruz.",
      },
    ],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const current = categories.find((c) => c.id === activeCategory)!;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24 flex  justify-center ">
      <div className="mx-auto max-w-5xl flex flex-col  items-center">
        
        {/* HEADER - DÜZELTİLDİ: w-2xl yerine max-w-2xl ve responsive genişlik */}
        <div className="text-center w-full max-w-2xl px-4 flex flex-col gap-3">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Sık Sorulan Sorular
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Belgeler, üretim süreci ve teslimat hakkında en çok merak edilen 
            soruları sizin için bir araya getirdik.
          </p>
        </div>

        {/* CATEGORY PILLS - Mobil uyumlu sarma (flex-wrap) */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3 ">
          {categories.map((cat) => {
            const active = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ACCORDION */}
        <div className="mt-12 w-full max-w-3xl space-y-3 sm:space-y-4">
          {current.items.map((item, i) => {
            const open = openIndex === i;

            return (
              <div
                key={i}
                className={`border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
                  open ? "ring-1 ring-slate-200 shadow-md" : "hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-5 py-5 sm:px-7 text-left transition-colors"
                >
                  <span className="text-[15px] sm:text-base font-bold text-slate-900 pr-4 leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="px-5 pb-5 sm:px-7 sm:pb-6 animate-in fade-in slide-in-from-top-1">
                    <div className="pt-3 border-t border-slate-50 text-slate-600 text-[14px] sm:text-[15px] leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
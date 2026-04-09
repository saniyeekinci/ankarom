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
          "Tamamı sıcak daldırma galveniz kaplı, korozyona dayanıklı yüksek mukavemetli çelik şaseler kullanıyoruz. Paslanmaya karşı uzun ömür garantilidir.",
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
      {
        question: "Römorklarınızın taşıma kapasitesi nedir?",
        answer:
          "Ürünlerimiz 750 kg'dan başlayarak 3500 kg'a kadar farklı taşıma kapasitelerine sahip modellerle sunulmaktadır. İhtiyacınıza uygun modeli seçebilirsiniz.",
      },
      {
        question: "Römorklarınızın su geçirmezliği hakkında bilgi verebilir misiniz?",
        answer:
          "Römorklarımız, su geçirmez kaplamalar ve özel conta sistemleri ile donatılmıştır. Bu sayede tekne taşıma sırasında su sızdırmazlığı sağlanır ve ürünlerimiz uzun ömürlü olur.",
      }
    ],
  },
  {
    id: "siparis",
    label: "Sipariş & Teslimat",
    items: [
      {
        question: "Teslimat süreniz ne kadardır?",
        answer: "Stoktaki standart modellerimiz hemen teslim edilirken, özel üretim projelerimiz iş yoğunluğuna göre ortalama 10-15 iş günü içinde tamamlanmaktadır.",
      },
      {
        question: "Türkiye geneline gönderim yapıyor musunuz?",
        answer: "Evet, Ankara merkezli fabrikamızdan Türkiye’nin her yerine güvenli lojistik ağımızla gönderim sağlıyoruz.",
      },
      {
        question: "Ödeme seçenekleriniz nelerdir?",
        answer: "Kredi kartına taksit imkanı, havale/EFT ve kurumsal projeler için özel ödeme planları sunuyoruz."
      },
      {
        question: "İade ve değişim koşullarınız nelerdir?",
        answer: "Ürünlerimizle ilgili herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin. İade ve değişim işlemleri, ürünün durumuna ve sebepine göre değerlendirilir."
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
    <section className="px-6 py-20 ">
      <div className="mx-auto max-w-8xl flex  flex-col gap-4 items-center justify-center">
        {/* HEADER */}
        <div className="text-center w-2xl  flex  flex-col gap-4 ">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            Sık Sorulan Sorular
          </h2>
          <p className="mt-4 text-slate-600">
            Planlar, fiyatlar ve desteklenen özellikler hakkında sorularınız
            için size yardımcı olmaktan memnuniyet duyarız.
          </p>
        </div>

        {/* CATEGORY PILLS */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const active = cat.id === activeCategory;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ACCORDION */}
<div className="mt-10 w-full max-w-3xl mx-auto space-y-4"> 
  {/* max-w-3xl ile tüm satırları sabit bir genişliğe hapsettik */}
  {current.items.map((item, i) => {
    const open = openIndex === i;

    return (
      <div
        key={i}
        className="border border-slate-200 rounded-xl overflow-hidden bg-white w-full transition-all duration-200"
      >
        <button
          onClick={() => toggle(i)}
          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
        >
          {/* text-left ve w-full sayesinde başlıklar her zaman aynı hizada başlar */}
          <span className="text-[16px] font-semibold text-slate-900 pr-4">
            {item.question}
          </span>

          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* İçerik alanı açıldığında kartın genişliği değişmez, sadece yüksekliği artar */}
        {open && (
          <div className="px-6 pb-5 text-slate-600 text-[15px] leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="pt-2 border-t border-slate-100">
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

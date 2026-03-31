"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

const popularProducts = [
  {
    title: "Kurumsal Operasyon",
    description:
      "Araç, ekip ve süreç takibini tek panelde toplayarak operasyonu daha düzenli yönetin.",
    image: "/products/fleet-management-v2.jpg",
  },
  {
    title: "Servis Planlama",
    description:
      "Bakım tarihlerini akıllı takvim ile planlayın ve servis operasyonlarını aksatmadan yönetin.",
    image: "/products/service-planning-v2.jpg",
  },
  {
    title: "Yedek Parça",
    description:
      "Stok seviyelerini takip edin, kritik parçalar için otomatik uyarılarla kesintiyi azaltın.",
    image: "/products/spare-parts-v2.jpg",
  },
  {
    title: "Raporlama",
    description:
      "Operasyonel performansı KPI bazlı raporlar ile analiz edin ve hızlı karar alın.",
    image: "/products/reporting-v2.jpg",
  },
];

export default function PopularProductsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeProduct = useMemo(() => popularProducts[activeIndex], [activeIndex]);
  const nextProduct = useMemo(
    () => popularProducts[(activeIndex + 1) % popularProducts.length],
    [activeIndex]
  );

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % popularProducts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + popularProducts.length) % popularProducts.length);
  };

  // Otomatik geçiş zamanlayıcısı (5 saniyede bir değişir)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % popularProducts.length);
    }, 5000); // 5000 milisaniye = 5 saniye

    // Bileşen ekrandan kalktığında hafıza sızıntısı olmaması için temizliyoruz
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 sm:py-24 overflow-hidden flex justify-center items-center min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex justify-center items-center">
        {/* GRID YAPI: 4 Sütun (1 Sol + 2 Orta + 1 Sağ) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-8 lg:gap-12 w-full">
          
          {/* Sol: Aktif Ürün Görseli (1 Sütun) */}
          <div 
            className="col-span-1 aspect-square relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group mx-auto"
            style={{ width: '260px', height: '260px', maxWidth: '100%', maxHeight: '100%' }}
            onClick={handlePrev}
            title="Önceki Çözüm"
          >
            <Image
              src={activeProduct.image}
              alt={activeProduct.title}
              fill
              sizes="(max-width: 1024px) 100vw, 28vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          </div>

          {/* Orta: Metin ve İçerik Alanı (2 Sütun) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center text-center px-4 space-y-6 lg:space-y-8 gap-4">
            
            {/* Üst Badge */}
            <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-800 bg-white shadow-sm">
              Sizin için seçtiklerimiz
            </div>
            
            {/* Başlık */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-950 leading-tight">
              {activeProduct.title}
            </h2>
            
            {/* Alt Metin */}
            <p className="text-lg lg:text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
              {activeProduct.description}
            </p>
            
            {/* Aksiyon Butonu */}
            <button className="mt-4 px-8 py-3 rounded-full border border-slate-200 text-base font-medium text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all">
              Detaylı Bilgi Al
            </button>
            
          </div>

          {/* Sağ: Sonraki Ürün Görseli (1 Sütun) */}
          <div 
            className="hidden lg:block col-span-1 aspect-square relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group opacity-60 hover:opacity-100 transition-opacity duration-300 mx-auto"
            style={{ width: '340px', height: '425px', maxWidth: '100%', maxHeight: '100%' }}
            onClick={handleNext}
            title="Sonraki Çözüm"
          >
            <Image
              src={nextProduct.image}
              alt={nextProduct.title}
              fill
              sizes="(max-width: 1024px) 0vw, 28vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
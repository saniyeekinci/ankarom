"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Örnek resim yollarını kendi projenizdeki resimlerle değiştirin
const SLIDER_IMAGES = [
  "/products/12.png",
  "/products/2.png",
  "/products/4.png",
  "/products/5.png",
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Otomatik resim değiştirme efekti (Her 4 saniyede bir)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDER_IMAGES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-white min-h-screen text-black flex items-center justify-center py-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* SOL KISIM: Otomatik Değişen Resim Slider'ı */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 shadow-sm">
          {SLIDER_IMAGES.map((imgSrc, index) => (
            <Image
              key={index}
              src={imgSrc}
              alt={`Hakkımızda Görseli ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              priority={index === 0} // İlk resmin hızlı yüklenmesi için
            />
          ))}
        </div>

      {/* SAĞ KISIM: Kısa, Samimi ve Net Metin */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Ankarom Hakkında
          </h1>
          
          <div className="space-y-6 text-neutral-700 text-sm sm:text-base leading-relaxed">
            <p>
              Ankarom, Ankara'da sektöre taze bir soluk getirmek amacıyla kurulan yenilikçi bir römork üretim markasıdır. Amacımız, modern mühendislik standartlarını kaliteli işçilikle buluşturarak güvenilir taşıma çözümleri sunmaktır.
            </p>
            
            <p>
              Özellikle tekne, ATV ve araç taşıma gibi farklı ihtiyaçlara yönelik tasarladığımız römorklarımızda, güvenlik ve dayanıklılığı en ön planda tutuyoruz. Üretim sürecimizin her aşamasında uluslararası kalite standartlarını ve O1/O2 belge gereksinimlerini titizlikle uyguluyoruz.
            </p>
            
            <p>
              Henüz yolculuğumuzun başlarında olsak da, dinamik ekibimiz ve kaliteden ödün vermeyen üretim anlayışımızla müşterilerimiz için sağlam ve uzun ömürlü bir çözüm ortağı olmayı hedefliyoruz.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
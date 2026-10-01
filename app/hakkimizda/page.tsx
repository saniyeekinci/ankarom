"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDER_IMAGES = [
  "/products/12.png",
  "/products/2.png",
  "/products/4.png",
  "/products/5.png",
];

const VALUES = [
  {
    number: "01",
    title: "Güven",
    description:
      "Her ürünümüzde güvenli kullanım, sağlamlık ve uzun ömürlü performansı ön planda tutuyoruz.",
  },
  {
    number: "02",
    title: "Kalite",
    description:
      "Üretimin her aşamasında malzeme kalitesi, işçilik ve detaylara gösterilen özen bizim için önem taşıyor.",
  },
  {
    number: "03",
    title: "Çözüm",
    description:
      "Farklı taşıma ihtiyaçlarına uygun, işlevsel ve kullanıcı odaklı römork çözümleri geliştiriyoruz.",
  },
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % SLIDER_IMAGES.length
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#fcfcfb] text-[#171717]">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">

          <div className="grid min-h-[720px] grid-cols-1 items-center gap-14 py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-24 lg:py-24">

            {/* SOL */}
            <div className="order-2 lg:order-1">

              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-10 bg-[#b7b1a8]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#8b877f]">
                  ANKAROM
                </span>
              </div>

              <h1 className="max-w-xl text-[48px] font-medium leading-[1.04] tracking-[-0.045em] sm:text-[58px] lg:text-[68px]">
                Sadece taşımak
                <br />
                <span className="text-[#9b958b]">
                  değil, güven vermek.
                </span>
              </h1>

              <p className="mt-8 max-w-[520px] text-[15px] leading-8 text-[#68645e] sm:text-[16px]">
                Ankarom, modern mühendislik anlayışını kaliteli işçilikle
                birleştirerek güvenilir ve uzun ömürlü taşıma çözümleri
                geliştiren Ankara merkezli bir römork markasıdır.
              </p>

              <div className="mt-10 flex items-center gap-5">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8b877f]">
                  Hakkımızda
                </span>

                <span className="h-px w-14 bg-[#d2cec7]" />
              </div>

              {/* Mini bilgiler */}
              <div className="mt-14 grid max-w-[500px] grid-cols-2 border-t border-[#e5e2dd]">

                <div className="pt-7">
                  <p className="text-[24px] font-medium tracking-[-0.03em]">
                    O1 / O2
                  </p>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#96918a]">
                    Belgelendirme
                  </p>
                </div>

                <div className="border-l border-[#e5e2dd] pl-8 pt-7">
                  <p className="text-[24px] font-medium tracking-[-0.03em]">
                    Ankara
                  </p>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#96918a]">
                    Üretim Merkezi
                  </p>
                </div>

              </div>
            </div>

            {/* SAĞ - GÖRSEL */}
            <div className="order-1 lg:order-2">

              <div className="relative">

                {/* İnce dekoratif çerçeve */}
                <div className="absolute -right-4 -top-4 h-full w-full border border-[#e5e1da]" />

                <div className="relative aspect-[4/3] overflow-hidden bg-[#f2f1ee]">

                  {SLIDER_IMAGES.map((imgSrc, index) => (
                    <Image
                      key={imgSrc}
                      src={imgSrc}
                      alt={`Ankarom ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority={index === 0}
                      className={`object-cover transition-opacity duration-[1400ms] ease-in-out ${
                        index === currentIndex
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Hafif beyaz overlay */}
                  <div className="absolute inset-0 bg-white/[0.03]" />

                  {/* Görsel alt bilgi */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-black/25 to-transparent px-6 pb-6 pt-14">

                    <div className="flex items-center gap-3 text-white">
                      <span className="text-[11px] font-medium tracking-[0.2em]">
                        {String(currentIndex + 1).padStart(2, "0")}
                      </span>

                      <span className="h-px w-7 bg-white/70" />

                      <span className="text-[10px] tracking-[0.15em] text-white/80">
                        {String(SLIDER_IMAGES.length).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {SLIDER_IMAGES.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Görsel ${index + 1}`}
                          onClick={() => setCurrentIndex(index)}
                          className={`h-[2px] transition-all duration-300 ${
                            index === currentIndex
                              ? "w-8 bg-white"
                              : "w-3 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          İNCE AYIRICI
      ===================================================== */}
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="h-px bg-[#e7e4df]" />
      </div>

      {/* =====================================================
          HAKKIMIZDA
      ===================================================== */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.65fr_1.35fr] lg:gap-28">

          {/* SOL BAŞLIK */}
          <div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#9a958d]">
                01
              </span>

              <span className="h-px w-8 bg-[#d2cec7]" />
            </div>

            <h2 className="mt-7 max-w-[380px] text-[34px] font-medium leading-[1.15] tracking-[-0.04em] sm:text-[40px]">
              Üretimin merkezinde
              <br />
              <span className="text-[#a19b92]">
                kalite var.
              </span>
            </h2>
          </div>

          {/* SAĞ METİN */}
          <div className="max-w-[760px]">

            <p className="text-[16px] leading-8 text-[#5f5b55]">
              Ankarom, Ankara'da sektöre yeni bir bakış açısı kazandırmak
              amacıyla kurulmuş yenilikçi bir römork üretim markasıdır.
              Modern mühendislik standartlarını kaliteli işçilikle
              birleştirerek güvenilir ve uzun ömürlü taşıma çözümleri
              sunmayı hedefliyoruz.
            </p>

            <p className="mt-7 text-[16px] leading-8 text-[#5f5b55]">
              Tekne, ATV ve araç taşıma gibi farklı kullanım alanlarına
              yönelik geliştirdiğimiz römorklarda; güvenlik, dayanıklılık
              ve fonksiyonelliği tasarım sürecinin merkezinde tutuyoruz.
              Üretimin her aşamasında kalite standartlarına ve O1/O2 belge
              gereksinimlerine uygun hareket ediyoruz.
            </p>

            <p className="mt-7 text-[16px] leading-8 text-[#5f5b55]">
              Henüz yolculuğumuzun başlarında olsak da, dinamik yapımız ve
              gelişime açık üretim anlayışımızla müşterilerimiz için yalnızca
              bir ürün değil, uzun vadeli ve güvenilir bir çözüm ortağı
              olmayı amaçlıyoruz.
            </p>

          </div>
        </div>
      </section>

      {/* =====================================================
          DEĞERLER
      ===================================================== */}
      <section className="border-y border-[#e7e4df] bg-[#f7f6f3]">

        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-16 lg:py-28">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">

            <div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#9a958d]">
                  02
                </span>

                <span className="h-px w-8 bg-[#d2cec7]" />
              </div>

              <h2 className="mt-6 text-[34px] font-medium leading-tight tracking-[-0.04em] sm:text-[40px]">
                Bizi tanımlayan
                <br />
                <span className="text-[#9b958b]">
                  üç temel değer.
                </span>
              </h2>
            </div>

            <p className="max-w-[500px] text-[14px] leading-7 text-[#77726a] lg:justify-self-end">
              Tasarımdan üretime, her aşamada aynı anlayışı koruyoruz:
              kaliteli malzeme, titiz işçilik ve güvenilir sonuç.
            </p>

          </div>

          {/* DEĞER KARTLARI */}
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-[#e1ded8] bg-[#e1ded8] md:grid-cols-3">

            {VALUES.map((value) => (
              <div
                key={value.number}
                className="bg-[#f7f6f3] px-8 py-10 transition-colors duration-300 hover:bg-white lg:px-10 lg:py-12"
              >

                <span className="text-[10px] font-medium tracking-[0.25em] text-[#a09a91]">
                  {value.number}
                </span>

                <h3 className="mt-9 text-[22px] font-medium tracking-[-0.02em]">
                  {value.title}
                </h3>

                <p className="mt-4 text-[14px] leading-7 text-[#77726a]">
                  {value.description}
                </p>

                <div className="mt-8 h-px w-8 bg-[#c7c2ba]" />

              </div>
            ))}

          </div>
        </div>
      </section>

      
    </main>
  );
}
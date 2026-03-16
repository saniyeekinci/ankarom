"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault(); // Sayfa yenilenmesini veya beklenmedik kaymaları önler
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="w-full  py-6 px-0">
      <div className="mx-auto max-w-none px-4 md:px-10">
        <div className="border border-gray-600 text-white rounded-[40px] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-8 py-16 md:px-20 lg:px-24">
            <div className="md:col-span-5 flex flex-col justify-between h-full">
              {" "}
              {/* h-full ve justify-between önemli */}
              {/* Üst Kısım: Logo ve Slogan */}
              <div className="flex flex-col">
                <Link href="/">
                  <Image
                    src="/ankarom.png"
                    width={180}
                    height={60}
                    alt="Ankarom"
                    className="brightness-0 invert object-contain"
                  />
                </Link>
                <p className="mt-8 max-w-sm text-base leading-relaxed text-gray-300">
                  Gelişmiş teknolojik çözümlerle iş süreçlerinizi optimize
                  ediyor, geleceğin standartlarını bugünden sunuyoruz.
                </p>
              </div>
              {/* Alt Kısım: Sosyal Medya İkonları ve Back to Top Butonu */}
              {/* mt-auto sayesinde bu grup her zaman en alta yaslanır */}
              <div className="mt-20 md:mt-auto pt-10 flex flex-col gap-8">
                {/* SOSYAL MEDYA İKON GRUBU */}
                <div className="flex items-center gap-6">
                  {/* X (eski Twitter) */}
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                  </Link>

                  {/* LinkedIn */}
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24.004.774 23.203 0 22.225 0z" />
                    </svg>
                  </Link>

                  {/* Instagram */}
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.617 6.777 6.978 6.978 1.28.058 1.687.072 4.947.072s3.667-.014 4.947-.072c4.354-.2 6.777-2.617 6.978-6.978.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.2-4.353-2.617-6.777-6.978-6.978C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </Link>

                  {/* Facebook */}
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Link>
                </div>

                {/* BACK TO TOP BUTONU */}
                <div>
                  <button
                    type="button" // Form içinde kalırsa sayfayı yenilememesi için
                    onClick={scrollToTop}
                    className="relative z-10 flex items-center gap-3 border border-gray-500 rounded-lg px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#0a3631] transition-all duration-300 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 pointer-events-none" // SVG'nin tıklamayı emmesini engeller
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 11l7-7 7 7"
                      />
                    </svg>
                    BACK TO TOP
                  </button>
                </div>
              </div>
            </div>

            {/* Sağ Bölüm: Menüler */}
            <div className="md:col-span-7 grid grid-cols-2 gap-24 lg:gap-32 md:pl-20 pt-10 md:pt-16">
              <div>
                {/* Başlık altındaki boşluğu mb-14 yaparak ilk linkten uzaklaştırdık */}
                <h4 className="mb-14 text-[12px] font-bold uppercase tracking-[0.3em] text-white/50">
                  SITE MAP
                </h4>

                {/* space-y-10 ile linklerin arasını iyice açtık, leading-loose ile satır boyunu genişlettik */}
                <ul className="space-y-10 text-[16px] font-normal leading-loose">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-300 hover:text-white transition-all border-b border-transparent hover:border-white pb-2"
                    >
                      Anasayfa
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/urunler"
                      className="text-gray-300 hover:text-white transition-all border-b border-transparent hover:border-white pb-2"
                    >
                      Ürünler
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hakkimizda"
                      className="text-gray-300 hover:text-white transition-all border-b border-transparent hover:border-white pb-2"
                    >
                      Hakkımızda
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/iletisim"
                      className="text-gray-300 hover:text-white transition-all border-b border-transparent hover:border-white pb-2"
                    >
                      İletişim
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-14 text-[12px] font-bold uppercase tracking-[0.3em] text-white/50">
                  LEGAL
                </h4>
                <ul className="space-y-10 text-[16px] font-normal leading-loose">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-white transition-all border-b border-transparent hover:border-white pb-2"
                    >
                      Gizlilik Politikası
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-white transition-all border-b border-transparent hover:border-white pb-2"
                    >
                      Kullanım Şartları
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Turuncu Alt Şerit */}
          <div className="bg-[#d98a29] py-4 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-[#0a3631]">
            COPYRIGHT © {new Date().getFullYear()}, ANKAROM, ALL RIGHTS
            RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}

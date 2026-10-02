"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f3f5f8] px-4 pb-5 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1800px] overflow-hidden rounded-[32px] border border-[#172944] bg-[#061226] text-[#8797bc] shadow-[0_30px_100px_rgba(3,12,28,0.20)] [&_*:not(h2):not(h2_*)]:!text-[#8797bc]">

        {/* =====================================================
            TOP CTA
        ====================================================== */}

        <section className="relative overflow-hidden border-b border-[#1b3150] px-8 py-14 sm:px-12 lg:px-20 lg:py-16">

          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">

            <div className="absolute -right-40 -top-48 h-[500px] w-[700px] rounded-full border border-[#42658f]/20" />

            <div className="absolute -right-32 -top-40 h-[430px] w-[650px] rounded-full border border-[#42658f]/15" />

            <div className="absolute -right-20 -top-32 h-[360px] w-[580px] rounded-full border border-[#42658f]/10" />

            <div className="absolute bottom-[-300px] left-[40%] h-[500px] w-[700px] rounded-full border border-[#42658f]/10" />

          </div>

          <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">

            {/* CTA TEXT */}

            <div className="max-w-3xl">

              <div className="mb-5 flex items-center gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#91add2]">
                  ANKAROM
                </span>

                <span className="h-px w-12 bg-[#7798c5]" />
              </div>

              <h2 className="text-4xl font-medium tracking-[-0.04em] !text-[#ffffff] sm:text-5xl lg:text-[52px] lg:leading-[1.1]">
                Geleceği birlikte{" "}
                <span style={{ color: "#8797bc" }}>
                  inşa edelim.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-[15px] leading-7 text-[#8fa2be] sm:text-base">
                Ürünlerimiz, hizmetlerimiz ve çözümlerimiz hakkında
                detaylı bilgi almak için bizimle iletişime geçebilirsiniz.
              </p>

            </div>

            {/* CTA BUTTON */}

            <Link
              href="https://wa.me/905079586868?text=İyi%20günler,%20hizmetleriniz%20hakkında%20detaylı%20bilgi%20alabilir%20miyim?"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit shrink-0 items-center gap-6 rounded-full bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#071429] transition-all duration-300 hover:bg-[#edf3fc]"
            >
              İletişime Geç

              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M5 12h14M13 6l6 6-6 6"
                />
              </svg>
            </Link>

          </div>
        </section>

        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <section className="px-8 py-16 sm:px-12 lg:px-20 lg:py-20">

          <div className="grid gap-16 lg:grid-cols-12 lg:gap-0">

            {/* =================================================
                BRAND
            ================================================== */}

            <div className="lg:col-span-4 lg:pr-16">

              <Link href="/" className="inline-flex">
                <Image
                  src="/ankarom.png"
                  width={220}
                  height={78}
                  alt="Ankarom"
                  className="h-auto w-[190px] brightness-0 invert"
                />
              </Link>

              <p className="mt-9 max-w-[390px] text-[14px] leading-7 text-[#8fa2be]">
                Gelişmiş teknolojik çözümlerle iş süreçlerinizi
                optimize ediyor, geleceğin standartlarını bugünden
                sunuyoruz.
              </p>

              {/* SOCIALS */}

              <div className="mb-16 mt-9 flex items-center gap-4 lg:mb-0">

                {/* X */}

                {/* <Link
                  href="#"
                  aria-label="X"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#547097] text-[#a9bfdd] transition-all duration-300 hover:border-white hover:bg-white hover:text-[#071429]"
                >
                  <svg
                    className="h-[16px] w-[16px]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </Link> */}

                {/* LINKEDIN */}

                {/* <Link
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#547097] text-[#a9bfdd] transition-all duration-300 hover:border-white hover:bg-white hover:text-[#071429]"
                >
                  <svg
                    className="h-[16px] w-[16px]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24.004.774 23.203 0 22.225 0z" />
                  </svg>
                </Link> */}

                {/* INSTAGRAM */}

                <Link
                  href="https://www.instagram.com/ankarom06/"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#547097] text-[#a9bfdd] transition-all duration-300 hover:border-white hover:bg-white hover:text-[#071429]"
                >
                  <svg
                    className="h-[17px] w-[17px]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.617 6.777 6.978 6.978 1.28.058 1.687.072 4.947.072s3.667-.014 4.947-.072c4.354-.2 6.777-2.617 6.978-6.978.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.2-4.354-2.617-6.777-6.978-6.978C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324z" />
                  </svg>
                </Link>

                {/* FACEBOOK */}

                <Link
                  href="https://www.facebook.com/cihan.gedik.90/"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#547097] text-[#a9bfdd] transition-all duration-300 hover:border-white hover:bg-white hover:text-[#071429]"
                >
                  <svg
                    className="h-[17px] w-[17px]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>

              </div>
            </div>

            {/* =================================================
                NAVIGATION COLUMNS
            ================================================== */}

            <div className="grid grid-cols-2 gap-x-10 gap-y-14 sm:grid-cols-4 lg:col-span-8 [&_a]:inline-block [&_a]:transition-all [&_a:hover]:translate-x-1 [&_a:hover]:text-white">

              {/* KEŞFET */}

              <div className="border-l border-[#1b3150] pl-8 pt-8 lg:pl-10">

                <div className="mb-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#91add2]">
                    Keşfet
                  </h4>

                  <div className="mt-4 h-[2px] w-9 bg-[#6595d0]" />
                </div>

                <ul className="space-y-8">

                  <li>
                    <Link
                      href="/"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Anasayfa
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/urunler"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Ürünler
                    </Link>
                  </li>

                  

                  <li>
                    <Link
                      href="/hakkimizda"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Hakkımızda
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/iletisim"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      İletişim
                    </Link>
                  </li>

                </ul>
              </div>

              {/* ALIŞVERİŞ */}

              <div className="border-l border-[#1b3150] pl-8 pt-8 lg:pl-10">

                <div className="mb-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#91add2]">
                    Alışveriş
                  </h4>

                  <div className="mt-4 h-[2px] w-9 bg-[#6595d0]" />
                </div>

                <ul className="space-y-8">

                  <li>
                    <Link
                      href="/urunler"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Ürün Kataloğu
                    </Link>
                  </li>

                  

                  <li>
                    <Link
                      href="/teslimat"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Teslimat Bilgileri
                    </Link>
                  </li>

                </ul>
              </div>

              {/* YASAL */}

              <div className="border-l border-[#1b3150] pl-8 pt-8 lg:pl-10">

                <div className="mb-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#91add2]">
                    Yasal
                  </h4>

                  <div className="mt-4 h-[2px] w-9 bg-[#6595d0]" />
                </div>

                <ul className="space-y-8">

                  <li>
                    <Link
                      href="/gizlilik-politikasi#gizlilik"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Gizlilik Politikası
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/gizlilik-politikasi#guvenlik"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Güvenlik Politikası
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/iptal-iade"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      İptal & İade
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/mesafeli-satis"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Mesafeli Satış
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/kullanim-sartlari"
                      className="text-[14px] text-[#9caec6] transition-colors hover:text-white"
                    >
                      Kullanım Şartları
                    </Link>
                  </li>

                </ul>
              </div>

              {/* İLETİŞİM */}

              <div className="border-l border-[#1b3150] pl-8 pt-8 lg:pl-10 ">

                <div className="mb-10">
                  <h4 className="text-[10px]  font-bold uppercase tracking-[0.35em] text-[#91add2]">
                    İletişim
                  </h4>

                  <div className="mt-4 h-[2px] w-9 bg-[#6595d0]" />
                </div>

                <div className="space-y-10">

                  <div>
                    <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.25em] text-[#6e86a5]">
                      Telefon
                    </span>

                    <a
                      href="tel:+905079586868"
                      className="text-[14px] text-[#b9c8db] transition-colors hover:text-white"
                    >
                      +90 (507) 958 68 68
                    </a>
                  </div>

                  <div>
                    <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.25em] text-[#6e86a5]">
                      E-posta
                    </span>

                    <a
                      href="mailto:info@ankarom.com"
                      className="text-[14px] text-[#b9c8db] transition-colors hover:text-white"
                    >
                      info@ankarom.com
                    </a>
                  </div>

                  <div>
                    <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.25em] text-[#6e86a5]">
                      Adres
                    </span>

                    <p className="text-[14px] leading-6 text-[#9caec6]">
                      Türkiye / Ankara
                      <br />
                      Hasköy Mahallesi Eczacılar sokak Emek Sokak 3/A Keçiören Ankara
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* =================================================
              BENEFITS / TRUST BAR
          ================================================== */}

            <div className="mt-40 grid gap-x-6 gap-y-8 border-y border-[#1b3150] sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">

            {/* Güvenli */}

            <div className="flex items-center gap-6 border-b border-[#1b3150] py-8 lg:border-b-0 lg:border-r lg:pr-8">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#4e6d96] bg-[#081a32]">

                <svg
                  className="h-5 w-5 text-[#9db9dd]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2V9a8 8 0 10-16 0v10a2 2 0 002 2z"
                  />
                </svg>

              </div>

              <div>
                <p className="text-[13px] font-medium text-[#dce6f3]">
                  Güvenli Alışveriş
                </p>

                <p className="mt-1 text-[11px] text-[#7188a6]">
                  Güvenli ödeme altyapısı
                </p>
              </div>

            </div>

            {/* Teslimat */}

            <div className="flex items-center gap-6 border-b border-[#1b3150] py-8 sm:pl-8 lg:border-b-0 lg:border-r lg:px-8">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#4e6d96] bg-[#081a32]">

                <svg
                  className="h-5 w-5 text-[#9db9dd]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>

              </div>

              <div>
                <p className="text-[13px] font-medium text-[#dce6f3]">
                  Hızlı Teslimat
                </p>

                <p className="mt-1 text-[11px] text-[#7188a6]">
                  Belirtilen sürelerde teslim
                </p>
              </div>

            </div>

            {/* İade */}

            <div className="flex items-center gap-6 border-b border-[#1b3150] py-8 lg:border-b-0 lg:border-r lg:px-8">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#4e6d96] bg-[#081a32]">

                <svg
                  className="h-5 w-5 text-[#9db9dd]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 12a8 8 0 101.7-4.9M4 4v5h5"
                  />
                </svg>

              </div>

              <div>
                <p className="text-[13px] font-medium text-[#dce6f3]">
                  Kolay İade
                </p>

                <p className="mt-1 text-[11px] text-[#7188a6]">
                  İptal ve iade süreçleri
                </p>
              </div>

            </div>

            {/* Destek */}

            <div className="flex items-center gap-6 py-8 lg:px-8 lg:pr-0">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#4e6d96] bg-[#081a32]">

                <svg
                  className="h-5 w-5 text-[#9db9dd]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 13v-1a8 8 0 0116 0v1M4 13a2 2 0 002 2h1v-4H6a2 2 0 00-2 2zm16 0a2 2 0 00-2-2h-1v4h1a2 2 0 002-2zM9 19h6"
                  />
                </svg>

              </div>

              <div>
                <p className="text-[13px] font-medium text-[#dce6f3]">
                  Destek
                </p>

                <p className="mt-1 text-[11px] text-[#7188a6]">
                  Size yardımcı olmak için buradayız
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              BOTTOM BAR
          ================================================== */}

          <div className="flex flex-col gap-6 pt-9 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#91add2]">
                © {currentYear} ANKAROM
              </p>

              <p className="mt-2 text-[11px] text-[#617693]">
                Tüm hakları saklıdır.
              </p>

            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="group flex w-fit items-center gap-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#8fa2be] transition-colors hover:text-white"
            >

              Yukarı Dön

              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4e6d96] transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#071429]">

                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M5 12l7-7 7 7M12 19V5"
                  />
                </svg>

              </span>

            </button>

          </div>

        </section>
      </div>
    </footer>
  );
}
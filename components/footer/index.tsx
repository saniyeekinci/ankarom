"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="fluid w-full px-4 pb-4 pt-0 sm:px-6 lg:px-8">
      <div
        className="mx-auto w-full overflow-hidden border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
        style={{ borderRadius: 44 }}
      >
        <div className="grid gap-12 px-8 py-14 text-slate-700 md:grid-cols-12 md:px-16 lg:px-20 lg:py-16">
          <div className="md:col-span-5 flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/ankarom.png"
                  width={220}
                  height={78}
                  alt="Ankarom"
                  className="h-auto w-auto"
                />
              </Link>
              <p className="mt-10 max-w-md text-[18px] leading-[1.7] text-slate-600">
                Gelişmiş teknolojik çözümlerle iş süreçlerinizi optimize ediyor,
                geleceğin standartlarını bugünden sunuyoruz.
              </p>
            </div>

            <div className="mt-14 flex flex-col gap-8">
              <div className="flex items-center gap-6 text-slate-900">
                <Link href="#" aria-label="X">
                  <svg
                    className="h-7 w-7 text-slate-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </Link>

                <Link href="#" aria-label="LinkedIn">
                  <svg
                    className="h-7 w-7 text-slate-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24.004.774 23.203 0 22.225 0z" />
                  </svg>
                </Link>

                <Link href="#" aria-label="Instagram">
                  <svg
                    className="h-7 w-7 text-slate-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.617 6.777 6.978 6.978 1.28.058 1.687.072 4.947.072s3.667-.014 4.947-.072c4.354-.2 6.777-2.617 6.978-6.978.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.2-4.353-2.617-6.777-6.978-6.978C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </Link>

                <Link href="#" aria-label="Facebook">
                  <svg
                    className="h-7 w-7 text-slate-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex w-fit items-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-slate-700 transition-colors hover:bg-slate-50"
              >
                <svg
                  className="h-4 w-4 text-slate-900"
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

          <div className="md:col-span-7 grid grid-cols-3 gap-18 pt-10 md:pl-20 md:pt-16 lg:gap-32">
            <div>
              <h4 className="mb-14 text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400">
                SITE MAP
              </h4>
              <ul className="space-y-10 text-[16px] font-normal leading-loose text-slate-700">
                <li>
                  <Link
                    href="/"
                    className="border-b border-transparent pb-2 transition-all hover:border-slate-400 hover:text-slate-900"
                  >
                    Anasayfa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/urunler"
                    className="border-b border-transparent pb-2 transition-all hover:border-slate-400 hover:text-slate-900"
                  >
                    Ürünler
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hakkimizda"
                    className="border-b border-transparent pb-2 transition-all hover:border-slate-400 hover:text-slate-900"
                  >
                    Hakkımızda
                  </Link>
                </li>
                
              </ul>
            </div>

            <div>
              <h4 className="mb-14 text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400">
                LEGAL
              </h4>
              <ul className="space-y-10 text-[16px] font-normal leading-loose text-slate-700">
                <li>
                  <Link
                    href="#"
                    className="border-b border-transparent pb-2 transition-all hover:border-slate-400 hover:text-slate-900"
                  >
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="border-b border-transparent pb-2 transition-all hover:border-slate-400 hover:text-slate-900"
                  >
                    Kullanım Şartları
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-14 text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400">
                İLETİŞİM
              </h4>
              <ul className="space-y-10 text-[16px] font-normal leading-loose text-slate-700">
                <li className="border-b border-transparent pb-2 transition-all hover:border-slate-400 hover:text-slate-900">
                  <span>adres</span>
                </li>
                <li className="border-b border-transparent pb-2 transition-all hover:border-slate-400 hover:text-slate-900">
                  <span>telefon</span>
                </li>
                <li className="border-b border-transparent pb-2 transition-all hover:border-slate-400 hover:text-slate-900">
                  <span>email</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white py-4 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
          COPYRIGHT © {new Date().getFullYear()}, ANKAROM, ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
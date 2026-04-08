"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";


const whatsappHref = "https://wa.me/905065440466?text=İyi%20günler,%20hizmetleriniz%20hakkında%20detaylı%20bilgi%20alabilir%20miyim?";

const menuLinks = [
  { name: "Hakkımızda", href: "/hakkimizda" },
];

const productLinks = [
  { name: "Araç Römorkları", href: "/urunler?category=arac-romorklari" },
  { name: "Platform Römorklar", href: "/urunler?category=platform-romorklar" },
  {
    name: "Kapalı Kasa Römorklar",
    href: "/urunler?category=kapali-kasa-romorklar",
  },
  {
    name: "Özel Üretim Römorklar",
    href: "/urunler?category=ozel-uretim-romorklar",
  },
  {
    name: "Yedek Parça ve Ekipman",
    href: "/urunler?category=yedek-parca-ve-ekipman",
  },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
      <header
          className={`fluid sticky top-0 z-40 w-full transition-all duration-300 ${
              isScrolled
                  ? "border-b border-slate-200/60 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                  : "border-b border-transparent bg-white/80 backdrop-blur-md"
          }`}
      >
        {/* Premium top accent line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600/80 to-transparent" />

        <div className="mx-auto flex h-20 w-full max-w-360 items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Logo - Boyut ve Boşluk Düzenlemesi */}
          <Link
              href="/"
              className="group relative flex items-center py-1 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative">
              <Image
                  src="/ankarom.png"
                  width={110} // Genişlik küçültüldü
                  height={34}  // Yükseklik küçültüldü
                  alt="Ankarom"
                  priority
                  className="brand-mark h-auto object-contain transition-all duration-300 group-hover:brightness-[0.25]"
              />
            </div>
          </Link>

          {/* Desktop Navigation - gap-2 yapıldı */}
          <nav className="hidden items-center gap-2 lg:flex">
            {/* Catalog Dropdown */}
            <div className="group relative">
              <button
                  type="button"
                  className="relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-blue-700"
              >
                <span>Katalog</span>
                <ChevronDownIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                {/* Active indicator */}
                <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-8" />
              </button>

              {/* Dropdown Menu */}
              <div className="pointer-events-none absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3 opacity-0 invisible translate-y-3 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/98 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                  {/* Dropdown header accent */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />

                  <div className="p-5 pt-6">
                    <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                      Ürün Kategorileri
                      <span className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent" />
                    </p>
                    <div className="grid gap-1">
                      {productLinks.map((link, index) => (
                          <Link
                              key={link.name}
                              href={link.href}
                              className="group/item relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent hover:text-blue-700"
                              style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-slate-200 transition-all duration-200 group-hover/item:bg-blue-500 group-hover/item:scale-125" />
                            <span>{link.name}</span>
                            <svg
                                className="ml-auto h-4 w-4 -translate-x-2 text-slate-300 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:text-blue-500 group-hover/item:opacity-100"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Menu Links */}
            {menuLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="group relative rounded-xl px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-blue-700"
                >
                  <span>{link.name}</span>
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-8" />
                </Link>
            ))}

            {/* CTA Button */}
            <Link
                href={whatsappHref}
                target="_blank"
                className="ml-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] hover:-translate-y-0.5"
            >
              <span className="!text-white">Teklif Al</span>
              <svg className="h-4 w-4" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
              aria-label="Mobil menüyü aç"
          >
            <span className="sr-only">Menü</span>
            {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
            ) : (
                <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
            className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? "visible" : "invisible"}`}
        >
          {/* Backdrop */}
          <button
              type="button"
              aria-label="Mobil menüyü kapat"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsProductsOpen(false);
              }}
              className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
                  isMobileMenuOpen ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Mobile Menu Panel */}
          <div
              className={`fixed right-0 top-0 flex h-screen w-[85%] max-w-sm flex-col bg-white shadow-[-20px_0_60px_rgba(15,23,42,0.15)] transition-transform duration-300 ease-out ${
                  isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            {/* Mobile Header - Logo küçültüldü */}
            <div className="relative flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-0.5">
                <Image
                    src="/ankarom.png"
                    width={90} // Mobil logo daha da küçültüldü
                    height={28}
                    alt="Ankarom"
                    className="brand-mark h-auto object-contain"
                />
              </Link>
              <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <nav className="flex flex-col gap-3">
                {/* Catalog Accordion */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white">
                  <button
                      type="button"
                      onClick={() => setIsProductsOpen(!isProductsOpen)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                  <span className="text-sm font-bold uppercase tracking-[0.12em] text-slate-800">
                    Katalog
                  </span>
                    <ChevronDownIcon
                        className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                            isProductsOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <div
                      className={`grid transition-all duration-300 ease-out ${
                          isProductsOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-100 px-3 py-3">
                        {productLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                              {link.name}
                            </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Links */}
                {menuLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {link.name}
                    </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Footer CTA */}
            <div className="border-t border-slate-100 p-6">
              <Link
                  href={whatsappHref}
                  target="_blank"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all hover:from-blue-700 hover:to-blue-800"
              >
                <span className="!text-white">Teklif Al</span>
                <svg className="h-4 w-4" fill="none" stroke="white " viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>
  );
}
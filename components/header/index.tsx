"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";


const whatsappHref = "https://wa.me/905079586868?text=İyi%20günler,%20hizmetleriniz%20hakkında%20detaylı%20bilgi%20alabilir%20miyim?";

const menuLinks = [
  { name: "Hakkımızda", href: "/hakkimizda" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              scroll={true}
              onClick={handleLogoClick}
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
            {/* Katalog Link */}
            <Link
                href="/urunler"
                className="group relative inline-flex items-center rounded-xl px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-blue-700"
            >
              <span>Katalog</span>
              <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-8" />
            </Link>

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
              <Link
                  href="/"
                  scroll={true}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogoClick();
                  }}
                  className="py-0.5"
              >
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
                {/* Katalog Link */}
                <Link
                    href="/urunler"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Katalog
                </Link>

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
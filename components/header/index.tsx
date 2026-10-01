"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/components/cart/CartProvider";

const whatsappHref =
  "https://wa.me/905079586868?text=İyi%20günler,%20hizmetleriniz%20hakkında%20detaylı%20bilgi%20alabilir%20miyim?";

const menuLinks = [
  { name: "Katalog", href: "/urunler" },
  { name: "Hakkımızda", href: "/hakkimizda" },
];

export default function Header() {
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "border-b border-[#e8e5df]/90 bg-[#fcfcfb]/95 shadow-[0_8px_30px_rgba(30,27,22,0.05)] backdrop-blur-xl"
          : "border-b border-[#e8e5df]/60 bg-[#fcfcfb]/90 backdrop-blur-md"
      }`}
    >
      {/* İnce üst çizgi */}
      <div className="absolute inset-x-0 top-0 h-px bg-[#d8d3ca]" />

      <div className="mx-auto flex h-[82px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-16">

        {/* =====================================================
            LOGO
        ===================================================== */}
        <Link
          href="/"
          scroll={true}
          onClick={handleLogoClick}
          className="group relative flex items-center"
          aria-label="Ankarom Ana Sayfa"
        >
          <Image
            src="/ankarom.png"
            width={120}
            height={38}
            alt="Ankarom"
            priority
            className="h-auto w-[105px] object-contain transition-opacity duration-300 group-hover:opacity-70 sm:w-[115px]"
          />
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}
        <nav className="hidden items-center lg:flex">

          {menuLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className={`group relative px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#5d5953] transition-colors duration-300 hover:text-[#171717] ${
                index === 0 ? "ml-2" : ""
              }`}
            >
              {link.name}

              <span className="absolute bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#171717] transition-all duration-300 group-hover:w-7" />
            </Link>
          ))}

          {/* Ayırıcı */}
          <div className="mx-5 h-5 w-px bg-[#ddd9d2]" />

          {/* Sepet */}
          <Link
            href="/sepet"
            className="group flex items-center gap-2.5 px-3 py-3 text-[#5d5953] transition-colors duration-300 hover:text-[#171717]"
            aria-label="Sepet"
          >
            <span className="relative">
              <ShoppingBagIcon className="h-[19px] w-[19px] stroke-[1.4]" />

              <span className="absolute -right-2 -top-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full border border-[#d8d3ca] bg-white px-1 text-[8px] font-medium text-[#171717]">
                {itemCount}
              </span>
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.15em]">
              Sepet
            </span>
          </Link>

          {/* Teklif Al */}
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group ml-5 inline-flex items-center gap-4 border border-[#d8d3ca] bg-white px-5 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#24211e] transition-all duration-300 hover:border-[#aaa49c] hover:bg-[#EFF6FF]"
          >
            <span>Teklif Al</span>

            <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center border border-[#ddd9d2] text-[#393632] transition-all duration-300 hover:border-[#aaa49c] lg:hidden"
          aria-label="Mobil menüyü aç"
          aria-expanded={isMobileMenuOpen}
        >
          <Bars3Icon className="h-5 w-5 stroke-[1.4]" />
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={closeMobileMenu}
          className={`absolute inset-0 bg-[#171717]/20 backdrop-blur-[3px] transition-opacity duration-500 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-[430px] flex-col bg-[#fcfcfb] shadow-[-20px_0_60px_rgba(30,27,22,0.10)] transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >

          {/* Mobile Header */}
          <div className="flex h-[82px] items-center justify-between border-b border-[#e7e3dc] px-6 sm:px-8">

            <Link
              href="/"
              onClick={() => {
                closeMobileMenu();
                handleLogoClick();
              }}
            >
              <Image
                src="/ankarom.png"
                width={105}
                height={34}
                alt="Ankarom"
                className="h-auto w-[100px] object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="flex h-10 w-10 items-center justify-center border border-[#ddd9d2] text-[#5e5953] transition-colors hover:border-[#aaa49c] hover:text-[#171717]"
              aria-label="Menüyü kapat"
            >
              <XMarkIcon className="h-5 w-5 stroke-[1.4]" />
            </button>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto px-6 py-10 sm:px-8">

            {/* Küçük başlık */}
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-7 bg-[#bcb6ad]" />

              <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#98928a]">
                ANKAROM
              </span>
            </div>

            {/* Menü */}
            <nav className="border-t border-[#e5e1da]">

              {menuLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between border-b border-[#e5e1da] py-6"
                >
                  <div className="flex items-center gap-5">

                    <span className="text-[9px] font-medium tracking-[0.2em] text-[#aaa49f]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[14px] font-medium uppercase tracking-[0.16em] text-[#3d3935] transition-colors group-hover:text-[#171717]">
                      {link.name}
                    </span>

                  </div>

                  <ArrowUpRightIcon className="h-4 w-4 text-[#aaa49f] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#171717]" />
                </Link>
              ))}

              {/* Sepet */}
              <Link
                href="/sepet"
                onClick={closeMobileMenu}
                className="group flex items-center justify-between border-b border-[#e5e1da] py-6"
              >
                <div className="flex items-center gap-5">

                  <span className="text-[9px] font-medium tracking-[0.2em] text-[#aaa49f]">
                    03
                  </span>

                  <span className="text-[14px] font-medium uppercase tracking-[0.16em] text-[#3d3935]">
                    Sepet
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <span className="flex h-5 min-w-5 items-center justify-center bg-[#171717] px-1 text-[9px] text-white">
                    {itemCount}
                  </span>

                  <ShoppingBagIcon className="h-4 w-4 text-[#aaa49f]" />

                </div>
              </Link>

            </nav>

            {/* Mobil bilgi */}
            <div className="mt-12">

              <p className="text-[10px] uppercase tracking-[0.2em] text-[#a09a92]">
                Taşıma Çözümleri
              </p>

              <p className="mt-4 max-w-[300px] text-[13px] leading-7 text-[#77716a]">
                Güvenilir, dayanıklı ve ihtiyaca yönelik römork çözümleri.
              </p>

            </div>
          </div>

          {/* Mobile CTA */}
          <div className="border-t border-[#e5e1da] p-6 sm:p-8">

            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="group flex w-full items-center justify-between bg-[#24211e] px-5 py-4 text-white transition-colors duration-300 hover:bg-[#3a3631]"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
                Teklif Al
              </span>

              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <p className="mt-4 text-center text-[9px] uppercase tracking-[0.15em] text-[#aaa49f]">
              WhatsApp üzerinden iletişime geçin
            </p>

          </div>
        </div>
      </div>
    </header>
  );
}
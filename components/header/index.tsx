"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";

const menuLinks = [
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "İletişim", href: "/iletisim" },
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const logoHref = isAuthenticated ? "/hesabim" : "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/88 backdrop-blur-xl shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <div className="mx-auto flex h-20 w-full max-w-360 items-center justify-between px-4 md:px-10 lg:px-12">
        <Link href={logoHref} className="flex items-center gap-3">
          <Image
            src="/ankarom.png"
            width={118}
            height={36}
            alt="Ankarom"
            priority
            className="brand-mark h-auto w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-700 transition-colors hover:text-blue-700"
            >
              Katalog
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="pointer-events-none absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4 opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                <p className="px-2 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Ürün Kategorileri
                </p>
                <div className="grid gap-1">
                  {productLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {menuLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-700 transition-colors hover:text-blue-700"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sepetlerim"
            className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700 sm:inline-flex"
            aria-label="Sepetlerim"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-slate-100 bg-white px-1 text-[11px] font-bold text-blue-600 shadow-sm">
              {itemCount}
            </span>
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                href="/giris"
                className="hidden items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm  transition-colors hover:bg-slate-50 sm:inline-flex"
                style={{ color: "#000000" }}
              >
                Giriş Yap
              </Link>
              {/* Yeşil ve oklu yeni Kayıt Ol butonu (Masaüstü) */}
              <Link
                href="/kayit"
                className="hidden items-center justify-center gap-2 rounded-lg bg-[#16a34a] px-6 py-2.5 text-sm font-bold shadow-lg shadow-green-600/30 transition-all hover:-translate-y-0.5 hover:bg-[#15803d] hover:shadow-green-700/40 sm:inline-flex"
                style={{ color: "#ffffff" }}
              >
                <span style={{ color: "#ffffff" }}>Kayıt Ol</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#ffffff"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </>
          ) : (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-600" />
                <span>{user?.name}</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-13 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
                  <Link
                    href="/hesabim"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700"
                  >
                    Hesabım
                  </Link>
                  <Link
                    href="/sepetlerim"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700"
                  >
                    Sepetim
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin/urun-ekle"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-50"
                    >
                      Admin Paneli
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="mt-1 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
            aria-label="Mobil menüyü aç"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? "visible" : "invisible"}`}
      >
        <button
          type="button"
          aria-label="Mobil menüyü kapat"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProductsOpen(false);
          }}
          className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-200 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
        />

        <div
          className={`fixed right-0 top-0 flex h-screen w-[88%] max-w-96 flex-col border-l border-slate-200 bg-white shadow-[-16px_0_48px_rgba(15,23,42,0.12)] transition-transform duration-200 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <Link href={logoHref} onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src="/ankarom.png"
                width={100}
                height={30}
                alt="Ankarom"
                className="brand-mark"
              />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <nav className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-800"
              >
                Katalog
                <svg
                  className={`h-4 w-4 transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 ${isProductsOpen ? "max-h-72" : "max-h-0"}`}
              >
                <div className="grid gap-1 p-2">
                  {productLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {menuLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/sepetlerim"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
              >
                <span>Sepetim</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {itemCount}
                </span>
              </Link>

              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/giris"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm  transition-colors hover:bg-slate-50"
                    style={{ color: "#000000" }}
                  >
                    Giriş Yap
                  </Link>
                  {/* Yeşil ve oklu yeni Kayıt Ol butonu (Mobil) */}
                  <Link
                    href="/kayit"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16a34a] px-4 py-3 text-sm font-bold shadow-lg shadow-green-600/30 transition-colors hover:bg-[#15803d]"
                    style={{ color: "#ffffff" }}
                  >
                    <span style={{ color: "#ffffff" }}>Kayıt Ol</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#ffffff"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/hesabim"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Hesabım
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600"
                  >
                    Çıkış Yap
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

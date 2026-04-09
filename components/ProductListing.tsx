"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/products";

type ProductListingProps = {
  products: Product[];
  showViewToggle?: boolean;
};

export default function ProductListing({
  products,
  showViewToggle = true,
}: ProductListingProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDefaultFeatures = () => [
    "Yüksek dayanım sunan güçlendirilmiş şasi yapısı",
    "Uzun ömürlü kullanım için kaliteli malzeme seçimi",
    "Profesyonel taşımacılığa uygun dengeli platform mimarisi",
    "Ankarom satış sonrası destek ekibiyle güvenli operasyon",
  ];

  return (
    <div className="w-full">
      {/* Görünüm Toggle'ı (ViewMode Butonları) */}
      {showViewToggle && (
        <div className="mb-6 flex justify-end">
          <div className="inline-flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-blue-600"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
              aria-label="Grid view"
              title="Grid Görünümü"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-blue-600"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
              aria-label="List view"
              title="Liste Görünümü"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Ürün sayacı */}
      <div className="mb-6 text-sm font-medium text-slate-500">
        <span className="font-semibold text-slate-900">{products.length}</span> ürün gösteriliyor
      </div>

      {/* Ürünler - Grid/List Görünüm */}
      {products.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-6"
          }
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={`group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg ${
                viewMode === "grid"
                  ? "flex-col"
                  : "flex-col sm:flex-row"
              }`}
            >
              {/* Resim/İkon Alanı */}
              <Link
                href={`/urunler/${product.id}`}
                className={`relative flex shrink-0 items-center justify-center bg-slate-100 transition-colors hover:bg-slate-200 ${
                  viewMode === "grid"
                    ? "h-56"
                    : "h-56 sm:w-72 sm:h-auto"
                }`}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-20 w-20 text-slate-300 transition-colors group-hover:text-slate-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 7h-3V6a4 4 0 00-8 0v1H5a2 2 0 00-2 2v7a2 2 0 002 2h1.1a3 3 0 005.8 0h4.2a3 3 0 005.8 0H21a2 2 0 002-2V9a2 2 0 00-2-2zM10 6a2 2 0 014 0v1h-4V6zm-2 12a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                )}
              </Link>

              {/* İçerik Alanı */}
              <div
                className={`flex flex-1 flex-col p-6 ${
                  viewMode === "list" ? "justify-center" : ""
                }`}
              >
                <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {product.capacity || "Kapasite: Belirtilmemiş"}
                </span>

                <Link
                  href={`/urunler/${product.id}`}
                  className="mb-4 line-clamp-2 text-base font-semibold leading-snug text-slate-900 transition-colors hover:text-blue-600"
                >
                  {product.name}
                </Link>

                {product.description && (
                  <p className="mb-4 text-sm text-slate-600 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Fiyat Bilgisi */}
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-slate-900">
                    {formatPrice(
                      product.discountPrice ?? product.price
                    )}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm font-medium text-slate-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Detay ve Ok Butonu */}
                <div className="mt-auto flex items-end justify-end">

                  {/* Yönlendirme Oku Butonu */}
                  <Link
                    href={`/urunler/${product.id}`}
                    className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-sm transition-colors hover:bg-blue-700"
                  >
                    <ArrowRightIcon className="h-5 w-5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
          <p className="text-slate-500">Gösterilecek ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

import React from "react";
import Link from "next/link";
import ProductListing from "@/components/ProductListing";
import Breadcrumb from "@/components/Breadcrumb";
import { products } from "@/lib/products";

export const metadata = {
  title: "Ürün Kataloğu - Ankarom",
  description:
    "Profesyonel taşıma çözümleri için tasarlanmış, yüksek dayanımlı araç römorku ve ekipman serimizi inceleyin.",
};

export default function ProductsPage() {
  // Ürünleri merkezi kaynaktan al
  const allProducts = products;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-8xl mx-auto px-6 py-4 lg:px-12">
          <Breadcrumb
            items={[
              { label: "Ana Sayfa", href: "/" },
              { label: "Ürünler" }
            ]}
          />
        </div>
      </div>

      {/* Üst Başlık Bölümü */}
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-8xl px-6 py-10 lg:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            {/* Başlık ve Açıklama */}
            <div>
              <h1 className="mb-3 text-4xl font-bold text-slate-900">
                Ürün <span className="text-blue-600">Kataloğu</span>
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                Profesyonel taşıma çözümleri için tasarlanmış, yüksek dayanımlı
                araç römorku ve ekipman serimizi inceleyin.
              </p>
            </div>

            {/* İstatistikler */}
            <div className="flex items-center gap-6 py-4 text-center md:gap-10">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-slate-900">
                  {allProducts.length}
                </span>
                <span className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-slate-400">
                  ÜRÜN
                </span>
              </div>
              
            </div>
          </div>
        </div>
      </header>

      {/* Ana Ürün Alanı */}
      <main className="mx-auto max-w-[1600px] px-6 py-8 lg:px-12">
        <ProductListing products={allProducts} showViewToggle={true} />
      </main>
    </div>
  );
}
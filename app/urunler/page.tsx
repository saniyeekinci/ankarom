import React from "react";
import ProductListing from "@/components/ProductListing";
import Breadcrumb from "@/components/Breadcrumb";
import { getCatalogOnlyProducts } from "@/lib/products";

export const metadata = {
  title: "Ürün Kataloğu - Ankarom",
  description:
    "Profesyonel taşıma çözümleri için tasarlanmış, yüksek dayanımlı araç römorku ve ekipman serimizi inceleyin.",
};



export default function ProductsPage() {
  // Sadece katalog ürünlerini alıyoruz
  const catalogProducts = getCatalogOnlyProducts();

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

      {/* Ana Ürün Alanı (Üst Başlık ve Sayaç Kaldırıldı) */}
      <main className="mx-auto max-w-7xlx-6 py-8 lg:px-12">
        <ProductListing products={catalogProducts} />
      </main>
    </div>
  );
}
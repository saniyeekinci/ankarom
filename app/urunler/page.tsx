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
      <div className="border-b border-[#e6e3dc] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-12">
          <Breadcrumb
            items={[
              { label: "Ana Sayfa", href: "/" },
              { label: "Ürünler" }
            ]}
          />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12 lg:py-14">
        <ProductListing products={catalogProducts} />
      </main>
    </div>
  );
}
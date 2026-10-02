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
    <div className="min-h-screen bg-[#f5f4ef] text-[#202522]">
      {/* Navigation Breadcrumb */}
      <div className="border-b border-[#e2e0d9] bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-7xl justify-center px-5 py-4 sm:px-8 lg:px-10" style={{ marginInline: "auto" }}>
          <Breadcrumb
            items={[
              { label: "Ana Sayfa", href: "/" },
              { label: "Ürünler" }
            ]}
          />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14" style={{ marginInline: "auto" }}>
        <ProductListing products={catalogProducts} />
      </main>
    </div>
  );
}
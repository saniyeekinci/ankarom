import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductListing from "@/components/ProductListing";
import {
  products,
  getProductsByCategory,
  categoryLabels,
  getAllCategories,
  type ProductCategory,
} from "@/lib/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// Statik rotalar oluştur (SSG optimizasyonu)
export async function generateStaticParams() {
  return getAllCategories().map((category) => ({
    slug: category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryLabel =
    categoryLabels[slug as ProductCategory] || "Kategori";

  return {
    title: `${categoryLabel} - Ankarom Ürün Kataloğu`,
    description: `${categoryLabel} kategorisinde tüm ürünleri inceleyin. Profesyonel taşıma çözümleri.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Kategori slug'ı doğrula
  if (!categoryLabels[slug as ProductCategory]) {
    notFound();
  }

  const categoryKey = slug as ProductCategory;
  const categoryLabel = categoryLabels[categoryKey];
  const categoryProducts = getProductsByCategory(categoryKey);

  // Kategori varsa ancak ürün yoksa
  if (categoryProducts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
        <header className="border-b border-slate-200">
          <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-12">
            <nav className="mb-4 flex gap-2 text-sm text-slate-500">
              <Link
                href="/"
                className="transition-colors hover:text-blue-600"
              >
                Ana Sayfa
              </Link>
              <span className="text-slate-300">›</span>
              <Link
                href="/urunler"
                className="transition-colors hover:text-blue-600"
              >
                Ürünler
              </Link>
              <span className="text-slate-300">›</span>
              <span className="font-medium text-slate-900">{categoryLabel}</span>
            </nav>
            <h1 className="mb-3 text-4xl font-bold text-slate-900">
              {categoryLabel}
            </h1>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-6 py-12 lg:px-12">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-24 text-center">
            <p className="mb-4 text-lg font-semibold text-slate-600">
              Bu kategoride henüz ürün yok.
            </p>
            <Link
              href="/urunler"
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Tüm Ürünleri Gör
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const inStock = categoryProducts.filter(
    (p) => p.stockStatus === "Stokta Var"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      {/* Üst Başlık Bölümü */}
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            {/* Başlık ve Açıklama */}
            <div>
              <nav className="mb-4 flex gap-2 text-sm text-slate-500">
                <Link
                  href="/"
                  className="transition-colors hover:text-blue-600"
                >
                  Ana Sayfa
                </Link>
                <span className="text-slate-300">›</span>
                <Link
                  href="/urunler"
                  className="transition-colors hover:text-blue-600"
                >
                  Ürünler
                </Link>
                <span className="text-slate-300">›</span>
                <span className="font-medium text-slate-900">
                  {categoryLabel}
                </span>
              </nav>
              <h1 className="mb-3 text-4xl font-bold text-slate-900">
                {categoryLabel}
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                {categoryLabel} kategorisinde tüm ürünlerimizi inceleyin.
                Profesyonel taşıma çözümleri için tasarlanmış, yüksek
                dayanımlı ürünler.
              </p>
            </div>

            {/* İstatistikler */}
            <div className="flex items-center gap-6 py-4 text-center md:gap-10">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-slate-900">
                  {categoryProducts.length}
                </span>
                <span className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-slate-400">
                  ÜRÜN
                </span>
              </div>
              <div className="h-12 w-[1px] bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-slate-900">
                  {inStock}
                </span>
                <span className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-slate-400">
                  STOKTA
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Ana Ürün Alanı */}
      <main className="mx-auto max-w-[1600px] px-6 py-8 lg:px-12">
        <ProductListing products={categoryProducts} showViewToggle={true} />
      </main>
    </div>
  );
}

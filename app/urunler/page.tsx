import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { trailerProducts } from "@/lib/trailerProducts";
import { mapBackendProductToTrailerProduct, type BackendProduct } from "@/lib/productMapper";
import ProductsGridWithFavorites from "@/components/ProductsGridWithFavorites";

const categoryLabels: Record<string, string> = {
  "arac-romorklari": "Araç Römorkları",
  "platform-romorklar": "Platform Römorklar",
  "kapali-kasa-romorklar": "Kapalı Kasa Römorklar",
  "ozel-uretim-romorklar": "Özel Üretim Römorklar",
  "yedek-parca-ve-ekipman": "Yedek Parça ve Ekipman",
};

const getLiveProducts = async () => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    // Ürün eklediğin an sayfada görebilmen için cache'i kapatıyoruz
    const response = await fetch(`${backendUrl}/api/products`, {
      cache: "no-store", 
    });

    if (!response.ok) {
      return trailerProducts;
    }

    const data = (await response.json()) as BackendProduct[] | { products?: BackendProduct[] };
    
    // Backend'den gelen veri direkt dizi (array) mi yoksa { products: [...] } formatında mı kontrol ediyoruz
    const productsList: BackendProduct[] | undefined = Array.isArray(data) ? data : data.products;

    if (!productsList || productsList.length === 0) {
      return trailerProducts;
    }

    return productsList.map(mapBackendProductToTrailerProduct);
  } catch {
    return trailerProducts;
  }
};

type ProductsPageProps = {
  searchParams?: { category?: string };
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getLiveProducts();
  const activeCategoryLabel = searchParams?.category ? categoryLabels[searchParams.category] ?? "Kurumsal Ürün Kataloğu" : "Kurumsal Ürün Kataloğu";

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-28 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="flex gap-14 flex-col relative mx-auto w-full max-w-360">
        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:mb-10 sm:p-8">
          <div className="flex gap-14 items-start justify-between ">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{activeCategoryLabel}</p>
              <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Ürün Listesi</h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
                Yüksek dayanım, premium işçilik ve profesyonel taşıma ihtiyaçları için geliştirilen araç römorku çözümlerini keşfedin.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Geri
            </Link>
          </div>
        </div>

        <ProductsGridWithFavorites products={products} />
      </div>
    </section>
  );
}

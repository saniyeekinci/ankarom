import Image from "next/image";
import Link from "next/link";
import { HeartIcon, TruckIcon, StarIcon } from "@heroicons/react/24/outline";
import { trailerProducts } from "@/lib/trailerProducts";
import { mapBackendProductToTrailerProduct, type BackendProduct } from "@/lib/productMapper";

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

export default async function ProductsPage() {
  const products = await getLiveProducts();

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-28 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-360">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Premium Trailer Collection</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Ürün Listesi</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
            Yüksek dayanım, premium işçilik ve profesyonel taşıma ihtiyaçları için geliştirilen araç römorku çözümlerini keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/75 to-slate-950/80 p-3 shadow-[0_18px_50px_rgba(2,6,23,0.5)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <button
                type="button"
                aria-label="Favoriye ekle"
                className="absolute right-5 top-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-900/75 text-slate-200 transition-colors hover:bg-slate-800"
              >
                <HeartIcon className="h-4 w-4" />
              </button>

              <Link href={`/urunler/${product.id}`} className="block overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/65 to-transparent" />
                </div>
              </Link>

              <div className="px-1 pb-2 pt-4">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <TruckIcon className="h-4 w-4" />
                  <span>{product.deliveryText}</span>
                </div>

                <Link href={`/urunler/${product.id}`} className="block">
                  <h2 className="line-clamp-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-cyan-200">
                    {product.name}
                  </h2>
                </Link>

                <div className="mt-3 flex items-center gap-1.5 text-amber-300">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <StarIcon key={`${product.id}-star-${idx}`} className={`h-4 w-4 ${idx < product.rating ? "fill-amber-300" : "text-slate-600"}`} />
                  ))}
                  <span className="ml-1 text-xs text-slate-400">({product.reviewCount})</span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xl font-extrabold text-white">{product.currentPrice}</p>
                    <p className="mt-1 text-xs text-slate-500 line-through">{product.oldPrice}</p>
                  </div>
                  <span className="rounded-full border border-orange-300/40 bg-linear-to-r from-rose-500/20 to-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-300">
                    %{product.discountPercent}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

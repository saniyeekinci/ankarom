import { notFound } from "next/navigation";
import ProductListing from "@/components/ProductListing";
import {
  getProductsByCategory,
  categoryLabels,
  getAllCategories,
  type ProductCategory,
} from "@/lib/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// Bu fonksiyon Vercel'in sayfaları önceden oluşturmasını sağlar
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((slug) => ({
    slug: slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Eğer gelen slug geçerli bir kategori değilse 404 göster
  if (!Object.keys(categoryLabels).includes(slug)) {
    notFound();
  }

  const categoryTitle = categoryLabels[slug as ProductCategory];
  const categoryProducts = getProductsByCategory(slug);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
            {categoryTitle}
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Ankarom kalitesiyle üretilen yüksek dayanımlı {categoryTitle.toLowerCase()} serimiz.
          </p>
        </div>

        <ProductListing products={categoryProducts} />
      </div>
    </div>
  );
}
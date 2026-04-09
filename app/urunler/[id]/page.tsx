import ProductDetailExperience from "@/components/ProductDetailExperience";
import { getProductById } from "@/lib/products";
import { notFound } from "next/navigation";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  // Merkezi ürün veritabanından ürün al
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailExperience product={product} />;
}

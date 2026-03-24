import ProductDetailExperience from "@/components/ProductDetailExperience";
import { getTrailerProductById } from "@/lib/trailerProducts";
import { notFound } from "next/navigation";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = getTrailerProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailExperience product={product} />;
}

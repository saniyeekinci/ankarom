import ProductDetailExperience from "@/components/ProductDetailExperience";
import { getTrailerProductById } from "@/lib/trailerProducts";
import { mapBackendProductToTrailerProduct, type BackendProduct } from "@/lib/productMapper";
import { notFound } from "next/navigation";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  let product = getTrailerProductById(id);

  if (!product) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/products/${id}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const data = (await response.json()) as BackendProduct | { product?: BackendProduct };
        const backendProduct = "product" in data ? data.product : data;

        if (backendProduct?._id) {
          product = mapBackendProductToTrailerProduct(backendProduct);
        }
      }
    } catch {
      product = undefined;
    }
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailExperience product={product} />;
}

import type { Product, ProductCategory } from "@/lib/products";

export type BackendProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  stock?: number;
  imageUrl?: string;
  deliveryInfo?: string;
  category?: string;
  features?: string[];
};

const defaultFeatures = [
  "Yüksek dayanım sunan güçlendirilmiş şasi yapısı",
  "Uzun ömürlü kullanım için kaliteli malzeme seçimi",
  "Profesyonel taşımacılığa uygun dengeli platform mimarisi",
  "Ankarom satış sonrası destek ekibiyle güvenli operasyon",
];

const resolveSafeImage = (imageUrl?: string) => {
  if (!imageUrl) return "/products/fleet-management-v2.jpg";
  if (imageUrl.startsWith("/")) return imageUrl;

  try {
    const parsed = new URL(imageUrl);
    const allowedDomains = ["upload.wikimedia.org"];
    if (allowedDomains.includes(parsed.hostname)) {
      return imageUrl;
    }
  } catch {
    return "/products/fleet-management-v2.jpg";
  }

  return "/products/fleet-management-v2.jpg";
};

export const mapBackendProductToProduct = (product: BackendProduct): Product => {
  const normalizedFeatures = Array.isArray(product.features)
    ? product.features.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];

  return {
    id: product._id,
    name: product.name,
    slug: product._id,
    // "any" sildik, yerine "ProductCategory" kullandık
    category: (product.category as ProductCategory) || "tekne-romorklari",
    price: product.price || 0,
    discountPrice: product.discountPrice ?? null,
    stockStatus: "Stokta Var",
    imageUrl: resolveSafeImage(product.imageUrl),
    images: [],
    description: product.description?.trim() || `${product.name} modeli, güvenli ve dayanıklı kullanım için tasarlanmıştır.`,
    features: normalizedFeatures.length > 0 ? normalizedFeatures : defaultFeatures,
  };
};
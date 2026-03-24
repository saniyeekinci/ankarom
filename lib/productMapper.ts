import type { TrailerProduct } from "@/lib/trailerProducts";

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

const formatTry = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

const defaultFeatures = [
  "Yüksek dayanım sunan güçlendirilmiş şasi yapısı",
  "Uzun ömürlü kullanım için kaliteli malzeme seçimi",
  "Profesyonel taşımacılığa uygun dengeli platform mimarisi",
  "Ankarom satış sonrası destek ekibiyle güvenli operasyon",
];

const resolveSafeImage = (imageUrl?: string) => {
  if (!imageUrl) {
    return "/products/fleet-management-v2.jpg";
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

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

export const mapBackendProductToTrailerProduct = (product: BackendProduct): TrailerProduct => {
  const hasDiscount =
    typeof product.discountPrice === "number" &&
    product.discountPrice >= 0 &&
    product.discountPrice < product.price;

  const currentPriceNumber = hasDiscount ? Number(product.discountPrice) : Number(product.price);
  const oldPriceNumber = hasDiscount ? Number(product.price) : Number(product.price);

  const discountPercent = hasDiscount
    ? Math.round(((oldPriceNumber - currentPriceNumber) / oldPriceNumber) * 100)
    : 0;

  const normalizedDeliveryText =
    product.deliveryInfo === "Ücretsiz Teslimat" ? "Ücretsiz Teslimat" : "Stokta Var";

  const normalizedFeatures = Array.isArray(product.features)
    ? product.features
        .map((item) => String(item ?? "").trim())
        .filter(Boolean)
    : [];

  return {
    id: product._id,
    name: product.name,
    image: resolveSafeImage(product.imageUrl),
    rating: 5,
    reviewCount: 0,
    currentPrice: formatTry(currentPriceNumber || 0),
    oldPrice: formatTry(oldPriceNumber || 0),
    discountPercent,
    deliveryText: normalizedDeliveryText,
    features: normalizedFeatures.length > 0 ? normalizedFeatures : defaultFeatures,
    detailDescription:
      product.description?.trim() ||
      `${product.name} modeli, ${product.category || "römork"} kategorisinde güvenli ve dayanıklı kullanım için tasarlanmıştır.`,
  };
};

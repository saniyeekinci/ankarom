/**
 * Merkezi Ürün Veritabanı (Single Source of Truth)
 */

export type ProductCategory =
  | "tekne-romorklari"
  | "platform-romorklar"
  | "kapali-kasa-romorklar"
  | "ozel-uretim-romorklar"
  | "yedek-parca-ve-ekipman";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number | null;
  capacity?: string;
  stockStatus: "Stokta Var" | "Siparişe Özel" | "Stock'ta 1 Kaldı";
  imageUrl?: string;
  images?: string[];
  description: string;
  features?: string[];
  deliveryInfo?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
};

import productCatalog from "./productCatalog.json";

export const categoryLabels: Record<ProductCategory, string> = {
  "tekne-romorklari": "Tekne Römorkları",
  "platform-romorklar": "Platform Römorklar",
  "kapali-kasa-romorklar": "Kapalı Kasa Römorklar",
  "ozel-uretim-romorklar": "Özel Üretim Römorklar",
  "yedek-parca-ve-ekipman": "Yedek Parça ve Ekipman",
};

// BURASI ÖNEMLİ: features'i TypeScript'e tanıttık
type RawItem = {
  id: string;
  name?: string;
  images?: string[];
  description?: string;
  features?: string[];
  category?: string; // Bu satırı ekledik
};

type CatalogData = {
  catalog?: RawItem[];
  showcase?: RawItem[];
};

const parsedCatalog = productCatalog as CatalogData;

const rawCatalog = parsedCatalog.catalog;
const rawShowcase = parsedCatalog.showcase;

const showcaseIds = (rawShowcase || []).map((s) =>
  typeof s === "string" ? s : s.id,
);

function toProduct(item: RawItem): Product {
  const images = item.images && item.images.length ? item.images : undefined;
  
  return {
    id: item.id,
    name: item.name ?? item.id,
    slug: item.id,
    // (item as any) kısmını sildik, doğrudan item.category yazıyoruz
    category: (item.category as ProductCategory) ?? "tekne-romorklari", 
    price: 0,
    discountPrice: null,
    capacity: undefined,
    stockStatus: "Stokta Var",
    imageUrl: images ? images[0] : undefined,
    images,
    description: item.description ?? "",
    features: item.features ?? [],
    deliveryInfo: undefined,
    rating: undefined,
    reviewCount: undefined,
    isFeatured: showcaseIds.includes(item.id),
  };
}

const allRawItems = [...(rawShowcase || []), ...(rawCatalog || [])];
export const products: Product[] = allRawItems.map((i) => toProduct(i));

// --- FİLTRELEME FONKSİYONLARI ---

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

// SADECE VİTRİN ÜRÜNLERİNİ GETİRİR (Anasayfa için)
export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isFeatured === true);
}

// SADECE KATALOG ÜRÜNLERİNİ GETİRİR (Ürünler sayfası için)
export function getCatalogOnlyProducts(): Product[] {
  return products.filter((product) => product.isFeatured === false);
}
// Tüm kategori sluglarını benzersiz olarak getirir
export function getAllCategories(): string[] {
  const categories = products.map((p) => p.category);
  return Array.from(new Set(categories));
}

// Belirli bir kategoriye ait ürünleri filtreler
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}
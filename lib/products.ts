/**
 * Merkezi Ürün Veritabanı (Single Source of Truth)
 * Tüm ürün yönetimini bu dosyadan yapabilirsiniz
 */

export type ProductCategory = 
  | "arac-romorklari" 
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
  description: string;
  features?: string[];
  deliveryInfo?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
};

export const categoryLabels: Record<ProductCategory, string> = {
  "arac-romorklari": "Araç Römorkları",
  "platform-romorklar": "Platform Römorklar",
  "kapali-kasa-romorklar": "Kapalı Kasa Römorklar",
  "ozel-uretim-romorklar": "Özel Üretim Römorklar",
  "yedek-parca-ve-ekipman": "Yedek Parça ve Ekipman",
};

export const products: Product[] = [
  {
    id: "super-sport-lowering-trailer",
    name: "Super Sport Lowering Trailer",
    slug: "super-sport-lowering-trailer",
    category: "arac-romorklari",
    price: 2890000,
    discountPrice: 2450000,
    capacity: "2.500 kg",
    stockStatus: "Stokta Var",
    // imageUrl: "/products/1.jpg",
    description:
      "Düşük gövdeli spor araçların hasarsız yüklenmesi için optimize edilmiş rampa açısı ve güçlendirilmiş şasi yapısı ile geliştirilmiştir. Yük sabitleme noktaları, uzun mesafeli taşımalarda dahi güvenli pozisyon koruyacak şekilde konumlandırılmıştır.",
    features: [
      "Düşük açı platformu ile süpersport araçlarda güvenli yükleme",
      "Çift aks denge mimarisi ile premium sürüş stabilitesi",
      "Korozyona dayanıklı güçlendirilmiş şasi ve uzun ömürlü kullanım",
      "Kurumsal filolar için özelleştirilebilir ekipman paketi",
    ],
    deliveryInfo: "Ücretsiz Teslimat",
    rating: 5,
    reviewCount: 48,
    isFeatured: true,
  },
  {
    id: "pro-atv-trailer",
    name: "Pro ATV Transport Trailer",
    slug: "pro-atv-trailer",
    category: "platform-romorklar",
    price: 1340000,
    discountPrice: 1180000,
    capacity: "1.500 kg",
    stockStatus: "Stokta Var",
    // imageUrl: "/products/1.jpg",
    description:
      "Pro ATV Transport Trailer, bireysel ve profesyonel ATV taşımacılığı için geliştirilmiş kompakt ve dayanıklı bir çözüm sunar. Denge odaklı aks yapısı sayesinde zorlu yol koşullarında dahi güvenli kullanım performansı sağlar.",
    features: [
      "ATV platform ölçülerine göre optimize edilmiş yük alanı",
      "Düşük bakım ihtiyacı sunan dayanıklı şasi tasarımı",
      "Güvenli taşıma için çok noktalı sabitleme altyapısı",
      "Hobi ve profesyonel kullanım için çok yönlü yapı",
    ],
    deliveryInfo: "Stokta Var",
    rating: 5,
    reviewCount: 31,
    isFeatured: true,
  },
  {
    id: "marine-boat-trailer",
    name: "Marine Boat Trailer",
    slug: "marine-boat-trailer",
    category: "platform-romorklar",
    price: 2240000,
    discountPrice: 1960000,
    capacity: "3.500 kg",
    stockStatus: "Siparişe Özel",
    // imageUrl: "/products/1.jpg",
    description:
      "Marine Boat Trailer, tekne sahipleri ve marina işletmeleri için güvenilir bir taşıma altyapısı sağlar. Korozyona dayanıklı yapısı ve kontrollü yük dağılımı ile hem kısa hem uzun mesafede stabil performans sunar.",
    features: [
      "Tekne gövdesine uyumlu taşıma geometrisi",
      "Suya dayanıklı bileşenlerle uzun ömürlü kullanım",
      "Rampa iniş-biniş operasyonları için güvenli destek",
      "Marina operasyonlarına uygun pratik bağlantı sistemi",
    ],
    deliveryInfo: "Ücretsiz Teslimat",
    rating: 4,
    reviewCount: 22,
    isFeatured: true,
  },
  {
    id: "moto-duo-carrier",
    name: "Moto Duo Carrier",
    slug: "moto-duo-carrier",
    category: "arac-romorklari",
    price: 1040000,
    discountPrice: 890000,
    capacity: "800 kg",
    stockStatus: "Stokta Var",
    // imageUrl: "/products/1.jpg",
    description:
      "Moto Duo Carrier, aynı anda iki motosiklet taşımak isteyen kullanıcılar için geliştirildi. Hafif fakat dayanıklı şasi yapısı ile manevra kolaylığı sağlarken taşıma güvenliğini üst seviyede tutar.",
    features: [
      "İki motosiklet için optimize edilmiş taşıma platformu",
      "Kısa sürede yükleme sağlayan akıllı rampa düzeni",
      "Yol güvenliği için güçlendirilmiş sabitleme noktaları",
      "Kompakt ölçüleriyle şehir içi kullanım avantajı",
    ],
    deliveryInfo: "Stokta Var",
    rating: 5,
    reviewCount: 17,
    isFeatured: false,
  },
  {
    id: "jet-ski-premium-trailer",
    name: "Jet Ski Premium Trailer",
    slug: "jet-ski-premium-trailer",
    category: "kapali-kasa-romorklar",
    price: 1290000,
    discountPrice: 1120000,
    capacity: "1.200 kg",
    stockStatus: "Stock'ta 1 Kaldı",
    // imageUrl: "/products/1.jpg",
    description:
      "Jet Ski Premium Trailer, yüksek performanslı su sporları araçları için tasarlanmış profesyonel taşıma çözümüdür. Suya dayanıklı gövde ve kontrollü süspansiyon sistemi ile maksimum koruma sağlar.",
    features: [
      "Jet ski'ler için özel tasarlanmış gümrük profili",
      "Korozyona karşı güçlendirilmiş alüminyum ve çelik yapı",
      "Hava akışı kontrollü depolama alanı",
      "Profesyonel kullanıcılar için gelişmiş sabitleme sistemi",
    ],
    deliveryInfo: "Siparişe Özel",
    rating: 4,
    reviewCount: 19,
    isFeatured: false,
  },
  {
    id: "jet-ski-premium-trailerr",
    name: "Jet Ski Premium Trailer",
    slug: "jet-ski-premium-trailer",
    category: "kapali-kasa-romorklar",
    price: 1290000,
    discountPrice: 1120000,
    capacity: "1.200 kg",
    stockStatus: "Stock'ta 1 Kaldı",
    // imageUrl: "/products/1.jpg",
    description:
      "Jet Ski Premium Trailer, yüksek performanslı su sporları araçları için tasarlanmış profesyonel taşıma çözümüdür. Suya dayanıklı gövde ve kontrollü süspansiyon sistemi ile maksimum koruma sağlar.",
    features: [
      "Jet ski'ler için özel tasarlanmış gümrük profili",
      "Korozyona karşı güçlendirilmiş alüminyum ve çelik yapı",
      "Hava akışı kontrollü depolama alanı",
      "Profesyonel kullanıcılar için gelişmiş sabitleme sistemi",
    ],
    deliveryInfo: "Siparişe Özel",
    rating: 4,
    reviewCount: 19,
    isFeatured: false,
  },
];

/**
 * Tüm ürünleri kategoriye göre filtreler
 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
}

/**
 * ID'ye göre tek bir ürün bul
 */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/**
 * Slug'a göre tek bir ürün bul
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/**
 * Tüm kategorileri döndür
 */
export function getAllCategories(): ProductCategory[] {
  return Object.keys(categoryLabels) as ProductCategory[];
}

/**
 * Stok bilgisine göre ürünleri filtrele
 */
export function getProductsByStockStatus(
  stockStatus: Product["stockStatus"]
): Product[] {
  return products.filter((product) => product.stockStatus === stockStatus);
}

/**
 * Arama ile ürün bul
 */
export function searchProducts(searchTerm: string): Product[] {
  const term = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.features?.some((feature) =>
        feature.toLowerCase().includes(term)
      )
  );
}

/**
 * Vitrin ürünlerini (isFeatured: true) döndür
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isFeatured === true);
}

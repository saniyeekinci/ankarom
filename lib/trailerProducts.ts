export type TrailerProduct = {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  currentPrice: string;
  oldPrice: string;
  discountPercent: number;
  deliveryText: "Ücretsiz Teslimat" | "Stokta Var";
  features: string[];
  detailDescription: string;
};

export const trailerProducts: TrailerProduct[] = [
  {
    id: "super-sport-lowering-trailer",
    name: "Super Sport Lowering Trailer",
    image: "/products/fleet-management-v2.jpg",
    rating: 5,
    reviewCount: 48,
    currentPrice: "₺2.450.000",
    oldPrice: "₺2.890.000",
    discountPercent: 15,
    deliveryText: "Ücretsiz Teslimat",
    features: [
      "Düşük açı platformu ile süpersport araçlarda güvenli yükleme",
      "Çift aks denge mimarisi ile premium sürüş stabilitesi",
      "Korozyona dayanıklı güçlendirilmiş şasi ve uzun ömürlü kullanım",
      "Kurumsal filolar için özelleştirilebilir ekipman paketi",
    ],
    detailDescription:
      "Bu model, düşük gövdeli spor araçların hasarsız yüklenmesi için optimize edilmiş rampa açısı ve güçlendirilmiş şasi yapısı ile geliştirilmiştir. Yük sabitleme noktaları, uzun mesafeli taşımalarda dahi güvenli pozisyon koruyacak şekilde konumlandırılmıştır.",
  },
  {
    id: "pro-atv-trailer",
    name: "Pro ATV Transport Trailer",
    image: "/products/fleet-management-v2.jpg",
    rating: 5,
    reviewCount: 31,
    currentPrice: "₺1.180.000",
    oldPrice: "₺1.340.000",
    discountPercent: 12,
    deliveryText: "Stokta Var",
    features: [
      "ATV platform ölçülerine göre optimize edilmiş yük alanı",
      "Düşük bakım ihtiyacı sunan dayanıklı şasi tasarımı",
      "Güvenli taşıma için çok noktalı sabitleme altyapısı",
      "Hobi ve profesyonel kullanım için çok yönlü yapı",
    ],
    detailDescription:
      "Pro ATV Transport Trailer, bireysel ve profesyonel ATV taşımacılığı için geliştirilmiş kompakt ve dayanıklı bir çözüm sunar. Denge odaklı aks yapısı sayesinde zorlu yol koşullarında dahi güvenli kullanım performansı sağlar.",
  },
  {
    id: "marine-boat-trailer",
    name: "Marine Boat Trailer",
    image: "/products/fleet-management-v2.jpg",
    rating: 4,
    reviewCount: 22,
    currentPrice: "₺1.960.000",
    oldPrice: "₺2.240.000",
    discountPercent: 13,
    deliveryText: "Ücretsiz Teslimat",
    features: [
      "Tekne gövdesine uyumlu taşıma geometrisi",
      "Suya dayanıklı bileşenlerle uzun ömürlü kullanım",
      "Rampa iniş-biniş operasyonları için güvenli destek",
      "Marina operasyonlarına uygun pratik bağlantı sistemi",
    ],
    detailDescription:
      "Marine Boat Trailer, tekne sahipleri ve marina işletmeleri için güvenilir bir taşıma altyapısı sağlar. Korozyona dayanıklı yapısı ve kontrollü yük dağılımı ile hem kısa hem uzun mesafede stabil performans sunar.",
  },
  {
    id: "moto-duo-carrier",
    name: "Moto Duo Carrier",
    image: "/products/fleet-management-v2.jpg",
    rating: 5,
    reviewCount: 17,
    currentPrice: "₺890.000",
    oldPrice: "₺1.040.000",
    discountPercent: 14,
    deliveryText: "Stokta Var",
    features: [
      "İki motosiklet için optimize edilmiş taşıma platformu",
      "Kısa sürede yükleme sağlayan akıllı rampa düzeni",
      "Yol güvenliği için güçlendirilmiş sabitleme noktaları",
      "Kompakt ölçüleriyle şehir içi kullanım avantajı",
    ],
    detailDescription:
      "Moto Duo Carrier, aynı anda iki motosiklet taşımak isteyen kullanıcılar için geliştirildi. Hafif fakat dayanıklı şasi yapısı ile manevra kolaylığı sağlarken taşıma güvenliğini üst seviyede tutar.",
  },
  {
    id: "jet-ski-premium-trailer",
    name: "Jet Ski Premium Trailer",
    image: "/products/fleet-management-v2.jpg",
    rating: 4,
    reviewCount: 19,
    currentPrice: "₺1.120.000",
    oldPrice: "₺1.290.000",
    discountPercent: 11,
    deliveryText: "Ücretsiz Teslimat",
    features: [
      "Jet ski gövdesine özel güvenli taşıma yatakları",
      "Su teması sonrası hızlı bakım için dayanıklı malzeme",
      "Kıyı ve marina geçişlerinde dengeli sürüş performansı",
      "Premium donanım seçenekleriyle kişiselleştirme imkanı",
    ],
    detailDescription:
      "Jet Ski Premium Trailer, su sporları kullanıcıları için tasarlanmış premium bir taşıma çözümüdür. Hafif gövde yapısı ve güvenli bağlantı noktaları ile operasyon süresini kısaltırken kullanım konforunu artırır.",
  },
  {
    id: "fleet-heavy-duty-platform",
    name: "Fleet Heavy Duty Platform",
    image: "/products/fleet-management-v2.jpg",
    rating: 5,
    reviewCount: 26,
    currentPrice: "₺2.980.000",
    oldPrice: "₺3.420.000",
    discountPercent: 13,
    deliveryText: "Stokta Var",
    features: [
      "Yüksek tonaj için güçlendirilmiş platform altyapısı",
      "Kurumsal operasyonlar için uzun ömürlü kullanım",
      "Denge odaklı aks sistemi ile güvenli yol performansı",
      "Filo yönetimine uygun özelleştirilebilir ekipman paketi",
    ],
    detailDescription:
      "Fleet Heavy Duty Platform, yoğun operasyon temposuna sahip filo şirketleri için geliştirilmiş ağır hizmet römork modelidir. Sağlam şasi yapısı ve yüksek taşıma kapasitesi ile ticari taşımacılıkta verimliliği artırır.",
  },
];

export const getTrailerProductById = (id: string) =>
  trailerProducts.find((product) => product.id === id);

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  TruckIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import Breadcrumb from "@/components/Breadcrumb";
import { categoryLabels, type Product } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";

type ProductDetailExperienceProps = {
  product: Product;
};

export default function ProductDetailExperience({
  product,
}: ProductDetailExperienceProps) {
  const { addToCart } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const whatsappMessage = `Merhaba, ${product.name} hakkında bilgi almak istiyorum.`;

  const whatsappHref = `https://wa.me/905079586868?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const displayPrice = product.discountPrice ?? product.price;

  const features =
    product.features && product.features.length > 0
      ? product.features
      : [
          "Yüksek dayanım sunan güçlendirilmiş şasi yapısı",
          "Uzun ömürlü kullanım için kaliteli malzeme seçimi",
          "Profesyonel taşımacılığa uygun dengeli platform mimarisi",
          "Ankarom satış sonrası destek ekibiyle güvenli operasyon",
        ];

  const images = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : [];

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    /*
     * Mevcut CartProvider Product üzerinden çalıştığı için
     * quantity desteğiniz yoksa mevcut yapıyı bozmamak adına
     * ürün bir kez ekleniyor.
     */
    addToCart(product);
    setIsAdded(true);
  };

  const prevImage = () => {
    if (!images.length) return;

    setCurrentImageIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  const nextImage = () => {
    if (!images.length) return;

    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="product-detail-page w-full">
      {/* BREADCRUMB */}
      <div className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex max-w-7xl justify-center px-5 py-4 sm:px-8 lg:px-10" style={{ marginInline: "auto" }}>
          <Breadcrumb
            items={[
              { label: "Ana Sayfa", href: "/" },
              { label: "Ürünler", href: "/urunler" },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <main className="min-h-screen bg-[#f6f6f6]">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12 lg:px-10 lg:py-16" style={{ marginInline: "auto" }}>

          {/* PRODUCT CARD */}
          <div className="mx-auto max-w-6xl border border-[#e2e2e2] bg-white" style={{ marginInline: "auto" }}>

            <div className="grid lg:grid-cols-[58%_42%]">

              {/* ================= IMAGE AREA ================= */}
              <section className="border-b border-[#e5e5e5] lg:border-b-0 lg:border-r">

                <div className="relative flex aspect-square min-h-[420px] items-center justify-center bg-white sm:min-h-[550px]">

                  {images.length > 0 ? (
                    <Image
                      src={images[currentImageIndex]}
                      alt={`${product.name} - Görsel ${
                        currentImageIndex + 1
                      }`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain p-8 sm:p-12 lg:p-16"
                    />
                  ) : (
                    <div className="flex items-center justify-center text-[#aaa]">
                      <svg
                        className="h-20 w-20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 10 3.5-4 2.5 3 2-2 4 5H6v-2z" />
                      </svg>
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        aria-label="Önceki görsel"
                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#ddd] bg-white shadow-sm transition hover:border-[#29483c] hover:text-[#29483c]"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>

                      <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Sonraki görsel"
                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#ddd] bg-white shadow-sm transition hover:border-[#29483c] hover:text-[#29483c]"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* THUMBNAILS */}
                {images.length > 1 && (
                  <div className="border-t border-[#e5e5e5] p-4">
                    <div className="flex gap-3 overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative h-[72px] w-[88px] shrink-0 overflow-hidden rounded border bg-white ${
                            currentImageIndex === index
                              ? "border-2 border-[#29483c]"
                              : "border-[#ddd] hover:border-[#999]"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} görsel ${index + 1}`}
                            fill
                            sizes="88px"
                            className="object-contain p-1"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* ================= PRODUCT INFO ================= */}
              <section className="flex flex-col items-center px-6 py-9 text-center sm:px-9 sm:py-12 lg:px-12 lg:py-14">

                {/* CATEGORY */}
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#718077]">
                  {categoryLabels[product.category]}
                </div>

                {/* TITLE */}
                <h1 className="mt-5 max-w-lg text-[30px] font-medium leading-tight text-[#202522] sm:text-[36px]">
                  {product.name}
                </h1>

                {/* PRODUCT INFO */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-[#777]">
                  <span>Ürün Kodu: ANK-{product.category}</span>

                  {product.certification && (
                    <span className="text-[#29483c]">
                      {product.certification} belgeli
                    </span>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div className="mt-7 max-w-lg border-t border-[#eee] pt-7">
                  <p className="text-[14px] leading-9 text-[#555]">
                    {product.description ||
                      "Ankarom güvencesiyle sunulan ürünümüz hakkında detaylı bilgi alın."}
                  </p>
                </div>

                {/* PRICE */}
                <div className="mt-8 w-full max-w-md border-y border-[#e8e5df] py-6">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#858d86]">
                    Satış fiyatı
                  </p>
                  <div className="mt-3 flex flex-wrap items-baseline justify-center gap-3">

                    <span className="text-[32px] font-semibold leading-tight text-[#202522] sm:text-[36px]">
                      {formatPrice(displayPrice)}
                    </span>

                    {product.discountPrice &&
                      product.discountPrice < product.price && (
                        <span className="text-sm text-[#999] line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                  </div>

                  <p className="mt-3 text-[11px] text-[#858d86]">
                    KDV dahil fiyat
                  </p>
                </div>

                {/* STOCK */}
                <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#59635c]">
                  <span className="h-2 w-2 rounded-full bg-[#4d8b63]" />

                  <span className="font-medium text-[#333]">
                    {product.stockStatus}
                  </span>
                </div>

                {product.deliveryInfo && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-[12px] leading-6 text-[#59635c]">
                    <TruckIcon className="h-4 w-4 shrink-0 text-[#718a78]" />
                    {product.deliveryInfo}
                  </div>
                )}

                {/* QUANTITY + CART */}
                <div className="mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:flex-row">

                  {/* QUANTITY */}
                  <div className="mx-auto flex h-14 shrink-0 items-center border border-[#d8d8d8] sm:mx-0">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="flex h-full w-11 items-center justify-center text-[#555] hover:bg-[#f5f5f5]"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>

                    <span className="flex w-10 justify-center text-sm font-medium">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="flex h-full w-11 items-center justify-center text-[#555] hover:bg-[#f5f5f5]"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>

                  </div>

                  {/* ADD CART */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`product-cart-button flex h-14 flex-1 items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                      isAdded
                        ? "is-added bg-[#eaf0ff] text-[#1d4ed8]"
                        : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
                    }`}
                    style={{ color: isAdded ? "#1d4ed8" : "#fff", borderRadius: 0 }}
                  >
                    {isAdded ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <ShoppingCartIcon className="h-5 w-5" />
                    )}

                    {isAdded ? "Sepete eklendi" : "Sepete ekle"}
                  </button>
                </div>

                {/* WHATSAPP */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#29483c] transition hover:text-[#203b31]"
                  style={{ color: "#29483c" }}
                >
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                  Ürün hakkında bilgi alın
                </a>

                {/* SECURITY */}
                <div className="mt-8 flex w-full max-w-md items-center justify-center gap-3 border-t border-[#eee] pt-6 text-center">
                  <ShieldCheckIcon className="h-5 w-5 shrink-0 text-[#718a78]" />

                  <div>
                    <p className="text-[12px] font-medium text-[#333]">
                      Güvenli alışveriş
                    </p>

                    <p className="mt-2 text-[11px] leading-7 text-[#777]">
                      Güvenli ödeme ve Ankarom satış sonrası desteği.
                    </p>
                  </div>
                </div>

              </section>
            </div>
          </div>

          {/* ================= PRODUCT DETAILS ================= */}
          <section className="mx-auto mt-12 max-w-4xl border-t border-[#dcd9d1] pt-8 sm:mt-16 sm:pt-10" style={{ marginInline: "auto" }}>

            {/* TITLE */}
            <div className="text-center">
              <h2 className="text-[22px] font-medium text-[#202522]">
                Ürün özellikleri
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-[14px] leading-9 text-[#59635c] sm:mt-8 sm:text-[15px] sm:leading-10">
                {features.join("  ·  ")}
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

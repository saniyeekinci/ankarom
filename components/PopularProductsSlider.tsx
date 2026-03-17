"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const popularProducts = [
  {
    title: "Filo Yönetimi",
    description:
      "Araçlarınızı tek panelden izleyin, rota ve görev yönetimini daha hızlı hale getirin.",
    image: "/products/fleet-management-v2.jpg",
  },
  {
    title: "Servis Planlama",
    description:
      "Bakım tarihlerini akıllı takvim ile planlayın ve servis operasyonlarını aksatmadan yönetin.",
    image: "/products/service-planning-v2.jpg",
  },
  {
    title: "Yedek Parça",
    description:
      "Stok seviyelerini takip edin, kritik parçalar için otomatik uyarılarla kesintiyi azaltın.",
    image: "/products/spare-parts-v2.jpg",
  },
  {
    title: "Raporlama",
    description:
      "Operasyonel performansı KPI bazlı raporlar ile analiz edin ve hızlı karar alın.",
    image: "/products/reporting-v2.jpg",
  },
];

export default function PopularProductsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = useMemo(() => popularProducts[activeIndex], [activeIndex]);

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-360 rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-6 lg:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-stretch">
          <div className="relative min-h-90 overflow-hidden rounded-2xl border border-white/10 bg-slate-800/40">
            <Image
              src={activeProduct.image}
              alt={activeProduct.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xl font-bold text-white sm:text-2xl">
              {activeProduct.title}
            </h2>

            <div className="min-h-54 rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-base leading-relaxed text-slate-200">
                {activeProduct.description}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <input
                type="range"
                min={0}
                max={popularProducts.length - 1}
                step={1}
                value={activeIndex}
                onChange={(event) => setActiveIndex(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-amber-500"
                aria-label="Popüler ürün kaydırma çubuğu"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {popularProducts.map((product, index) => (
                <button
                  key={product.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
                    activeIndex === index
                      ? "border-amber-500/70 bg-amber-500/15 text-amber-200"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {product.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
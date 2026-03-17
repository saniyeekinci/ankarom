import Image from "next/image";

const featuredProducts = [
  {
    title: "Filo Yönetimi",
    description: "Gerçek zamanlı rota, yakıt ve görev takibini tek panelde yönetin.",
    image: "/products/fleet-management-v2.jpg",
  },
  {
    title: "Servis Planlama",
    description: "Bakım periyotlarını otomatik planlayın, operasyonel kesintiyi azaltın.",
    image: "/products/service-planning-v2.jpg",
  },
];

const secondaryProducts = [
  {
    title: "Yedek Parça",
    description: "Stok ve tedarik zinciri görünürlüğü.",
    image: "/products/spare-parts-v2.jpg",
  },
  {
    title: "Raporlama",
    description: "KPI odaklı karar destek panoları.",
    image: "/products/reporting-v2.jpg",
  },
  {
    title: "Müşteri Takibi",
    description: "Tek ekranda süreç ve iletişim geçmişi.",
    image: "/products/customer-tracking-v2.jpg",
  },
];

export default function ProductsShowcase() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto grid w-full max-w-360 gap-7 lg:grid-cols-12 lg:gap-8">
        <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/55 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8 lg:col-span-5">
          <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-amber-500/12 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Ürün Vitrini
            </span>

            <h2 className="mt-5 text-4xl font-bold leading-[1.06] text-white sm:text-5xl">
              Akıllı
              <span className="bg-linear-to-r from-amber-300 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                Çözümler
              </span>
              <br />
              İşinize Uygun mu?
            </h2>

            <p className="mt-6 text-base leading-relaxed text-slate-300">
              Filo, servis, yedek parça ve raporlama süreçlerinizi tek platformda
              yönetmek için ürünlerimizi keşfedin. İhtiyacınıza göre en doğru
              modülü hızlıca belirleyin.
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-300">
              <p>• Tüm modüller tek panelde entegre çalışır.</p>
              <p>• Esnek kurulum yapısı ile hızlı devreye alma sağlar.</p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Ürün Sayısı</p>
                  <p className="mt-1 text-xl font-semibold text-white">5 Modül</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Kurulum Süresi</p>
                  <p className="mt-1 text-xl font-semibold text-white">Hızlı Geçiş</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Destek</p>
                  <p className="mt-1 text-xl font-semibold text-white">7/24 Ekip</p>
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-300">
                Detaylı bilgi: <span className="font-semibold text-white">info@ankarom.com</span>
              </p>
            </div>
          </div>
        </aside>

        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-6 lg:col-span-7 lg:p-7">
          <h2 className="px-2 pb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 sm:px-3">
            [AÇIKLAMA]
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-7">
            {featuredProducts.map((product) => (
              <article
                key={product.title}
                className="group relative min-h-55 overflow-hidden rounded-2xl border border-white/12 bg-slate-800/70"
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/55 to-slate-950/15" />
                <div className="relative z-10 p-5">
                  <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                  <p className="mt-2 text-sm text-slate-200">{product.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 pt-7 grid gap-6 sm:grid-cols-3 lg:gap-7">
            {secondaryProducts.map((product) => (
              <article
                key={product.title}
                className="group relative min-h-47.5 overflow-hidden rounded-2xl border border-white/12 bg-slate-800/60"
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/65 to-slate-950/25" />
                <div className="relative z-10 p-5">
                  <h3 className="text-base font-semibold text-white">{product.title}</h3>
                  <p className="mt-2 text-sm text-slate-200">{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
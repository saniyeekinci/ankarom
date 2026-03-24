"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

const toNumberPrice = (price: string | number) => {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const cleaned = price.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number(cleaned);
  return Number.isNaN(value) ? 0 : value;
};

export default function PaymentPage() {
  const { items, subtotal } = useCart();
  const shippingCost = 0;
  const taxAmount = 0;
  const totalAmount = subtotal + shippingCost + taxAmount;

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-14 bg-slate-950">
      {/* Dekoratif Arkaplan Blurları */}
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="flex flex-col gap-4 relative mx-auto w-full max-w-360">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Secure Checkout</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Ödeme</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
            Siparişinizi tamamlamak için fatura ve ödeme bilgilerinizi girin.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* SOL TARAF: Fatura Bilgileri (Orijinal Yapı Korundu) */}
          <article className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/75 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl lg:col-span-8 lg:p-6">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Fatura Bilgileri</h2>

            <form className="flex flex-col gap-4 mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Ad *</label>
                  <input type="text" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/70" />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Soyad *</label>
                  <input type="text" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/70" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Şirket (opsiyonel)</label>
                <input type="text" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/70" />
              </div>

              

              <div className="flex flex-col gap-4">
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Adres *</label>
                <input type="text" placeholder="Mahalle, cadde, sokak" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70" />
              </div>

              <div className="flex flex-col gap-4">
                <input type="text" placeholder="Apartman, daire, kat (opsiyonel)" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">İlçe / Şehir *</label>
                  <input type="text" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/70" />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">İl *</label>
                  <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/70">
                    <option className="bg-white text-slate-900">Bir il seçin...</option>
                    <option className="bg-white text-slate-900">Adana</option>
                    <option className="bg-white text-slate-900">Adıyaman</option>
                    <option className="bg-white text-slate-900">Afyonkarahisar</option>
                    <option className="bg-white text-slate-900">Ağrı</option>
                    <option className="bg-white text-slate-900">Aksaray</option>
                    <option className="bg-white text-slate-900">Amasya</option>
                    <option className="bg-white text-slate-900">Ankara</option>
                    <option className="bg-white text-slate-900">Antalya</option>
                    <option className="bg-white text-slate-900">Ardahan</option>
                    <option className="bg-white text-slate-900">Artvin</option>
                    <option className="bg-white text-slate-900">Aydın</option>
                    <option className="bg-white text-slate-900">Balıkesir</option>
                    <option className="bg-white text-slate-900">Bartın</option>
                    <option className="bg-white text-slate-900">Batman</option>
                    <option className="bg-white text-slate-900">Bayburt</option>
                    <option className="bg-white text-slate-900">Bilecik</option>
                    <option className="bg-white text-slate-900">Bingöl</option>
                    <option className="bg-white text-slate-900">Bitlis</option>
                    <option className="bg-white text-slate-900">Bolu</option>
                    <option className="bg-white text-slate-900">Burdur</option>
                    <option className="bg-white text-slate-900">Bursa</option>
                    <option className="bg-white text-slate-900">Çanakkale</option>
                    <option className="bg-white text-slate-900">Çankırı</option>
                    <option className="bg-white text-slate-900">Çorum</option>
                    <option className="bg-white text-slate-900">Denizli</option>
                    <option className="bg-white text-slate-900">Diyarbakır</option>
                    <option className="bg-white text-slate-900">Düzce</option>
                    <option className="bg-white text-slate-900">Edirne</option>
                    <option className="bg-white text-slate-900">Elazığ</option>
                    <option className="bg-white text-slate-900">Erzincan</option>
                    <option className="bg-white text-slate-900">Erzurum</option>
                    <option className="bg-white text-slate-900">Eskişehir</option>
                    <option className="bg-white text-slate-900">Gaziantep</option>
                    <option className="bg-white text-slate-900">Giresun</option>
                    <option className="bg-white text-slate-900">Gümüşhane</option>
                    <option className="bg-white text-slate-900">Hakkâri</option>
                    <option className="bg-white text-slate-900">Hatay</option>
                    <option className="bg-white text-slate-900">Iğdır</option>
                    <option className="bg-white text-slate-900">Isparta</option>
                    <option className="bg-white text-slate-900">İstanbul</option>
                    <option className="bg-white text-slate-900">İzmir</option>
                    <option className="bg-white text-slate-900">Kahramanmaraş</option>
                    <option className="bg-white text-slate-900">Karabük</option>
                    <option className="bg-white text-slate-900">Karaman</option>
                    <option className="bg-white text-slate-900">Kars</option>
                    <option className="bg-white text-slate-900">Kastamonu</option>
                    <option className="bg-white text-slate-900">Kayseri</option>
                    <option className="bg-white text-slate-900">Kırıkkale</option>
                    <option className="bg-white text-slate-900">Kırklareli</option>
                    <option className="bg-white text-slate-900">Kırşehir</option>
                    <option className="bg-white text-slate-900">Kilis</option>
                    <option className="bg-white text-slate-900">Kocaeli</option>
                    <option className="bg-white text-slate-900">Konya</option>
                    <option className="bg-white text-slate-900">Kütahya</option>
                    <option className="bg-white text-slate-900">Malatya</option>
                    <option className="bg-white text-slate-900">Manisa</option>
                    <option className="bg-white text-slate-900">Mardin</option>
                    <option className="bg-white text-slate-900">Mersin</option>
                    <option className="bg-white text-slate-900">Muğla</option>
                    <option className="bg-white text-slate-900">Muş</option>
                    <option className="bg-white text-slate-900">Nevşehir</option>
                    <option className="bg-white text-slate-900">Niğde</option>
                    <option className="bg-white text-slate-900">Ordu</option>
                    <option className="bg-white text-slate-900">Osmaniye</option>
                    <option className="bg-white text-slate-900">Rize</option>
                    <option className="bg-white text-slate-900">Sakarya</option>
                    <option className="bg-white text-slate-900">Samsun</option>
                    <option className="bg-white text-slate-900">Siirt</option>
                    <option className="bg-white text-slate-900">Sinop</option>
                    <option className="bg-white text-slate-900">Sivas</option>
                    <option className="bg-white text-slate-900">Şanlıurfa</option>
                    <option className="bg-white text-slate-900">Şırnak</option>
                    <option className="bg-white text-slate-900">Tekirdağ</option>
                    <option className="bg-white text-slate-900">Tokat</option>
                    <option className="bg-white text-slate-900">Trabzon</option>
                    <option className="bg-white text-slate-900">Tunceli</option>
                    <option className="bg-white text-slate-900">Uşak</option>
                    <option className="bg-white text-slate-900">Van</option>
                    <option className="bg-white text-slate-900">Yalova</option>
                    <option className="bg-white text-slate-900">Yozgat</option>
                    <option className="bg-white text-slate-900">Zonguldak</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Posta Kodu *</label>
                  <input type="text" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/70" />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Telefon *</label>
                  <input type="tel" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/70" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">E-posta *</label>
                <input type="email" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/70" />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-500" />
                Kampanya ve duyuru e-postaları almak istiyorum (opsiyonel)
              </label>
            </form>
          </article>

          {/* SAĞ TARAF: İyileştirilmiş Sipariş Özeti ve Ödeme */}
          <aside className="lg:col-span-4 lg:sticky lg:top-10 lg:self-start space-y-6">
            <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl lg:p-6">
              <h2 className="text-xl font-bold text-white mb-6">Siparişiniz</h2>

              {/* Ürün Listesi */}
              <div className="max-h-52 overflow-y-auto space-y-4 pr-2 custom-scrollbar border-b border-white/10 pb-5">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3 text-sm">
                      <div className="flex-1">
                        <p className="font-semibold text-white line-clamp-1">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.quantity} Adet × {formatCurrency(toNumberPrice(item.currentPrice))}</p>
                      </div>
                      <span className="font-bold text-white whitespace-nowrap">
                        {formatCurrency(toNumberPrice(item.currentPrice) * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic text-center py-4">Sepetiniz şu an boş.</p>
                )}
              </div>

              {/* Fiyat Tablosu */}
              <div className="mt-5 space-y-3 border-b border-white/10 pb-5">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Ara Toplam</span>
                  <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Kargo</span>
                  <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Ücretsiz</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-base font-bold text-white">Toplam</span>
                  <span className="text-2xl font-black text-yellow-300 leading-none">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Ödeme Bilgileri Kartı - İYİLEŞTİRİLMİŞ VERSİYON */}
<div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner">
  <div className="flex items-center gap-2 mb-4">
    <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-200">Kart Bilgileri</span>
  </div>

  <div className="flex flex-col gap-3">
    {/* İsim Soyisim - Yan Yana */}
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1.5">
        <input 
          type="text" 
          placeholder="Ad" 
          className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-950" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <input 
          type="text" 
          placeholder="Soyad" 
          className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-950" 
        />
      </div>
    </div>

    {/* Kart Numarası - Tam Genişlik */}
    <div className="relative">
      <input 
        type="text" 
        placeholder="0000 0000 0000 0000" 
        className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white tracking-[0.15em] placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-950" 
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <svg className="w-6 h-6 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
      </div>
    </div>

    {/* SKT ve CVV - Yan Yana */}
    <div className="grid grid-cols-2 gap-3">
      <input 
        type="text" 
        placeholder="AA/YY"
        inputMode="numeric"
        maxLength={5}
        onInput={(event) => {
          const target = event.currentTarget;
          const digits = target.value.replace(/\D/g, "").slice(0, 4);
          target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
        }}
        className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white text-center placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-950" 
      />
      <input 
        type="password" 
        placeholder="CVV" 
        maxLength={3}
        className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white text-center placeholder:text-slate-600 outline-none transition-all focus:border-cyan-400/50 focus:bg-slate-950" 
      />
    </div>
  </div>
</div>

              {/* Koşullar ve Buton */}
              <div className="mt-6 space-y-4 flex flex-col  gap-4">
                <label className="flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed cursor-pointer group">
                  <input type="checkbox" className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-emerald-500" />
                  <span>
                    <Link href="#" className="text-slate-200 underline">Satış sözleşmesini</Link> ve <Link href="#" className="text-slate-200 underline">iade koşullarını</Link> okudum, kabul ediyorum.
                  </span>
                </label>

                <button
                  type="button"
                  disabled={items.length === 0}
                  className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 px-4 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    GÜVENLİ ÖDEME YAP
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>

                <Link href="/sepetlerim" className="block text-center text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                  ← SEPETE DÖN VE DÜZENLE
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
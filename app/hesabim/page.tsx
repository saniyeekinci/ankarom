"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardDocumentListIcon, ShoppingCartIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";

const recentOrders = [
  { id: "ANK-2026-1042", date: "22 Mart 2026", status: "Hazırlanıyor", amount: "₺2.450.000" },
  { id: "ANK-2026-0978", date: "14 Mart 2026", status: "Kargoda", amount: "₺1.180.000" },
  { id: "ANK-2026-0911", date: "06 Mart 2026", status: "Teslim Edildi", amount: "₺890.000" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { items, itemCount, subtotal } = useCart();

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin/urun-ekle");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <section className="relative flex min-h-[calc(100vh-180px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl">
          <h1 className="text-3xl font-black text-white">Hesabım</h1>
          <p className="mt-3 text-sm text-slate-300">Bu sayfayı görüntülemek için önce giriş yapman gerekiyor.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/giris" className="rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white">
              Giriş Yap
            </Link>
            <Link href="/kayit" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="flex flex-col gap-4 relative mx-auto w-full max-w-360">
        <h1 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
          Hoş geldin, <span className="bg-linear-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">{user.name}</span>
        </h1>
        <p className="mt-3 text-sm text-slate-300 sm:text-base">Premium otomotiv panelinden siparişlerini, sepetini ve hesap ayarlarını yönetebilirsin.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3 rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
            <nav className="space-y-2">
              <button type="button" className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-left text-sm font-semibold text-white">
                <ClipboardDocumentListIcon className="h-5 w-5 text-cyan-300" />
                Siparişlerim
              </button>
              <Link href="/sepetlerim" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                <ShoppingCartIcon className="h-5 w-5 text-cyan-300" />
                Sepetim
              </Link>
              {user.role === "admin" && (
                <Link href="/admin/urun-ekle" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/15 hover:text-cyan-100">
                  <Cog6ToothIcon className="h-5 w-5 text-cyan-300" />
                  Admin Paneli
                </Link>
              )}
              <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                <Cog6ToothIcon className="h-5 w-5 text-cyan-300" />
                Hesap Ayarları
              </button>
              <button
                type="button"
                onClick={logout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2.5 text-sm font-semibold text-rose-200"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Çıkış Yap
              </button>
            </nav>
          </aside>

          <div className="flex flex-col gap-4 lg:col-span-9 space-y-6">
            <article className="rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-white">Aktif Sepet Durumu</h2>
                <Link href="/sepetlerim" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  Sepete Git
                </Link>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Ürün Adedi</p>
                  <p className="mt-2 text-2xl font-black text-white">{itemCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Sepet Toplamı</p>
                  <p className="mt-2 text-2xl font-black text-yellow-300">{formatCurrency(subtotal)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Son Eklenen</p>
                  <p className="mt-2 text-sm font-semibold text-white line-clamp-2">{items[items.length - 1]?.name || "Henüz ürün yok"}</p>
                </div>
              </div>
            </article>

            <article className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white">Son Siparişlerim</h2>
              <div className="flex flex-col gap-4 mt-4 space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{order.id}</p>
                      <p className="mt-1 text-xs text-slate-400">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                        {order.status}
                      </span>
                      <span className="text-sm font-bold text-yellow-300">{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

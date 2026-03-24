"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  ChartBarIcon,
  CubeIcon,
  ArchiveBoxIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: ChartBarIcon, enabled: true },
  { href: "/admin/products", label: "Ürün Yönetimi", icon: CubeIcon, enabled: true },
  { href: "/admin/urun-ekle", label: "Yeni Ürün", icon: PlusCircleIcon, enabled: true },
  { href: "/admin/orders", label: "Siparişler", icon: ShoppingBagIcon, enabled: true },
  { href: "/admin/stock", label: "Stok Durumu", icon: ArchiveBoxIcon, enabled: true },
  { href: "/admin/customers", label: "Müşteri Yönetimi", icon: UsersIcon, enabled: true },
  { href: "/admin/campaigns", label: "Kampanya Yönetimi", icon: MegaphoneIcon, enabled: true },
  { href: "/admin/reports", label: "Raporlar", icon: ClipboardDocumentListIcon, enabled: true },
  { href: "/admin/settings", label: "Ayarlar", icon: Cog6ToothIcon, enabled: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/giris");
      return;
    }

    if (isAuthenticated && user && user.role !== "admin") {
      router.replace("/hesabim");
    }
  }, [isAuthenticated, user, router]);

  return (
    <section className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl lg:flex lg:flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Ankarom</p>
            <h1 className="mt-2 text-2xl font-black text-white">Yönetim Merkezi</h1>
            <p className="mt-1 text-sm text-slate-400">Admin kontrol paneli</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (!item.enabled) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "border border-cyan-300/25 bg-cyan-500/10 text-cyan-100"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Çıkış Yap
          </button>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/75 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Admin Dashboard</p>
                <h2 className="mt-1 wrap-break-word text-lg font-bold text-white sm:text-xl">Ankarom Operasyon Paneli</h2>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                <p className="text-xs text-slate-400">Aktif Kullanıcı</p>
                <p className="text-sm font-semibold text-cyan-200">{isAdmin ? user?.name : "-"}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </section>
  );
}

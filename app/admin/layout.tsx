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
  TagIcon,
  BellIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/auth/AuthProvider";

const navSections = [
  {
    title: "Genel Bakış",
    items: [{ href: "/admin", label: "Dashboard", icon: ChartBarIcon, enabled: true }],
  },
  {
    title: "Ürün Operasyonları",
    items: [
      { href: "/admin/products", label: "Ürün Yönetimi", icon: CubeIcon, enabled: true },
      { href: "/admin/urun-ekle", label: "Yeni Ürün", icon: PlusCircleIcon, enabled: true },
      { href: "/admin/stock", label: "Stok Durumu", icon: ArchiveBoxIcon, enabled: true },
    ],
  },
  {
    title: "Sipariş ve Müşteri",
    items: [
      { href: "/admin/orders", label: "Siparişler", icon: ShoppingBagIcon, enabled: true },
      { href: "/admin/customers", label: "Müşteri Yönetimi", icon: UsersIcon, enabled: true },
    ],
  },
  {
    title: "Pazarlama",
    items: [
      { href: "/admin/campaigns", label: "Kampanya Yönetimi", icon: MegaphoneIcon, enabled: true },
      { href: "/admin/discounts", label: "İndirim Kuponları", icon: TagIcon, enabled: true },
    ],
  },
  {
    title: "Analiz ve Raporlama",
    items: [{ href: "/admin/reports", label: "Raporlar", icon: ClipboardDocumentListIcon, enabled: true }],
  },
  {
    title: "İçerik ve Destek",
    items: [
      { href: "/admin/reviews", label: "Yorum Moderasyonu", icon: StarIcon, enabled: true },
      { href: "/admin/support", label: "Destek Talepleri", icon: ChatBubbleLeftRightIcon, enabled: true },
      { href: "/admin/notifications", label: "Bildirim Yönetimi", icon: BellIcon, enabled: true },
    ],
  },
  {
    title: "Bayi ve Satış Ağı",
    items: [{ href: "/admin/dealers", label: "Bayi Başvuruları", icon: BuildingStorefrontIcon, enabled: true }],
  },
  {
    title: "Sistem",
    items: [{ href: "/admin/settings", label: "Ayarlar", icon: Cog6ToothIcon, enabled: true }],
  },
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
    <section className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        
        {/* SIDEBAR */}
        <aside className="hidden border-r border-slate-200 bg-white p-6 lg:flex lg:flex-col shadow-sm z-10">
          <div className="mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Ankarom</p>
            <h1 className="mt-1 text-xl font-bold text-slate-900 tracking-tight">Yönetim Merkezi</h1>
            <p className="mt-1 text-xs text-slate-500">Admin Kontrol Paneli</p>
          </div>

          <div className="mt-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <nav className="space-y-6">
              {navSections.map((section) => (
                <div key={section.title}>
                  <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      if (!item.enabled) {
                        return (
                          <div
                            key={item.label}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 cursor-not-allowed"
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
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* ÇIKIŞ BUTONU */}
          <div className="pt-6 mt-auto border-t border-slate-100">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-slate-400 group-hover:text-rose-500" />
              Çıkış Yap
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex min-w-0 flex-col">
          
          {/* HEADER */}
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <nav className="flex text-xs text-slate-500" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center uppercase tracking-wider font-semibold">
                      Admin Dashboard
                    </li>
                  </ol>
                </nav>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
                  Ankarom Operasyon Paneli
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs text-slate-500">Aktif Kullanıcı</span>
                  <span className="text-sm font-semibold text-indigo-700">
                    {isAdmin ? user?.name || "Yönetici" : "-"}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "Y"}
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
          
        </div>
      </div>
    </section>
  );
}
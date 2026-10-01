"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import HomeVideo from "@/components/HomeVideo";
import Footer from "@/components/footer";
import FAQSection from "@/components/FAQSection";
import QuickContactButton from "@/components/QuickContactButton";
import { CartProvider } from "@/components/cart/CartProvider";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
    const isHomePage = pathname === "/";

    const isAdminRoute = pathname?.startsWith("/admin");
  const isContentRoute = !pathname?.startsWith("/giris") &&
    !pathname?.startsWith("/kayit") &&
    !pathname?.startsWith("/odeme") &&
    !pathname?.startsWith("/hesabim") &&
    !pathname?.startsWith("/sepet") &&
    !pathname?.startsWith("/hakkimizda") &&
    !pathname?.startsWith("/iletisim") &&
    !pathname?.startsWith("/urunler") &&
    pathname !== "/mesafeli-satis";

  if (isAdminRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <CartProvider>
      <div className="corporate-theme overflow-x-hidden">
        <Header />
        <main>{children}</main>
        {isHomePage && <HomeVideo />}
        {isContentRoute && <FAQSection />}
        <Footer />
        <QuickContactButton />
      </div>
    </CartProvider>
  );
}

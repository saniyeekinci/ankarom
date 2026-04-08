"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import HomeVideo from "@/components/HomeVideo";
import Footer from "@/components/footer";
import FAQSection from "@/components/FAQSection";
import QuickContactButton from "@/components/QuickContactButton";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
    const isHomePage = pathname === "/";

    const isAdminRoute = pathname?.startsWith("/admin");
  const isContentRoute = !pathname?.startsWith("/giris") &&
    !pathname?.startsWith("/kayit") &&
    !pathname?.startsWith("/odeme") &&
    !pathname?.startsWith("/hesabim") &&
    !pathname?.startsWith("/sepetlerim") &&
    !pathname?.startsWith("/hakkimizda") &&
    !pathname?.startsWith("/iletisim") &&
    !pathname?.startsWith("/urunler");

  if (isAdminRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="corporate-theme">
      <Header />
        {isHomePage && <HomeVideo />}
      <main>{children}</main>
      {isContentRoute && <FAQSection />}
      <Footer />
      <QuickContactButton />
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen text-gray-200">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="text-gray-200">{children}</main>
      <Footer />
    </>
  );
}

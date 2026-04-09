import type { Metadata } from "next";
import "@/styles/global.css";
import "@/styles/reset.css";
import AppFrame from "@/components/layout/AppFrame";

export const metadata: Metadata = {
  title: "ANKAROM | Profesyonel Römork Üreticisi ve Taşıma Çözümleri",
  description: "20 yıllık mühendislik tecrübesiyle yüksek dayanımlı araç römorkları, platform römorklar, kapalı kasa ve özel üretim römork sistemleri üretiyoruz. Güvenli taşıma için kaliteyi keşfedin.",
  keywords: ["römork", "araç römorku", "platform römork", "kapalı kasa römork", "römork üreticisi", "Ankara römork", "ankarom"],
  icons: {
    icon: '/ankarom.png',
  },
  openGraph: {
    title: "ANKAROM | Profesyonel Römork ve Taşıma Çözümleri",
    description: "Yüksek dayanımlı, sertifikalı ve profesyonel araç römorku çözümleri.",
    url: 'https://ankarom.com',
    siteName: 'ANKAROM',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className="overflow-x-hidden" suppressHydrationWarning={true}>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}

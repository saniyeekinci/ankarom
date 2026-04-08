import type { Metadata } from "next";
import "@/styles/global.css";
import "@/styles/reset.css";
import AppFrame from "@/components/layout/AppFrame";

export const metadata: Metadata = {
  title: "ANKAROM",
  description: "Kurumsal römork ve otomotiv çözümleri platformu",
  icons: {
    icon: '/ankarom.png',
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
        className="" suppressHydrationWarning={true}>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}

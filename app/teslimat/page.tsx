import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Teslimat Bilgileri | ANKAROM",
  description:
    "ANKAROM standart ürün ve özel üretim römork hazırlık süreleri ve teslimat bilgileri.",
};

export default function DeliveryInformationPage() {
  return (
    <main className="min-h-screen bg-[#f5f4ef] text-[#202522]">
      <div className="border-b border-[#e2e0d9] bg-[#fbfaf7]">
        <div
          className="mx-auto flex max-w-6xl justify-center px-5 py-4 sm:px-8"
          style={{ marginInline: "auto" }}
        >
          <Breadcrumb
            items={[
              { label: "Ana Sayfa", href: "/" },
              { label: "Teslimat Bilgileri" },
            ]}
          />
        </div>
      </div>

      <div
        className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14"
        style={{ marginInline: "auto" }}
      >
        <header className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center" style={{ marginInline: "auto" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#718077]">
            ANKAROM / TESLİMAT
          </p>
          <h1 className="text-[34px] font-medium leading-tight sm:text-[44px]">
            Teslimat bilgileri
          </h1>
          <p className="text-[14px] leading-8 text-[#68716b]">
            Hazırlık süresi ürünün standart veya özel üretim olmasına göre değişir.
            Teslim alma yeri ve varsa taşıma ücreti sipariş öncesinde netleştirilir.
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2" aria-label="Üretim ve hazırlık süreleri">
          <article className="border border-[#e1dfd8] bg-white p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
              01 / STANDART ÜRÜNLER
            </p>
            <p className="mt-6 text-[48px] font-medium leading-none text-[#202522]">
              3
              <span className="ml-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[#777f78]">
                iş günü
              </span>
            </p>
            <p className="mt-5 text-[13px] leading-7 text-[#68716b]">
              Stokta bulunan standart ürünlerin hazırlık ve fabrikadan teslim
              için hazır olma süresi.
            </p>
          </article>

          <article className="border border-[#e1dfd8] bg-white p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
              02 / ÖZEL ÜRETİM
            </p>
            <p className="mt-6 text-[48px] font-medium leading-none text-[#202522]">
              10–15
              <span className="ml-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[#777f78]">
                iş günü
              </span>
            </p>
            <p className="mt-5 text-[13px] leading-7 text-[#68716b]">
              Özel ölçü ve ihtiyaçlara göre hazırlanan römorkların tahmini
              üretim süresi. Kesin plan sipariş detayları netleştikten sonra paylaşılır.
            </p>
          </article>
        </section>

        <section className="mt-8 border-t border-[#dcd9d1] pt-7 sm:mt-10 sm:pt-9">
          <h2 className="text-[20px] font-medium">Teslim alma ve taşıma</h2>
          <p className="mt-4 text-[13px] leading-8 text-[#59635c]">
            Römorklar standart kargo gönderisine uygun değildir. Fabrikadan teslim
            veya adrese taşıma seçeneği, teslim yeri ve varsa taşıma bedeli sipariş
            öncesinde sizinle teyit edilir. Yukarıdaki süreler ürünün hazırlık veya
            üretim süresidir; adrese taşıma süresi ayrıca planlanır.
          </p>
        </section>

        <div className="mt-9 flex flex-col items-center gap-4 border-t border-[#dcd9d1] pt-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[12px] leading-6 text-[#68716b]">
            Siparişinize özel süre ve teslimat planı için ekibimizle görüşün.
          </p>
          <Link
            href="tel:+905079586868"
            className="inline-flex min-h-11 items-center justify-center border border-[#1e344f] bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1e344f] transition-colors hover:bg-[#1e344f] hover:text-white"
          >
            +90 507 958 68 68
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { 
  ShieldCheckIcon, 
  WrenchScrewdriverIcon, 
  GlobeAltIcon,
  ArrowUpRightIcon 
} from "@heroicons/react/24/outline";

export default function HeroStatsCard() {
  return (
    <section className="relative flex justify-center min-h-[90vh] items-center overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-8">
      {/* Dekoratif Arka Plan Elemanları */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-blue-50 blur-[120px]" />
        <div className="absolute right-[10%] bottom-[20%] h-96 w-96 rounded-full bg-slate-50 blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Sol İçerik Alanı */}
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-blue-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Premium Römork Teknolojileri
            </div>

            <h1 className="text-4xl font-black leading-[1.1] text-slate-900 sm:text-6xl lg:text-7xl">
              Yolu Güvenle <br />
              <span className="text-blue-600">Sertifikala.</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-500">
              Ankarom, O1 ve O2 tip onay belgeli üretim standartlarıyla, 
              tekne, ATV ve özel taşıma ihtiyaçlarınız için mühendislik 
              odaklı çözümler sunar.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-4">
              <Link
                href="/urunler"
                className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200"
              >
                Kataloğu Keşfet
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/iletisim"
                className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-slate-600 transition-all hover:border-blue-600 hover:text-blue-600"
              >
                Teklif Al
              </Link>
            </div>
          </div>

          {/* Sağ Görsel/Kart Alanı */}
          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2">
              
              {/* Kart 1 - Belge */}
              <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Uluslararası Standart</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  O1 ve O2 Tip Onay belgeli, Avrupa normlarına tam uyumlu üretim süreci.
                </p>
              </div>

              {/* Kart 2 - Destek */}
              <div className="mt-0 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md sm:mt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Teknik Destek</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  Satış sonrası yedek parça ve teknik bakım garantisiyle kesintisiz operasyon.
                </p>
              </div>

              {/* Kart 3 - Yerli Üretim (Geniş) */}
              <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md sm:col-span-2">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Ankara Merkezli Yerli Üretim</h3>
                    <p className="text-sm text-slate-500">Türkiye'nin her yerine güvenli lojistik ve teslimat ağı.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
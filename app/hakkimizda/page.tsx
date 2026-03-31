"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  WrenchScrewdriverIcon, 
  GlobeAltIcon,
  ArrowUpRightIcon
} from "@heroicons/react/24/outline";

const stats = [
  { label: "Yıllık Üretim", value: "1.500+" },
  { label: "Deneyim", value: "20 Yıl" },
  { label: "Mutlu Müşteri", value: "5.000+" },
  { label: "İhracat", value: "12 Ülke" },
];

export default function AboutPage() {
  return (
    <main className="bg-[#fcfcfc] text-slate-900">
      
      {/* SECTION 1: MINIMALIST HERO */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-12 bg-indigo-600"></span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600">Biz Kimiz?</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[0.95] text-slate-900">
                Metale Form, <br />
                <span className="text-slate-400">Lojistiğe Güven</span> <br />
                Veriyoruz.
              </h1>
            </div>
            <div className="lg:pb-4">
              <p className="text-lg lg:text-xl text-slate-500 leading-relaxed max-w-md">
                Ankara'da başlayan yolculuğumuzda, bugün Türkiye'nin en dayanıklı römorklarını üreten bir teknoloji üssüne dönüştük.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE IMAGE BOX */}
      <section className="px-6 mb-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative h-[400px] lg:h-[600px] w-full overflow-hidden rounded-[40px] shadow-2xl">
            <Image
              src="/images/factory-bg.jpg"
              alt="Ankarom Üretim"
              fill
              className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-2">Üretim Tesisimiz</p>
              <h2 className="text-2xl font-bold">Ankara Kahramankazan Endüstri Bölgesi</h2>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATS STRIP */}
      <section className="bg-slate-900 py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center lg:text-left">
                <p className="text-5xl font-black text-white tracking-tighter mb-2">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CURATED CONTENT */}
      <section className="py-24 lg:py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
            
            <div className="lg:col-span-1">
              <h3 className="text-3xl font-bold tracking-tight mb-6">Vizyonumuz</h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                Sadece römork üretmiyoruz; taşımacılığın standartlarını yeniden tanımlıyoruz. Her tasarımımızda güvenlik, hafiflik ve maksimum taşıma kapasitesini optimize ediyoruz.
              </p>
              <Link href="/urunler" className="group flex items-center gap-3 text-indigo-600 font-bold">
                <span>Üretim Kataloğuna Git</span>
                <ArrowUpRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-10 w-10 text-indigo-600"><WrenchScrewdriverIcon /></div>
                <h4 className="text-xl font-bold">İleri Mühendislik</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  3D modelleme ve stres testleriyle, römorklarımızın ömrünü rakiplerimizden %40 daha uzun kılıyoruz.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-10 text-indigo-600"><ShieldCheckIcon /></div>
                <h4 className="text-xl font-bold">Global Standartlar</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Tüm ürünlerimiz Avrupa Birliği Tip Onay belgelerine sahiptir. Sınır ötesi taşımada tam uyumluluk sağlar.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-10 text-indigo-600"><UserGroupIcon /></div>
                <h4 className="text-xl font-bold">Usta İşçilik</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Robotik üretimle geleneksel el ustalığını birleştirerek hatasız kaynak ve montaj kalitesi sunuyoruz.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-10 text-indigo-600"><GlobeAltIcon /></div>
                <h4 className="text-xl font-bold">Hızlı Lojistik</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Kendi lojistik ağımızla Türkiye'nin 81 iline ve komşu ülkelere kapıdan kapıya teslimat yapıyoruz.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: SIGNATURE CTA */}
      <section className="pb-32 px-6">
        <div className="mx-auto max-w-7xl bg-indigo-50 rounded-[50px] p-12 lg:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-8">
              Profesyonel bir <br /> çözüm ortağı mı <br /> arıyorsunuz?
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/iletisim" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
                Bize Yazın
              </Link>
              <Link href="/bayilik" className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all">
                Bayilik Başvurusu
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
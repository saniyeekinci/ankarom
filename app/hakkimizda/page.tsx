"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ============================================
// ANIMATED COUNTER HOOK
// ============================================
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !hasStarted) {
              setHasStarted(true);
            }
          },
          { threshold: 0.3 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// ============================================
// CUSTOM ICONS
// ============================================
const QualityIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" className="text-blue-500/30" />
      <path
          d="M24 8L27.5 18H38L29.5 24.5L32 35L24 28L16 35L18.5 24.5L10 18H20.5L24 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-blue-500"
      />
    </svg>
);

const InnovationIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" className="text-blue-500/30" />
      <path
          d="M24 12V16M24 32V36M12 24H16M32 24H36M16.5 16.5L19.5 19.5M28.5 28.5L31.5 31.5M31.5 16.5L28.5 19.5M19.5 28.5L16.5 31.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-blue-500"
      />
      <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" />
    </svg>
);

const ReliabilityIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" className="text-blue-500/30" />
      <path
          d="M24 14L32 18V26C32 30.4 28.4 34 24 36C19.6 34 16 30.4 16 26V18L24 14Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-blue-500"
      />
      <path d="M20 24L23 27L28 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
    </svg>
);

// ============================================
// STATISTICS DATA
// ============================================
const statistics = [
  { value: 1000, suffix: "+", label: "Üretilen Römork" },
  { value: 15, suffix: "+", label: "İhracat Ülkesi" },
  { value: 20, suffix: "", label: "Yıllık Deneyim" },
  { value: 98, suffix: "%", label: "Müşteri Memnuniyeti" },
];

// ============================================
// CORE VALUES DATA
// ============================================
const coreValues = [
  {
    icon: QualityIcon,
    title: "Kalite",
    description: "Her kaynakta, her detayda uzlaşmasız kalite standardı. Avrupa normlarını aşan üretim disiplini.",
  },
  {
    icon: InnovationIcon,
    title: "İnovasyon",
    description: "CAD mühendisliği ve akıllı üretim hatlarıyla geleceğin taşımacılık çözümlerini bugünden tasarlıyoruz.",
  },
  {
    icon: ReliabilityIcon,
    title: "Güvenilirlik",
    description: "20 yılı aşkın sektör deneyimi. Zamanında teslimat ve kapsamlı garanti güvencesi.",
  },
];

// ============================================
// CERTIFICATIONS DATA
// ============================================
const certifications = [
  { name: "ISO 9001:2015", description: "Kalite Yönetim Sistemi" },
  { name: "CE Belgesi", description: "Avrupa Uygunluk Sertifikası" },
  { name: "TSE", description: "Türk Standartları Enstitüsü" },
  { name: "ADR", description: "Tehlikeli Madde Taşıma Onayı" },
];

// ============================================
// STAT CARD COMPONENT (HATAYI ÇÖZEN KISIM)
// ============================================
// Hook kurallarına uymak için istatistik kartını ayrı bir bileşene ayırdık
function StatCard({ stat }: { stat: { value: number; suffix: string; label: string } }) {
  const { count, ref } = useCountUp(stat.value, 2500);

  return (
    <div
      ref={ref}
      className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      <p className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-3">
        {count}
        <span className="text-blue-400">{stat.suffix}</span>
      </p>
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
        {stat.label}
      </p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
      <main className="relative overflow-hidden bg-white">

        {/* ==========================================
          HERO SECTION - Parallax Effect
      ========================================== */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background with parallax */}
          <div
              className="  absolute inset-0 z-0"
              style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <div className="inset-0 bg-gradient-to-br " />
            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                  backgroundSize: "60px 60px",
                }}
            />
            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
          </div>

          {/* Hero Content */}
          <div className="flex flex-col gap-6 relative z-10 px-6 text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400">
              20 Yıllık Mühendislik Mirası
            </span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-blue-500" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] text-white leading-[0.95] mb-8">
              Mühendislikte
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Mükemmeliyet.
            </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
              Türkiyenin kalbinden dünyaya uzanan, hassas mühendislik ve
              el ustalığının buluştuğu üretim merkezi.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                  href="/urunler"
                  className="group inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
              >
                <span>Ürünleri Keşfet</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                  href="#heritage"
                  className="inline-flex items-center gap-2 text-slate-400 px-6 py-4 font-medium text-sm uppercase tracking-wider transition-colors hover:text-white"
              >
                <span>Hikayemiz</span>
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* ==========================================
          THE HERITAGE (STORY) SECTION
      ========================================== */}
        <section id="heritage" className="py-24 lg:py-40 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Image Side */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
                  <Image
                      src="/images/factory-bg.jpg"
                      alt="Ankarom Üretim Tesisi"
                      fill
                      className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100">
                  <p className="text-4xl font-black text-slate-900 tracking-tight">2004</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">Kuruluş Yılı</p>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-blue-500/20 rounded-2xl -z-10" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50 rounded-2xl -z-10" />
              </div>

              {/* Text Side */}
              <div className="flex flex-col gap-4 order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="h-px w-12 bg-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                  Hikayemiz
                </span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-8">
                  Ankaradan Dünyaya
                  <br />
                  <span className="text-slate-400">Uzanan Yolculuk</span>
                </h2>

                <div className="space-y-6 text-slate-600 leading-relaxed">
                  <p className="text-lg">
                    2004 yılında, mühendisliğe olan tutkumuz ve kaliteden ödün vermeme
                    ilkemizle yola çıktık. Bugün, <strong className="text-slate-900">15den fazla ülkeye</strong> ihracat
                    yapan, Türkiyenin önde gelen römork üreticilerinden biri haline geldik.
                  </p>
                  <p>
                    Her römorkumuz, deneyimli mühendislerimizin titizliği ve modern
                    üretim teknolojilerinin gücüyle şekilleniyor. Amacımız sadece
                    taşımak değil; güvenle, verimle ve dayanıklılıkla taşımak.
                  </p>
                  <p>
                    Kahramankazandaki modern tesisimizde, geleneksel ustalık
                    ve ileri teknoloji bir arada. Her kaynak noktası, her montaj
                    detayı—hepsi aynı özeni taşıyor.
                  </p>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-100">
                  <div className="flex items-center gap-6">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                          <div
                              key={i}
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white flex items-center justify-center"
                          >
                            <span className="text-xs font-bold text-slate-500">{i * 20}+</span>
                          </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Uzman Kadro</p>
                      <p className="text-sm text-slate-500">60+ mühendis ve teknisyen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
          CORE VALUES SECTION
      ========================================== */}
        <section className="py-24 lg:py-32 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex flex-col gap-6 items-center mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                Temel Değerler
              </span>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                Başarımızın Temeli
              </h2>
              <p className="text-lg text-slate-500">
                Her ürettiğimiz römorku benzersiz kılan değerler ve ilkelerimiz.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                  <div
                      key={index}
                      className="group relative p-8 lg:p-10 rounded-3xl bg-white border border-slate-100 transition-all duration-500 hover:border-blue-200 hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)] hover:-translate-y-2"
                  >
                    {/* Glassmorphism overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/50 to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm" />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-16 h-16 mb-8 text-blue-500 transition-transform duration-500 group-hover:scale-110">
                        <value.icon />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                        {value.title}
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        {value.description}
                      </p>

                      {/* Bottom accent */}
                      <div className="mt-8 h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 group-hover:w-20" />
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
          STATISTICS SECTION
      ========================================== */}
        <section className="py-24 lg:py-32 px-6 bg-slate-900 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[80px]" />
          </div>

          <div className="flex flex-col gap-8 items-center  mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 mb-4 block">
              Rakamlarla Ankarom
            </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Etkimizi Ölçüyoruz
              </h2>
            </div>

            {/* Statistics Grid - HATANIN ÇÖZÜLDÜĞÜ YER */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {statistics.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
          QUALITY STANDARDS - BENTO GRID
      ========================================== */}
        <section className="py-24 lg:py-32 px-6 bg-white">
          <div className="max-w-8xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col gap-6 items-center w-full mx-auto mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                Kalite Standartları
              </span>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-500 mb-6">
                Hassas Mühendislik
              </h2>
              <p className="text-lg text-slate-500">
                Uluslararası standartlarda üretim, titiz kalite kontrol süreçleri.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Large Card - Spans 2 columns */}
              <div className="md:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden bg- p-8 lg:p-10 min-h-[320px] flex flex-col justify-end">
                <div className="absolute inset-0 opacity-20">
                  <Image
                      src="/images/factory-bg.jpg"
                      alt="Üretim Tesisi"
                      fill
                      className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    Uluslararası Sertifikalar
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Tüm üretim süreçlerimiz uluslararası kalite standartlarına uygun
                    olarak belgelenmiştir.
                  </p>
                </div>
              </div>

              {/* Certification Cards */}
              {certifications.map((cert, index) => (
                  <div
                      key={index}
                      className="relative rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-6 lg:p-8 flex flex-col justify-between min-h-[180px] group hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{cert.name}</p>
                      <p className="text-sm text-slate-500 mt-1">{cert.description}</p>
                    </div>
                  </div>
              ))}

              {/* Precision Card */}
              <div className="md:col-span-2 rounded-3xl bg-blue-500/20 p-8 text-white flex items-center gap-6">
                <div className="shrink-0 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-xl mb-1">Hassas Üretim Toleransı</p>
                  <p className="text-blue-100 text-sm">±0.5mm tolerans aralığında CNC işleme ve robotik kaynak</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
          CTA FOOTER
      ========================================== */}
        <section className="py-24 lg:py-32 px-6 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-8xl mx-auto  ">
            <div className="flex flex-col items-center  relative rounded-[40px] bg-slate-300 p-12 lg:p-20 overflow-hidden text-center">
              {/* Background elements */}
              <div className="absolute inset-0 ">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                      backgroundSize: "40px 40px",
                    }}
                />
              </div>

              <div className="relative z-10  ">
                <div className="   inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-8">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                  İş Birliğine Açığız
                </span>
                </div>

                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                  Birlikte
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                  Üretelim.
                </span>
                </h2>

                <p className="text-lg text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed">
                  Projeleriniz için özel çözümler üretiyoruz. Fikirlerinizi
                  gerçeğe dönüştürmek için bizimle iletişime geçin.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                      href="/iletisim"
                      className="group inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_20px_50px_rgba(59,130,246,0.35)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.45)] hover:-translate-y-1"
                  >
                    <span>Teklif Alın</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                      href="tel:+903125555555"
                      className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-wider border border-white/10 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Hemen Arayın</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
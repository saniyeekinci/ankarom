import Image from "next/image";
import Link from "next/link";

const principles = [
  {
    title: "Operasyon Öncelikli",
    text: "Gerçek saha ihtiyaçlarını merkeze alır, sadece estetik değil ölçülebilir fayda üretiriz.",
  },
  {
    title: "Yalın ve Hızlı",
    text: "Karmaşık süreçleri sadeleştirir, ekiplerin daha kısa sürede daha doğru karar almasını sağlarız.",
  },
  {
    title: "Sürekli Evrim",
    text: "Platformumuzu müşteri geri bildirimiyle sürekli geliştirir, canlı bir ürün yaklaşımıyla ilerleriz.",
  },
];

const milestones = [
  { year: "2018", label: "Temel Atıldı", detail: "Ankarom, otomotiv operasyonlarını dijitalleştirme hedefiyle kuruldu." },
  { year: "2020", label: "İlk Kurumsal Yayın", detail: "Filo ve servis süreçlerini birleştiren ilk platform sürümü devreye alındı." },
  { year: "2023", label: "Modüler Büyüme", detail: "Yedek parça, raporlama ve müşteri yönetimi modülleri aktif kullanıma geçti." },
  { year: "2026", label: "Yeni Nesil Deneyim", detail: "Hız, sadelik ve kurumsal UX odağıyla platform baştan tasarlandı." },
];

export default function HakkimizdaPage() {
  return (
    <section className="w-full bg-slate-950 py-10 text-slate-100 sm:py-14 lg:py-20">
      <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-y-24 px-6 md:px-12 lg:gap-y-28">
        <header className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/55 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.45)] sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">About Ankarom</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.14] sm:text-5xl sm:leading-[1.12] lg:text-6xl lg:leading-[1.1]">
              Operasyonu sadeleştiren,
              <br />
              veriyi eyleme dönüştüren
              <br />
              bir teknoloji ekibiyiz.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Ankarom; filo, servis, yedek parça ve müşteri süreçlerini tek bir akışta birleştirir. Hedefimiz sadece
              yazılım sunmak değil, ekiplerin günlük karar hızını somut şekilde artırmaktır.
            </p>
          </div>
          <div className="grid gap-8 lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Aktif Müşteri</p>
              <p className="mt-1 text-3xl font-black">240+</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Canlı Entegrasyon</p>
              <p className="mt-1 text-3xl font-black">17</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Süreklilik</p>
              <p className="mt-1 text-3xl font-black">99.9%</p>
            </div>
          </div>
        </header>

        <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-14">
          <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/55 shadow-[0_24px_70px_rgba(2,6,23,0.45)] lg:col-span-7">
            <div className="relative h-full min-h-95 w-full">
              <Image
                src="/products/service-planning-v2.jpg"
                alt="Ankarom operasyon yönetim yaklaşımı"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-0 p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">Misyon</p>
                <p className="mt-3 max-w-xl text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Saha gerçekliğine uygun, hızlı öğrenilen ve kalıcı verimlilik üreten platformlar inşa etmek.
                </p>
              </div>
            </div>
          </article>

          <aside className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/55 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.45)] sm:p-8 lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Prensiplerimiz</p>
            <div className="mt-8 space-y-8 lg:space-y-9">
              {principles.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.45)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl font-black sm:text-4xl">Yolculuk</h2>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">2018 — 2026</p>
          </div>

          <div className="mt-12 border-l-2 border-white/15 pl-5 sm:pl-7">
            <div className="space-y-8">
              {milestones.map((item) => (
                <article key={item.year} className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
                  <span className="absolute -left-9.5 top-6 h-4 w-4 rounded-full border-2 border-slate-950 bg-amber-300" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.year}</p>
                  <h3 className="mt-2 text-xl font-bold">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-900 bg-slate-900 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Birlikte Çalışalım</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            Operasyonuna uygun çözümü
            <br />
            birlikte planlayalım.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Sektörünüz, operasyon hacminiz ve ekip yapınıza göre en doğru modül kombinasyonunu kısa bir keşif
            görüşmesiyle netleştirelim.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className="rounded-xl border border-amber-400 bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-amber-400"
            >
              Keşif Görüşmesi Al
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
            >
              Anasayfa
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}

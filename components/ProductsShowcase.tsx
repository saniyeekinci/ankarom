import { ChartBarIcon, ClockIcon, ShieldCheckIcon, TruckIcon, BuildingOffice2Icon, AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";

const featureCards = [
  {
    icon: ShieldCheckIcon,
    title: "Güvenli Operasyon",
    description: "Dayanıklı yapı ve kontrollü iş akışıyla sahada güven veren kurumsal kullanım.",
  },
  {
    icon: ChartBarIcon,
    title: "Şeffaf Raporlama",
    description: "KPI ve süreç görünürlüğünü tek ekranda birleştirerek karar alma hızını artırın.",
  },
  {
    icon: ClockIcon,
    title: "Hızlı Devreye Alma",
    description: "Kurulum ve uyarlama süreçleri sade olduğu için ekipler daha kısa sürede üretken olur.",
  },
  {
    icon: TruckIcon,
    title: "Saha Odaklı Taşıma",
    description: "Operasyon yükünü hafifleten, sahaya uygun taşıma ve planlama mimarisi.",
  },
  {
    icon: BuildingOffice2Icon,
    title: "Kurumsal Ölçek",
    description: "Büyüyen ekipler ve çok lokasyonlu operasyonlar için düzenli ve ölçeklenebilir yapı.",
  },
  {
    icon: AdjustmentsVerticalIcon,
    title: "Esnek Konfigürasyon",
    description: "İhtiyaca göre düzenlenebilen yapı sayesinde çözümü ekibe uyarlamak kolaylaşır.",
  },
];

export default function ProductsShowcase() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className=" flex flex-col gap-4 mx-auto w-full max-w-360 rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="flex flex-col gap-4 items-start mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Kurumsal Avantajlar</p>
          <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">Sadelik, hız ve ölçülebilir sonuçlar</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Ankarom, operasyonları karmaşadan arındırıp ekiplerin daha net, daha hızlı ve daha güvenli çalışmasını sağlayan bir kurumsal deneyim sunar.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition-transform duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
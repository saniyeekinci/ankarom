import {
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  TruckIcon,
  BuildingOffice2Icon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/outline";

const featureCards = [
  {
    icon: ShieldCheckIcon,
    number: "01",
    title: "Güvenli Operasyon",
    description:
      "Ürünlerimiz, güvenlik standartları gözetilerek tasarlanır ve sertifikalandırılır. Her taşıma sürecinde güvenilir ve kontrollü bir kullanım sunar.",
  },
  {
    icon: ChartBarIcon,
    number: "02",
    title: "İzlenebilir Üretim Süreci",
    description:
      "Üretimin her aşamasında kalite kontrol süreçleri uygulanır. Römorkunuzun üretim sürecini şeffaf ve kontrollü bir yapı içerisinde takip edebilirsiniz.",
  },
  {
    icon: ClockIcon,
    number: "03",
    title: "Hızlı Devreye Alma",
    description:
      "Siparişten teslimata kadar planlı bir süreç yürütülür. Kullanıcı odaklı tasarım sayesinde ürününüzü teslim aldıktan sonra kolayca kullanmaya başlayabilirsiniz.",
  },
  {
    icon: TruckIcon,
    number: "04",
    title: "Saha Odaklı Taşıma",
    description:
      "Farklı arazi ve kullanım koşulları düşünülerek geliştirilen römorklarımız, dayanıklılık ve işlevselliği bir arada sunar.",
  },
  {
    icon: BuildingOffice2Icon,
    number: "05",
    title: "Kurumsal Ölçek",
    description:
      "İşletmenizin büyüklüğüne ve operasyonel ihtiyaçlarına göre şekillenebilen üretim kapasitesi ve esnek çözümler sunuyoruz.",
  },
  {
    icon: AdjustmentsVerticalIcon,
    number: "06",
    title: "Esnek Konfigürasyon",
    description:
      "Farklı taşıma ihtiyaçlarına uygun seçenekler, aksesuarlar ve özel tasarım çözümleriyle römorkunuzu kullanım amacınıza göre şekillendirin.",
  },
];

export default function ProductsShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#fcfcfb] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
      
      {/* İnce arka plan çizgileri */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-[#eaf0f7]" />

      <div className="relative !mx-auto w-full max-w-[1380px]">

        {/* Başlık alanı */}
        <div className="!mx-auto max-w-4xl text-center">

          <div>
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-[#8ea8c7]" />

              <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#969089]">
                NEDEN ANKAROM
              </span>
            </div>

            <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-[#aaa49f]">
              01 — Üretim & Performans
            </p>
          </div>

          <div className="!mx-auto mt-8 max-w-[850px]">
            <h2 className="text-3xl font-medium leading-[1.2] tracking-[-0.025em] text-[#171717] sm:text-4xl lg:text-5xl">
              İşiniz için tasarlanan,
              <br />
              <span className="text-[#8e8880]">
                güvenilir taşıma çözümleri.
              </span>
            </h2>

            <p className="!mx-auto mt-8 max-w-[700px] text-sm leading-8 text-[#77716a] sm:text-base sm:leading-9">
              Ankarom olarak; tekneden jet skiye, ATV’den motosiklete kadar
              farklı taşıma ihtiyaçları için dayanıklı, güvenli ve kullanım
              amacına göre şekillendirilebilen römorklar üretiyoruz.
            </p>
          </div>
        </div>

        {/* Özellikler */}
        <div className="mt-20 border-t border-[#d9e3ef]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className={`group relative border-b border-[#d9e3ef] px-2 py-10 text-center transition-colors duration-300 hover:bg-[#f1f5fa] sm:px-8 lg:px-10 ${
                    index % 3 !== 2
                      ? "lg:border-r"
                      : ""
                  } ${
                    index % 2 !== 1
                      ? "sm:border-r lg:border-r"
                      : ""
                  }`}
                >
                  {/* Üst satır */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium tracking-[0.22em] text-[#aaa49c]">
                      {card.number}
                    </span>

                    <Icon className="h-5 w-5 stroke-[1.2] text-[#8d877f] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#52749b]" />
                  </div>

                  {/* Başlık */}
                  <h3 className="!mx-auto mt-12 max-w-[260px] text-xl font-medium leading-8 tracking-[-0.015em] text-[#24211e]">
                    {card.title}
                  </h3>

                  {/* Açıklama */}
                  <p className="!mx-auto mt-6 max-w-[330px] text-[13px] leading-8 text-[#7b756e]">
                    {card.description}
                  </p>

                  {/* Alt detay */}
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <span className="h-px w-5 bg-[#8ea8c7] transition-all duration-300 group-hover:w-10" />

                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#aaa49f]">
                      ANKAROM
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Alt vurgu */}
        <div className="!mx-auto mt-16 flex max-w-4xl flex-col items-center gap-6 border-t border-[#d9e3ef] pt-8 text-center sm:flex-row sm:justify-between">
          <p className="max-w-[600px] text-[11px] leading-7 text-[#98928a]">
            Dayanıklılık, güvenlik ve işlevselliği bir araya getiren
            çözümlerle farklı taşıma ihtiyaçlarına cevap veriyoruz.
          </p>

          <a
            href="/urunler"
            className="group inline-flex items-center gap-4 self-center border-b border-[#24211e] pb-2 text-[9px] font-medium uppercase tracking-[0.22em] text-[#24211e] transition-all duration-300 hover:border-[#7896bb] hover:text-[#52749b] sm:self-auto"
          >
            <span>Ürünleri Keşfet</span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
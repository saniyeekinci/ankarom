"use client";

export default function HomeVideo() {
  return (
    <section className="relative flex min-h-[calc(100vh-82px)] w-full items-center overflow-hidden bg-[#fcfcfb] px-6 text-center">
      
      {/* Çok hafif arka plan detayları */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#dce6f2]" />
        <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#eaf0f7]" />
      </div>

      <div className="relative !mx-auto flex w-full max-w-[1100px] flex-col items-center">

        {/* Üst küçük başlık */}
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-10 bg-[#8ea8c7]" />

          <span className="text-[9px] font-medium uppercase tracking-[0.38em] text-[#8f8981] sm:text-[10px]">
            ANKAROM · TAŞIMACILIK ÇÖZÜMLERİ
          </span>

          <span className="h-px w-10 bg-[#8ea8c7]" />
        </div>

        {/* Ana başlık */}
        <h1 className="max-w-5xl text-[38px] font-medium leading-[1.2] tracking-[-0.035em] text-[#171717] sm:text-5xl md:text-6xl lg:text-[76px]">
          Taşımacılıkta
          <br />

          <span className="text-[#8c867e]">
            yeni bir standart.
          </span>
        </h1>

        {/* Açıklama */}
        <p className="mt-8 max-w-[650px] text-[14px] leading-8 text-[#77716a] sm:text-base sm:leading-9">
          Sertifikalı düşürülebilir römork teknolojisi ile güvenli,
          dayanıklı ve ihtiyaca yönelik taşıma çözümleri sunuyoruz.
        </p>

        {/* Butonlar */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">

          <a
            href="/urunler"
            className="group inline-flex h-14 min-h-14 items-center justify-center gap-4 rounded-2xl border border-[#c5d3e4] bg-white px-7 text-[10px] font-medium uppercase tracking-[0.22em] text-[#24211e] transition-all duration-300 hover:border-[#7896bb] hover:bg-[#f1f5fa] hover:text-[#52749b]"
          >
            <span>Kataloğu İncele</span>

            <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>

          <button
            onClick={() =>
              document
                .getElementById("stats-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex h-14 min-h-14 items-center justify-center gap-4 border border-[#c5d3e4] bg-white px-7 text-[10px] font-medium uppercase tracking-[0.22em] text-[#24211e] transition-all duration-300 hover:border-[#7896bb] hover:bg-[#f1f5fa] hover:text-[#52749b]"
          >
            <span>Daha Fazla Bilgi</span>

            <span className="text-[#8f8981] transition-all duration-300 group-hover:translate-y-1 group-hover:text-[#52749b]">
              ↓
            </span>
          </button>

        </div>

        {/* Alt bilgi */}
        <div className="mt-16 flex items-center gap-8 text-[9px] uppercase tracking-[0.25em] text-[#aaa49f] sm:mt-20">
          <span>O1 / O2</span>

          <span className="h-3 w-px bg-[#c5d3e4]" />

          <span>Ankara Üretim</span>

          <span className="h-3 w-px bg-[#c5d3e4]" />

          <span>Güvenilir Çözüm</span>
        </div>
      </div>

      {/* Aşağı yönlendirme */}
      <button
        onClick={() =>
          document
            .getElementById("stats-section")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        aria-label="Aşağı kaydır"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[#aaa49f] transition-colors duration-300 hover:text-[#52749b]"
      >
        <span className="text-[8px] uppercase tracking-[0.3em]">
          Keşfet
        </span>

        <span className="h-8 w-px bg-[#8ea8c7]" />
      </button>
    </section>
  );
}
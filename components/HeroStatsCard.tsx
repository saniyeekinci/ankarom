export default function HeroStatsCard() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-6 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-600/18 blur-3xl" />
        <div className="absolute -left-10 bottom-14 h-72 w-72 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-cyan-500/12 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-360 rounded-4xl border border-white/10 bg-slate-900/50 p-7 shadow-[0_28px_90px_rgba(2,6,23,0.48)] backdrop-blur-xl sm:p-10 lg:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
          <div className="space-y-7 lg:col-span-7">
            <span className="inline-flex items-center rounded-full border border-amber-300/25 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Premium Otomotiv Çözümleri
            </span>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              İşinizi hızlandıran, modern ve kurumsal dijital otomotiv deneyimi
            </h1>

            <p className="max-w-3xl text-base leading-relaxed text-slate-100/90 sm:text-lg">
              Ankarom ile operasyonel süreçlerinizi tek bir platformda yönetin. Güçlü altyapı, sade kullanıcı deneyimi ve ölçeklenebilir yapı ile ekibinizi bir üst seviyeye taşıyın.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/iletisim"
                className="rounded-xl border border-amber-400/60 bg-amber-500 px-7 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(245,158,11,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_22px_40px_rgba(245,158,11,0.5)]"
              >
                Demo Talep Et
              </a>
              <a
                href="/hakkimizda"
                className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Daha Fazla Bilgi
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-linear-to-tr from-cyan-400/12 via-indigo-400/8 to-amber-400/10 blur-2xl" />
            <div className="relative rounded-[30px] border border-white/15 bg-slate-950/72 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.6)] ring-1 ring-white/8 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                    Aktif Müşteri
                  </p>
                  <p className="mt-2 text-4xl font-bold text-white">+240</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                    Canlı Entegrasyon
                  </p>
                  <p className="mt-2 text-4xl font-bold text-white">17</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                    Platform Performansı
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">99.9% Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
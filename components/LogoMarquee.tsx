import Image from "next/image";

const logos = [
  { src: "/ankarom.png", alt: "Ankarom" },
  { src: "/ankarom.png", alt: "Ankarom" },
  { src: "/ankarom.png", alt: "Ankarom" },
  { src: "/ankarom.png", alt: "Ankarom" },
  { src: "/ankarom.png", alt: "Ankarom" },
  { src: "/ankarom.png", alt: "Ankarom" },
];

export default function LogoMarquee() {
  const repeatedLogos = [...logos, ...logos];

  return (
    <section className="w-full py-12 sm:py-16">
      <div className="relative mx-auto w-full max-w-360 px-6 md:px-12">
        <div className="mb-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Güvenilen Marka Yapısı</p>
        </div>

        <div className="w-full overflow-hidden">
          <ul className="marquee-track flex w-max items-center gap-14 sm:gap-20">
            {repeatedLogos.map((logo, index) => (
              <li
                key={`${logo.alt}-${index}`}
                className="flex h-24 w-52 shrink-0 items-center justify-center bg-transparent px-3 sm:w-48"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={240}
                  height={100}
                  className="brand-mark h-auto max-h-20 w-auto object-contain opacity-90"
                  priority={index < logos.length}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
"use client";

import Link from "next/link";

// WhatsApp Number: +90 506 544 04 66
const whatsappHref = "https://wa.me/905065440466?text=İyi%20günler,%20hizmetleriniz%20hakkında%20detaylı%20bilgi%20alabilir%20miyim?";

export default function QuickContactButton() {
  return (
    <Link
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile hızlı iletişim"
      title="WhatsApp ile hızlı iletişim"
      className="quick-contact-pulse fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-500 text-slate-50 shadow-[0_12px_28px_rgba(22,163,74,0.24)] transition-transform hover:-translate-y-0.5 hover:bg-emerald-600 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.884-.788-1.48-1.76-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.173.2-.297.299-.495.1-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.307 1.262.49 1.693.626.711.227 1.359.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.075-.124-.273-.198-.57-.347M12.05 2C6.477 2 1.95 6.526 1.95 12.1c0 1.771.463 3.5 1.343 5.023L2 22l5.019-1.317a10.05 10.05 0 0 0 5.03 1.355h.004c5.572 0 10.1-4.526 10.1-10.1C22.15 6.526 17.622 2 12.05 2m0 18.361h-.003a8.35 8.35 0 0 1-4.257-1.168l-.305-.18-2.979.781.795-2.905-.199-.298a8.36 8.36 0 0 1-1.287-4.49c0-4.622 3.761-8.384 8.386-8.384 2.24 0 4.347.872 5.932 2.456a8.33 8.33 0 0 1 2.453 5.928c-.001 4.623-3.763 8.384-8.386 8.384" />
      </svg>
    </Link>
  );
}
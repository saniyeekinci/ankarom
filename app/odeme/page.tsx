"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  LockClosedIcon,
  TruckIcon,
  CreditCardIcon,
  BuildingOffice2Icon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  catalogActionStyle,
  setCatalogActionAppearance,
} from "@/lib/catalogAction";
import { useCart } from "@/components/cart/CartProvider";
import { getCatalogOnlyProducts } from "@/lib/products";

const exampleProduct = getCatalogOnlyProducts()[0];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const orderItems = items.length > 0
    ? items
    : exampleProduct
    ? [{ ...exampleProduct, quantity: 1 }]
    : [];
  const orderTotal = items.length > 0
    ? subtotal
    : exampleProduct?.discountPrice ?? exampleProduct?.price ?? 0;
  const vat = orderTotal - orderTotal / 1.2;
  const subtotalBeforeVat = orderTotal - vat;
  const orderItemCount = orderItems.reduce((total, item) => total + item.quantity, 0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="checkout-page min-h-screen bg-[#f5f4ef] text-[#202522]">
      {/* ÜST BAR */}
      <div className="border-b border-[#e2e0d9] bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8" style={{ marginInline: "auto" }}>
          <Link
            href="/sepet"
            className="catalog-action group inline-flex items-center gap-5 border border-[#1e344f] bg-white px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em]"
            onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
            onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
            onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
            onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
            style={catalogActionStyle}
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Sepete dön
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7b827d]">
            <LockClosedIcon className="h-3.5 w-3.5" />
            Güvenli ödeme
          </div>
        </div>
      </div>

      {/* BAŞLIK */}
      <header className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14" style={{ marginInline: "auto" }}>
        <div className="flex max-w-3xl flex-col gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718077]">
            ANKAROM / SİPARİŞ
          </p>

          <h1 className="text-[32px] font-medium leading-tight text-[#202522] sm:text-[42px]">
            Ödeme ve teslimat
          </h1>

          <p className="max-w-2xl text-[13px] leading-8 text-[#68716b] sm:text-[14px]">
            Römork siparişiniz için teslimat, fatura ve ödeme bilgilerinizi
            eksiksiz olarak tamamlayın.
          </p>
        </div>

        {/* ADIMLAR */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#29483c]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center bg-[#29483c] text-white">
              1
            </span>
            Bilgiler
          </div>

          <span className="h-px w-8 bg-[#d6d5cf]" />

          <div className="flex items-center gap-2 text-[#9a9f9b]">
            <span className="flex h-7 w-7 items-center justify-center border border-[#d6d5cf]">
              2
            </span>
            Ödeme
          </div>

          <span className="h-px w-8 bg-[#d6d5cf]" />

          <div className="flex items-center gap-2 text-[#9a9f9b]">
            <span className="flex h-7 w-7 items-center justify-center border border-[#d6d5cf]">
              3
            </span>
            Onay
          </div>
        </div>
      </header>

      {/* ANA ALAN */}
      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8" style={{ marginInline: "auto" }}>
        <form
          onSubmit={handleSubmit}
          className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          {/* SOL */}
          <div className="flex flex-col gap-8">
            {/* MÜŞTERİ BİLGİLERİ */}
            <section className="border border-[#e1dfd8] bg-white p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-[#ebe9e3] pb-5">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
                    01
                  </p>
                  <h2 className="text-[20px] font-medium text-[#202522]">
                    Müşteri bilgileri
                  </h2>
                  <p className="text-[12px] leading-6 text-[#7b827d]">
                    Sipariş iletişimi için kullanılacaktır.
                  </p>
                </div>

                <BuildingOffice2Icon className="h-6 w-6 text-[#8a948d]" />
              </div>

              <div className="grid gap-6 pt-7 sm:grid-cols-2">
                <Field
                  label="Ad"
                  name="firstName"
                  autoComplete="given-name"
                />

                <Field
                  label="Soyad"
                  name="lastName"
                  autoComplete="family-name"
                />

                <Field
                  label="E-posta"
                  name="email"
                  type="email"
                  autoComplete="email"
                />

                <Field
                  label="Telefon"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </section>

            {/* FATURA BİLGİLERİ */}
            <section className="border border-[#e1dfd8] bg-white p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-[#ebe9e3] pb-5">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
                    02
                  </p>
                  <h2 className="text-[20px] font-medium">
                    Fatura bilgileri
                  </h2>
                  <p className="text-[12px] leading-6 text-[#7b827d]">
                    Faturanızın düzenlenmesi için bilgilerinizi girin.
                  </p>
                </div>

                <CreditCardIcon className="h-6 w-6 text-[#8a948d]" />
              </div>

              <div className="flex gap-4 pt-7">
                <label className="flex flex-1 cursor-pointer items-center gap-3 border border-[#dcded9] p-5 transition hover:border-[#29483c]">
                  <input
                    type="radio"
                    name="invoiceType"
                    value="individual"
                    defaultChecked
                    className="accent-[#29483c]"
                  />
                  <span>
                    <span className="block text-[12px] font-semibold">
                      Bireysel
                    </span>
                    <span className="mt-1 block text-[11px] text-[#7b827d]">
                      Bireysel fatura
                    </span>
                  </span>
                </label>

                <label className="flex flex-1 cursor-pointer items-center gap-3 border border-[#dcded9] p-5 transition hover:border-[#29483c]">
                  <input
                    type="radio"
                    name="invoiceType"
                    value="company"
                    className="accent-[#29483c]"
                  />
                  <span>
                    <span className="block text-[12px] font-semibold">
                      Kurumsal
                    </span>
                    <span className="mt-1 block text-[11px] text-[#7b827d]">
                      Şirket faturası
                    </span>
                  </span>
                </label>
              </div>

              <div className="pt-5">
                <Field
                  label="T.C. Kimlik No / Vergi No"
                  name="taxNumber"
                  placeholder="Bilginizi girin"
                />
              </div>
            </section>

            {/* TESLİMAT */}
            <section className="border border-[#e1dfd8] bg-white p-5 sm:p-8">
              <div className="border-b border-[#ebe9e3] pb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
                  03
                </p>

                <h2 className="text-[20px] font-medium">
                  Teslimat yöntemi
                </h2>

                <p className="text-[12px] leading-6 text-[#7b827d]">
                  Römorkunuzun teslim şekline karar verin.
                </p>
              </div>

              <div className="flex flex-col gap-5 pb-6 pt-7">
                <DeliveryOption
                  value="delivery"
                  selected={deliveryMethod === "delivery"}
                  onChange={setDeliveryMethod}
                  icon={<TruckIcon className="h-5 w-5" />}
                  title="Adrese teslim"
                  description="Ankarom tarafından belirlenen teslimat koşullarıyla"
                  price="Teslimat ücreti ayrıca hesaplanır"
                />

                <DeliveryOption
                  value="pickup"
                  selected={deliveryMethod === "pickup"}
                  onChange={setDeliveryMethod}
                  icon={<MapPinIcon className="h-5 w-5" />}
                  title="Şubeden / merkezden teslim"
                  description="Römorkunuzu belirlenen noktadan teslim alın"
                  price="Ücretsiz"
                />
              </div>

              {deliveryMethod === "delivery" && (
                <div className="border-t border-[#ebe9e3] pt-6">
                  <Field
                    label="Teslimat adresi"
                    name="address"
                    textarea
                    autoComplete="street-address"
                    placeholder="Mahalle, cadde, sokak, bina no, ilçe..."
                  />

                  <div className="grid gap-6 pt-6 sm:grid-cols-2">
                    <Field label="İl" name="city" placeholder="Ankara" />
                    <Field label="İlçe" name="district" />
                  </div>

                  <div className="pt-6">
                    <label className="block text-[12px] font-medium text-[#39443c]">
                      Teslimat notu
                      <textarea
                        name="deliveryNote"
                        rows={3}
                        placeholder="Varsa teslimatla ilgili özel notunuz..."
                        className="mt-2 w-full resize-y border border-[#d8ddd8] bg-[#fcfcfa] px-3 py-3 text-[13px] leading-6 outline-none transition placeholder:text-[#a5aaa6] focus:border-[#29483c]"
                      />
                    </label>
                  </div>
                </div>
              )}
            </section>

            {/* ÖDEME */}
            <section className="border border-[#e1dfd8] bg-white p-5 sm:p-8">
              <div className="border-b border-[#ebe9e3] pb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
                  04
                </p>

                <h2 className="text-[20px] font-medium">
                  Ödeme yöntemi
                </h2>

                <p className="text-[12px] leading-6 text-[#7b827d]">
                  Römork siparişleri için kullanılabilir ödeme yöntemini seçin.
                </p>
              </div>

              <div className="flex flex-col gap-5 pb-6 pt-7">
                <PaymentOption
                  value="transfer"
                  selected={paymentMethod === "transfer"}
                  onChange={setPaymentMethod}
                  title="Havale / EFT"
                  description="Sipariş onayından sonra banka bilgileri paylaşılır."
                />

                <PaymentOption
                  value="card"
                  selected={paymentMethod === "card"}
                  onChange={setPaymentMethod}
                  title="Kredi / banka kartı"
                  description="Güvenli ödeme altyapısı üzerinden kartla ödeme."
                />

                <PaymentOption
                  value="contact"
                  selected={paymentMethod === "contact"}
                  onChange={setPaymentMethod}
                  title="Satış danışmanıyla görüş"
                  description="Ödeme ve teslimat detaylarını uzmanımızla netleştirin."
                />
              </div>

              {paymentMethod === "card" && (
                <div className="border-t border-[#ebe9e3] pt-6">
                  <div className="grid gap-6">
                    <Field
                      label="Kart üzerindeki ad soyad"
                      name="cardName"
                    />

                    <Field
                      label="Kart numarası"
                      name="cardNumber"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        label="Son kullanma tarihi"
                        name="expiry"
                        placeholder="AA / YY"
                      />

                      <Field
                        label="CVV"
                        name="cvv"
                        inputMode="numeric"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* SÖZLEŞMELER */}
            <section className="flex flex-col gap-4 border border-[#e1dfd8] bg-white p-5 sm:p-8">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 accent-[#29483c]"
                />
                <span className="text-[12px] leading-6 text-[#68716b]">
                  Ön bilgilendirme formunu ve satış sözleşmesini okudum,
                  onaylıyorum.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 accent-[#29483c]"
                />
                <span className="text-[12px] leading-6 text-[#68716b]">
                  Kişisel verilerimin siparişimin tamamlanması amacıyla
                  işlenmesini kabul ediyorum.
                </span>
              </label>
            </section>
          </div>

          {/* SAĞ - SİPARİŞ ÖZETİ */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="border border-[#e1dfd8] bg-white">
              <div className="border-b border-[#ebe9e3] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718077]">
                  Sipariş özeti
                </p>

                <h2 className="mt-2 text-[21px] font-medium">
                  Siparişiniz ({orderItemCount} ürün)
                </h2>
              </div>

              <div className="flex flex-col gap-6 p-6">
                {/* ÜRÜN */}
                <div className="flex flex-col gap-5 border-b border-[#ebe9e3] pb-5">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 bg-[#f3f2ed]">
                        <Image
                          src={item.images?.[0] || item.imageUrl || "/romork.png"}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex min-w-0 flex-col gap-2">
                        <p className="text-[12px] font-semibold leading-6 text-[#303832]">
                          {item.name}
                        </p>
                        <p className="text-[11px] leading-6 text-[#7b827d]">
                          {item.quantity} adet
                        </p>
                        <p className="text-[13px] font-semibold">
                          {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FİYATLAR */}
                <div className="flex flex-col gap-4 border-b border-[#ebe9e3] py-5 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#737b75]">Ara toplam</span>
                    <span className="font-medium">{formatPrice(subtotalBeforeVat)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#737b75]">KDV (%20)</span>
                    <span className="font-medium">{formatPrice(vat)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#737b75]">Teslimat</span>
                    <span className="font-medium">
                      {deliveryMethod === "pickup"
                        ? "Ücretsiz"
                        : "Hesaplanacak"}
                    </span>
                  </div>
                </div>

                {/* TOPLAM */}
                <div className="flex items-end justify-between pt-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#858d86]">
                      Genel toplam
                    </p>
                    <p className="mt-1 text-[11px] text-[#858d86]">
                      KDV dahil
                    </p>
                  </div>

                  <strong className="text-[25px] font-semibold text-[#202522]">
                    {formatPrice(orderTotal)}
                  </strong>
                </div>

                <button
                  type="submit"
                  className="catalog-action group mt-6 flex w-full items-center justify-center gap-5 border border-[#1e344f] bg-white px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em]"
                  onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                  onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                  onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                  onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                  style={catalogActionStyle}
                >
                  Siparişi tamamla
                  <ArrowLeftIcon className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>

                {/* GÜVEN */}
                <div className="mt-5 border-t border-[#ebe9e3] pt-5">
                  <div className="flex items-start gap-3">
                    <LockClosedIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#66806f]" />

                    <p className="text-[10px] leading-5 text-[#7b827d]">
                      Bilgileriniz güvenli şekilde işlenir. Ödeme ve teslimat
                      süreci sipariş onayından sonra Ankarom satış ekibi
                      tarafından sizinle paylaşılır.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DESTEK */}
            <div className="mt-4 border border-[#e1dfd8] bg-[#fbfaf7] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#718077]">
                Yardıma mı ihtiyacınız var?
              </p>

              <p className="mt-2 text-[12px] leading-6 text-[#68716b]">
                Sipariş, ödeme veya teslimat konusunda satış ekibimizle
                iletişime geçebilirsiniz.
              </p>

              <a
                href="https://wa.me/905079586868"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.1em] text-[#29483c] transition-colors hover:text-[#203b31]"
              >
                WhatsApp ile iletişime geç →
              </a>
            </div>
          </aside>
        </form>

        {/* BAŞARILI */}
        {isSubmitted && (
          <div className="mx-auto mt-8 max-w-2xl border border-[#cbdccf] bg-[#edf5ef] p-5" style={{ marginInline: "auto" }}>
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="h-6 w-6 shrink-0 text-[#315f43]" />

              <div>
                <p className="text-[13px] font-semibold text-[#315f43]">
                  Bilgileriniz başarıyla alındı.
                </p>

                <p className="mt-1 text-[12px] leading-6 text-[#54705d]">
                  Bu aşama demo amaçlıdır. Gerçek sipariş oluşturulmamıştır.
                  Ödeme altyapısı bağlandığında siparişiniz bu adım üzerinden
                  tamamlanabilir.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* FIELD */
/* -------------------------------------------------------------------------- */

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email" | "tel" | "url" | "search";
  textarea?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  textarea = false,
}: FieldProps) {
  return (
    <label className="block text-[12px] font-medium text-[#39443c]">
      {label}

      {textarea ? (
        <textarea
          name={name}
          autoComplete={autoComplete}
          required
          rows={4}
          placeholder={placeholder}
          className="mt-2 w-full resize-y border border-[#d8ddd8] bg-[#fcfcfa] px-3 py-3 text-[13px] leading-6 outline-none transition-all duration-200 placeholder:text-[#a5aaa6] focus:border-[#29483c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(41,72,60,0.06)]"
        />
      ) : (
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required
          placeholder={placeholder}
          className="mt-2 h-12 w-full border border-[#d8ddd8] bg-[#fcfcfa] px-3 text-[13px] outline-none transition-all duration-200 placeholder:text-[#a5aaa6] focus:border-[#29483c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(41,72,60,0.06)]"
        />
      )}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* DELIVERY OPTION */
/* -------------------------------------------------------------------------- */

type DeliveryOptionProps = {
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
};

function DeliveryOption({
  value,
  selected,
  onChange,
  icon,
  title,
  description,
  price,
}: DeliveryOptionProps) {
  return (
    <label
      className={`group flex cursor-pointer items-start gap-4 border p-4 transition-all duration-200 ${
        selected
          ? "border-[#29483c] bg-[#f8faf8] shadow-[0_4px_16px_rgba(41,72,60,0.06)]"
          : "border-[#dedfd9] bg-white hover:border-[#9eaaa2]"
      }`}
    >
      <input
        type="radio"
        name="deliveryMethod"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="mt-1 accent-[#29483c]"
      />

      <span
        className={`mt-0.5 transition-colors ${
          selected ? "text-[#29483c]" : "text-[#7b827d]"
        }`}
      >
        {icon}
      </span>

      <span className="flex-1">
        <span className="block text-[12px] font-semibold text-[#303832]">
          {title}
        </span>

        <span className="mt-2 block text-[11px] leading-7 text-[#7b827d]">
          {description}
        </span>

        <span className="mt-3 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#66806f]">
          {price}
        </span>
      </span>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* PAYMENT OPTION */
/* -------------------------------------------------------------------------- */

type PaymentOptionProps = {
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
  title: string;
  description: string;
};

function PaymentOption({
  value,
  selected,
  onChange,
  title,
  description,
}: PaymentOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 border p-4 transition-all duration-200 ${
        selected
          ? "border-[#29483c] bg-[#f8faf8] shadow-[0_4px_16px_rgba(41,72,60,0.06)]"
          : "border-[#dedfd9] bg-white hover:border-[#9eaaa2]"
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="mt-1 accent-[#29483c]"
      />

      <span className="flex-1">
        <span className="block text-[12px] font-semibold text-[#303832]">
          {title}
        </span>

        <span className="mt-2 block text-[11px] leading-7 text-[#7b827d]">
          {description}
        </span>
      </span>
    </label>
  );
}
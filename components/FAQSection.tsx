"use client";

import Image from "next/image";
import { useState, useMemo } from "react";

type FaqItem = {
  question: string;
  answer: string[];
};

type FaqSection = {
  id: string;
  label: string;
  heading: string;
  items: FaqItem[];
};

const faqSections: FaqSection[] = [
  {
    id: "getting-started",
    label: "Getting started with Shopify",
    heading: "Getting started with Shopify",
    items: [
      {
        question: "What is Shopify and how does it work?",
        answer: [
          "Shopify is a complete commerce platform that lets you start, grow, and manage a business.",
          "Create and customize an online store",
          "Sell in multiple places, including web, mobile, social media, online marketplaces, brick-and-mortar locations, and pop-up shops",
        ],
      },
      {
        question: "Do I need to be a designer or developer to use Shopify?",
        answer: [
          "No, you don’t need to be a designer or developer to use Shopify.",
          "Customize the look and feel of your store with the online store builder and themes.",
          "Add features and functionality to your store with apps.",
        ],
      },
    ],
  },
  {
    id: "selling",
    label: "Selling on Shopify",
    heading: "Selling on Shopify",
    items: [
      {
        question: "How can I start selling products online?",
        answer: [
          "Set up your catalog, connect a payment provider, and publish your storefront when you are ready.",
          "You can manage products, pricing, and orders from one dashboard.",
        ],
      },
      {
        question: "Can I sell in more than one channel?",
        answer: [
          "Yes, Shopify supports web, social, marketplaces, and in-person selling through connected channels.",
        ],
      },
    ],
  },
  {
    id: "payments",
    label: "Payments on Shopify",
    heading: "Payments on Shopify",
    items: [
      {
        question: "Which payment methods are supported?",
        answer: [
          "Shopify supports a range of payment gateways and local payment options depending on your market.",
        ],
      },
      {
        question: "Can I track transactions and payouts?",
        answer: [
          "Yes, payment activity, order history, and payout details are available in the admin dashboard.",
        ],
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping with Shopify",
    heading: "Shipping with Shopify",
    items: [
      {
        question: "How do shipping settings work?",
        answer: [
          "You can define rates, shipping zones, delivery options, and fulfillment rules for different destinations.",
        ],
      },
      {
        question: "Can I offer local pickup?",
        answer: [
          "Yes, local pickup and other fulfillment methods can be configured based on your store setup.",
        ],
      },
    ],
  },
];

// -------------------------------------------------------------

export default function FAQSection() {
  const [activeSectionId, setActiveSectionId] = useState(faqSections[0].id);

  const activeSection = useMemo(
    () => faqSections.find((s) => s.id === activeSectionId) ?? faqSections[0],
    [activeSectionId],
  );

  const renderLine = (line: string) => {
    const keyword = line.includes("themes")
      ? "themes"
      : line.includes("apps")
        ? "apps"
        : null;

    if (!keyword) return <p key={line}>{line}</p>;

    const [start, end] = line.split(keyword);
    return (
      <p key={line}>
        {start}
        <a
          href="#help-center"
          className="font-medium text-[#1f8f67] underline decoration-[#1f8f67] underline-offset-2"
        >
          {keyword}
        </a>
        {end}
      </p>
    );
  };

  return (
    <section id="help-center" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div
        className="mx-auto w-full max-w-360 text-left"
        style={{ borderRadius: 32 }}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-start px-0">
          <div className="max-w-140">
            <h2 className="text-[clamp(2.6rem,5vw,3.9rem)] font-semibold tracking-[-0.055em] text-[#111827]">
              Ankarom FAQ
            </h2>

            <p className="mt-4 max-w-130 text-[clamp(1.1rem,2vw,1.45rem)] leading-[1.35] text-[#6b7280]">
              If you’re new to Shopify or looking to replatform your business,
              this guide will help you learn more about the platform and its
              features.
            </p>

            <div className="mt-8 text-[15px] leading-[1.45] text-[#6b7280] sm:text-[16px]">
              <p>Already have a Shopify store?</p>
              <p>
                Get detailed product information in our{" "}
                <a
                  href="#help-center"
                  className="font-medium text-[#1f8f67] underline decoration-[#1f8f67] underline-offset-2"
                >
                  Help Center
                </a>
              </p>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end lg:pt-2">
            <div className="absolute inset-x-[10%] top-[10%] h-[68%] rounded-full bg-[#f5f7fc] blur-3xl" />
            <Image
              src="/romork.png"
              alt="Shopify illustration"
              width={1200} // büyük ver, tarayıcı ekranına göre küçülterek gösterir
              height={900}
              className="relative z-10 w-full max-w-140 drop-shadow-[0_22px_36px_rgba(15,23,42,0.08)]"
            />
          </div>
        </div>

        {/* --------- Content --------- */}
        {/* Sütun genişliğini 214px'den 280px'e çıkardık, gap'i artırdık */}
        <div className="grid gap-6 pt-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-10">
          
          {/* Left Menu */}
          <nav className="self-start border-l border-[#d7dbe3] pl-0 lg:pt-2">
            {/* space-y-1 yerine space-y-2 veya 3 kullanarak maddeler arası boşluğu açtık */}
            <ul className="space-y-2">
              {faqSections.map((section) => {
                const isActive = section.id === activeSectionId;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => setActiveSectionId(section.id)}
                      // px-5 ve py-4 ile butonların iç hacmini artırdık, yazıyı biraz büyüttük (text-[16px])
                      className={`relative w-full border-l-2 px-5 py-4 text-left text-[16px] leading-[1.45] transition ${
                        isActive
                          ? "border-[#111827] text-[#111827] font-medium"
                          : "border-transparent text-[#6b7280] hover:text-[#111827]"
                      }`}
                    >
                      {section.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Active Content */}
          <div className="w-full min-w-0 min-h-[450px] bg-white px-6 py-10 shadow-[0_24px_68px_rgba(15,23,42,0.09)] ring-1 ring-[#eef1f5] sm:px-8 sm:py-12 lg:px-10 lg:py-14 rounded-2xl">
            <h3 className="text-[21px] font-normal tracking-[-0.03em] text-[#2f343d] sm:text-[22px]">
              {activeSection.heading}
            </h3>

            <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2">
              {activeSection.items.map((item) => (
                <article key={item.question} className="min-w-0">
                  <h4 className="text-[16px] font-semibold leading-[1.35] text-[#2f343d]">
                    {item.question}
                  </h4>
                  <div className="mt-4 space-y-3 text-[15px] leading-[1.6] text-[#6b7280]">
                    {item.answer.map((line) => renderLine(line))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

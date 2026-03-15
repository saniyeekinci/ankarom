"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import { keyframes } from "@mui/system";

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(167, 243, 208, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(167, 243, 208, 0); }
  100% { box-shadow: 0 0 0 0 rgba(167, 243, 208, 0); }
`;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      
      {/* w-full: Ekranı tam kaplar.
        px-6 md:px-12: Kenarlardan çok az bir nefes payı bırakır (Sıfıra yakın).
        max-w-7xl kaldırıldı veya w-full ile değiştirildi.
      */}
      <div className="relative w-full flex justify-between items-center px-6 md:px-12 h-20">
        
        {/* 1) LOGO - EN SOLDA */}
        <div className="shrink-0 z-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/ankarom.png"
              width={140}
              height={45}
              alt="Ankarom Logo"
              priority
              className="p-2"
            />
          </Link>
        </div>

        {/* 2) NAV - TAM ORTADA (Matematiksel Merkez) */}
        <nav className="hidden lg:flex items-center gap-10 font-medium text-gray-700 h-full 
                        absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="group h-full flex items-center">
            <button className="flex items-center gap-2 hover:text-blue-600 transition-colors h-full">
              Ürünlerimiz
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <Link href="/aksesuarlar" className="hover:text-blue-600 transition-colors">Aksesuarlar</Link>
          <Link href="/hakkimizda" className="hover:text-blue-600 transition-colors whitespace-nowrap">Ankarom Hakkında</Link>
          <Link href="/iletisim" className="hover:text-blue-600 transition-colors">İletişim</Link>
        </nav>

        {/* 3) BUTON - EN SAĞDA */}
        <div className="shrink-0 z-10">
          <Link href="/iletisim">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#bbf7d0",
                color: "#064e3b",
                fontWeight: "600",
                padding: "10px 28px",
                borderRadius: "9999px",
                textTransform: "none",
                fontSize: "0.95rem",
                boxShadow: "none",
                animation: `${pulseAnimation} 2s infinite`,
                "&:hover": { backgroundColor: "#86efac", boxShadow: "none" }
              }}
            >
              Teklif Al
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}
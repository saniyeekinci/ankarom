"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import { keyframes } from "@mui/system";

// Animasyon
const pulseAnimation = keyframes`0% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0.7); }
70% { box-shadow: 0 0 0 15px rgba(180, 83, 9, 0); }
100% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0); }`;

// Mega Menu
const megaMenuLinksCol1 = [
{ name: "Online Stores", href: "#" },
{ name: "Segmentation", href: "#" },
{ name: "Marketing CRM", href: "#" },
{ name: "Sales Operations", href: "#" },
];

const megaMenuLinksCol2 = [
{ name: "Our Blog", href: "#" },
{ name: "Terms & Conditions", href: "#" },
{ name: "License", href: "#" },
{ name: "Resources", href: "#" },
];

const menuLinks = [
{ name: "Aksesuarlar", href: "/aksesuarlar" },
{ name: "Hakkımızda", href: "/hakkimizda" },
{ name: "İletişim", href: "/iletisim" },
];

export default function Header() {

const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

return (

<header className="sticky top-0 z-40 w-full shadow-sm bg-white/80 backdrop-blur-md border-b border-gray-100">

<div className="relative w-full flex justify-between items-center px-6 md:px-12 h-20">

{/* LOGO */}

<div className="shrink-0 z-10">
<Link href="/" className="flex items-center">
<Image
src="/ankarom.png"
width={110}
height={35}
alt="Ankarom Logo"
priority
/>
</Link>
</div>

{/* DESKTOP NAV */}

<nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 h-full">

<div className="group h-full flex items-center">

<button className="flex items-center gap-2 text-gray-700 hover:text-[#b45309] transition-all h-full outline-none text-[13px] font-bold uppercase tracking-[0.2em]">
Ürünlerimiz
<svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
</svg>
</button>

{/* MEGA MENU */}

<div className="absolute top-full left-1/2 -translate-x-1/2 w-[950px] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out z-50">

<div className="bg-[#111827]/95 backdrop-blur-xl text-gray-300 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-12 border border-white/10">

<div className="grid grid-cols-12 gap-12">

<div className="col-span-3">
<h5 className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#b45309] mb-10">
Yazılım Çözümleri
</h5>

<ul className="flex flex-col space-y-7">
{megaMenuLinksCol1.map((link, idx) => (
<li key={idx}>
<Link href={link.href} className="hover:text-white transition-all text-[15px] font-medium">
{link.name}
</Link>
</li>
))}
</ul>
</div>

<div className="col-span-3 border-l border-white/5 pl-8">
<h5 className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#b45309] mb-10">
Kurumsal
</h5>

<ul className="flex flex-col space-y-7">
{megaMenuLinksCol2.map((link, idx) => (
<li key={idx}>
<Link href={link.href} className="hover:text-white transition-all text-[15px] font-medium">
{link.name}
</Link>
</li>
))}
</ul>
</div>

<div className="col-span-6">

<div className="bg-gradient-to-br from-[#1f2937] to-[#0f172a] p-10 rounded-[30px] border border-white/5">

<span className="bg-[#b45309] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg">
Yeni Lansman
</span>

<h4 className="text-white font-bold text-2xl mt-8">
Ankarom Filo Yönetim Sistemini Keşfedin
</h4>

<p className="text-gray-400 text-[15px] mt-6">
İş süreçlerinizi optimize eden otomotiv çözümleri.
</p>

</div>

</div>

</div>

</div>

</div>

</div>

{menuLinks.map((link) => (

<Link
key={link.name}
href={link.href}
className="text-gray-700 hover:text-[#b45309] transition-all text-[13px] font-bold uppercase tracking-[0.2em]"
>
{link.name}
</Link>
))}

</nav>

{/* RIGHT SIDE */}

<div className="flex items-center gap-4 z-10">

<Link href="/iletisim" className="hidden sm:block">

<Button
variant="contained"
sx={{
backgroundColor: "#b45309",
color: "#fff",
fontWeight: "800",
fontSize: "11px",
textTransform: "uppercase",
letterSpacing: "0.2em",
padding: "10px 28px",
borderRadius: "12px",
boxShadow: "none",
animation: `${pulseAnimation} 2s infinite`,
"&:hover": { backgroundColor: "#92400e", boxShadow: "none" },
}}

>

Teklif Al

</Button>

</Link>

{/* HAMBURGER */}

<button
onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
className="lg:hidden flex flex-col justify-center items-center w-11 h-11 border border-gray-200 rounded-xl bg-white shadow-sm"

>

<span className={`bg-gray-700 h-0.5 w-5 rounded-full transition ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
<span className={`bg-gray-700 h-0.5 w-5 rounded-full my-1 transition ${isMobileMenuOpen ? "opacity-0" : ""}`} />
<span className={`bg-gray-700 h-0.5 w-5 rounded-full transition ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />

</button>

</div>

{/* MOBİL MENÜ */}

<div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? "visible" : "invisible"}`}>

<div
onClick={() => setIsMobileMenuOpen(false)}
className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
/>

<div
className={`fixed right-0 top-0 h-screen w-[85%] max-w-[360px] bg-[#0f172a]
flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.6)]
transition-transform duration-300
${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
>

<div className="flex items-center justify-between px-6 py-5 border-b border-white/10">

<Image
src="/ankarom.png"
width={100}
height={30}
alt="logo"
className="brightness-0 invert"
/>

<button
onClick={() => setIsMobileMenuOpen(false)}
className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 text-white"

>

✕ </button>

</div>

<div className="flex-1 overflow-y-auto px-6 py-8">

<nav className="flex flex-col space-y-6">

<Link href="#" className="text-white text-lg font-semibold uppercase tracking-wider">
Ürünlerimiz
</Link>

{menuLinks.map((link) => (

<Link
key={link.name}
href={link.href}
onClick={() => setIsMobileMenuOpen(false)}
className="text-white/80 text-lg font-semibold uppercase tracking-wider"
>
{link.name}
</Link>
))}

</nav>

</div>

<div className="p-6 border-t border-white/10">

<Link href="/iletisim" onClick={() => setIsMobileMenuOpen(false)}>

<Button
fullWidth
variant="contained"
sx={{
backgroundColor: "#b45309",
borderRadius: "10px",
fontWeight: "bold",
py: 1.5,
}}

>

TEKLİF AL

</Button>

</Link>

</div>

</div>

</div>

</div>

</header>
);    
}

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
	const [isProductsOpen, setIsProductsOpen] = useState(false);

	const allProductLinks = [...megaMenuLinksCol1, ...megaMenuLinksCol2];

	return (
		<header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/45 backdrop-blur-2xl shadow-[0_8px_24px_rgba(2,6,23,0.35)]">
			<div className="relative mx-auto flex h-20 w-full max-w-360 items-center justify-between px-6 md:px-12">
				<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/55 via-slate-900/25 to-transparent" />
				<div className="z-10 shrink-0">
					<Link href="/" className="flex items-center">
						<Image src="/ankarom.png" width={110} height={35} alt="Ankarom Logo" priority className="brightness-0 invert" />
					</Link>
				</div>

				<nav className="absolute left-1/2 z-10 hidden h-full -translate-x-1/2 items-center gap-8 lg:flex">
					<div className="group relative h-full flex items-center">
						<button className="flex h-full items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-white/80 transition-colors duration-300 hover:text-amber-400 outline-none">
							Ürünlerimiz
							<svg
								className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						<div className="pointer-events-none absolute left-1/2 top-full z-50 w-240 -translate-x-1/2 pt-5 opacity-0 invisible translate-y-4 transition-all duration-500 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
							<div className="rounded-4xl border border-white/10 bg-slate-900/85 p-10 text-slate-300 shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-2xl">
								<div className="grid grid-cols-12 gap-10">
									<div className="col-span-3">
										<h5 className="mb-8 text-[11px] font-bold uppercase tracking-[0.28em] text-amber-400">Yazılım Çözümleri</h5>
										<ul className="flex flex-col gap-5">
											{megaMenuLinksCol1.map((link, idx) => (
												<li key={idx}>
													<Link href={link.href} className="text-[15px] font-medium text-slate-300 transition-all duration-300 hover:text-white">
														{link.name}
													</Link>
												</li>
											))}
										</ul>
									</div>

									<div className="col-span-3 border-l border-white/10 pl-8">
										<h5 className="mb-8 text-[11px] font-bold uppercase tracking-[0.28em] text-amber-400">Kurumsal</h5>
										<ul className="flex flex-col gap-5">
											{megaMenuLinksCol2.map((link, idx) => (
												<li key={idx}>
													<Link href={link.href} className="text-[15px] font-medium text-slate-300 transition-all duration-300 hover:text-white">
														{link.name}
													</Link>
												</li>
											))}
										</ul>
									</div>

									<div className="col-span-6">
										<div className="rounded-[26px] border border-white/10 bg-linear-to-br from-slate-800/90 via-slate-900/85 to-slate-950/90 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
											<span className="rounded-lg bg-amber-700 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">Yeni Lansman</span>
											<h4 className="mt-6 text-2xl font-bold text-white">Ankarom Filo Yönetim Sistemini Keşfedin</h4>
											<p className="mt-4 text-[15px] text-slate-300">İş süreçlerinizi optimize eden otomotiv çözümleri.</p>
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
							className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/80 transition-colors duration-300 hover:text-amber-400"
						>
							{link.name}
						</Link>
					))}
				</nav>

				<div className="z-10 flex items-center gap-4">
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
								boxShadow: "0 10px 30px rgba(180,83,9,0.35)",
								animation: `${pulseAnimation} 2s infinite`,
								transition: "all .3s ease",
								"&:hover": { backgroundColor: "#92400e", boxShadow: "0 14px 34px rgba(180,83,9,0.45)", transform: "translateY(-1px)" },
							}}
						>
							Teklif Al
						</Button>
					</Link>

					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-slate-900/70 shadow-lg backdrop-blur-md lg:hidden"
						aria-label="Mobil menüyü aç"
					>
						<span className={`absolute h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
						<span className={`absolute h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
						<span className={`absolute h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
					</button>
				</div>

				<div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? "visible" : "invisible"}`}>
					<div
						onClick={() => {
							setIsMobileMenuOpen(false);
							setIsProductsOpen(false);
						}}
						className={`absolute inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
					/>

					<div
						className={`fixed right-0 top-0 flex h-screen w-[86%] max-w-95 flex-col border-l border-white/10 bg-slate-900/95 shadow-[-10px_0_50px_rgba(2,6,23,0.7)] backdrop-blur-2xl transition-transform duration-300 ${
							isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
						}`}
					>
						<div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
							<Image src="/ankarom.png" width={100} height={30} alt="logo" className="brightness-0 invert" />
							<button
								onClick={() => {
									setIsMobileMenuOpen(false);
									setIsProductsOpen(false);
								}}
								className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
								aria-label="Mobil menüyü kapat"
							>
								✕
							</button>
						</div>

						<div className="flex-1 overflow-y-auto px-6 py-8">
							<nav className="flex flex-col gap-5">
								<button
									onClick={() => setIsProductsOpen(!isProductsOpen)}
									className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-base font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
								>
									Ürünlerimiz
									<svg
										className={`h-4 w-4 transition-transform duration-300 ${isProductsOpen ? "rotate-180" : "rotate-0"}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
									</svg>
								</button>

								<div
									className={`overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 transition-all duration-300 ${
										isProductsOpen ? "max-h-105 opacity-100 p-4" : "max-h-0 opacity-0 p-0"
									}`}
								>
									<div className="grid grid-cols-1 gap-2">
										{allProductLinks.map((link, idx) => (
											<Link
												key={`${link.name}-${idx}`}
												href={link.href}
												onClick={() => {
													setIsMobileMenuOpen(false);
													setIsProductsOpen(false);
												}}
												className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
											>
												{link.name}
											</Link>
										))}
									</div>
								</div>

								{menuLinks.map((link) => (
									<Link
										key={link.name}
										href={link.href}
										onClick={() => {
											setIsMobileMenuOpen(false);
											setIsProductsOpen(false);
										}}
										className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold uppercase tracking-wider text-white/85 transition-colors hover:bg-white/10 hover:text-white"
									>
										{link.name}
									</Link>
								))}
							</nav>
						</div>

						<div className="border-t border-white/10 p-6">
							<Link
								href="/iletisim"
								onClick={() => {
									setIsMobileMenuOpen(false);
									setIsProductsOpen(false);
								}}
							>
								<Button
									fullWidth
									variant="contained"
									sx={{
										backgroundColor: "#b45309",
										borderRadius: "10px",
										fontWeight: "bold",
										py: 1.5,
										letterSpacing: "0.08em",
										"&:hover": { backgroundColor: "#92400e" },
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

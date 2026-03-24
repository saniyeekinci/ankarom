"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import { keyframes } from "@mui/system";
import { ShoppingCartIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";

const whatsappHref = "https://wa.me/905XXXXXXXXX?text=Merhaba,%20bilgi%20almak%20istiyorum";

const pulseAnimation = keyframes`
0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.65); }
70% { box-shadow: 0 0 0 14px rgba(37, 211, 102, 0); }
100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

// Mega Menu
const megaMenuLinksCol1 = [
{ name: "Araç Römorkları", href: "/urunler" },
{ name: "ATV Römorkları", href: "#" },
{ name: "Tekne Römorkları", href: "#" },
{ name: "Motosiklet Römorkları", href: "#" },
{ name: "Jet Ski Römorkları", href: "#" },
];

const megaMenuLinksCol2 = [
{ name: "Platform Römorklar", href: "/urunler" },
{ name: "Kapalı Kasa Römorklar", href: "/urunler" },
{ name: "Özel Üretim Römorklar", href: "/urunler" },
{ name: "Yedek Parça ve Ekipman", href: "/aksesuarlar" },
];

const menuLinks = [
{ name: "Aksesuarlar", href: "/aksesuarlar" },
{ name: "Hakkımızda", href: "/hakkimizda" },
{ name: "İletişim", href: "/iletisim" },
];

export default function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProductsOpen, setIsProductsOpen] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const { itemCount } = useCart();
	const { user, isAuthenticated, logout } = useAuth();
	const logoHref = isAuthenticated ? "/hesabim" : "/";

	const allProductLinks = [...megaMenuLinksCol1, ...megaMenuLinksCol2];
	const whatsappIcon = (
		<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.884-.788-1.48-1.76-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.173.2-.297.299-.495.1-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.307 1.262.49 1.693.626.711.227 1.359.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.075-.124-.273-.198-.57-.347M12.05 2C6.477 2 1.95 6.526 1.95 12.1c0 1.771.463 3.5 1.343 5.023L2 22l5.019-1.317a10.05 10.05 0 0 0 5.03 1.355h.004c5.572 0 10.1-4.526 10.1-10.1C22.15 6.526 17.622 2 12.05 2m0 18.361h-.003a8.35 8.35 0 0 1-4.257-1.168l-.305-.18-2.979.781.795-2.905-.199-.298a8.36 8.36 0 0 1-1.287-4.49c0-4.622 3.761-8.384 8.386-8.384 2.24 0 4.347.872 5.932 2.456a8.33 8.33 0 0 1 2.453 5.928c-.001 4.623-3.763 8.384-8.386 8.384" />
		</svg>
	);

	return (
		<header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/45 backdrop-blur-2xl shadow-[0_8px_24px_rgba(2,6,23,0.35)]">
			<div className="relative mx-auto flex h-20 w-full max-w-360 items-center justify-between px-6 md:px-12">
				<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/55 via-slate-900/25 to-transparent" />
				<div className="z-10 shrink-0">
					<Link href={logoHref} className="flex items-center">
						<Image src="/ankarom.png" width={110} height={35} alt="Ankarom Logo" priority className="brightness-0 invert" />
					</Link>
				</div>

				<nav className="absolute left-1/2 z-10 hidden h-full -translate-x-1/2 items-center gap-8 lg:flex">
					<div className="group relative h-full flex items-center">
						<Link href="/urunler" className="flex h-full items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-white/80 transition-colors duration-300 hover:text-amber-400 outline-none">
							Ürünlerimiz
							<svg
								className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
							</svg>
						</Link>

						<div className="pointer-events-none absolute left-1/2 top-full z-50 w-240 -translate-x-1/2 pt-5 opacity-0 invisible translate-y-4 transition-all duration-500 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
							<div className="rounded-4xl border border-white/10 bg-slate-900/85 p-10 text-slate-300 shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-2xl">
								<div className="grid grid-cols-12 gap-10">
									<div className="col-span-3">
										<h5 className="mb-8 text-[11px] font-bold uppercase tracking-[0.28em] text-amber-400">Römorklar</h5>
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
										<h5 className="mb-8 text-[11px] font-bold uppercase tracking-[0.28em] text-amber-400">Ürün Grupları</h5>
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

				<div className="z-10 flex items-center gap-3">
					<Link href="/sepetlerim" className="relative hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-slate-900/70 text-white transition-colors hover:bg-slate-800/90" aria-label="Sepetlerim">
						<ShoppingCartIcon className="h-5 w-5" />
						<span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-500 px-1 text-[10px] font-bold text-white shadow-[0_0_18px_rgba(34,211,238,0.55)]">
							{itemCount}
						</span>
					</Link>

					{!isAuthenticated ? (
						<>
							<Link href="/giris" className="hidden sm:inline-flex rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10">
								Giriş Yap
							</Link>
							<Link href="/kayit" className="hidden sm:inline-flex rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(59,130,246,0.35)] transition-all hover:-translate-y-0.5">
								Kayıt Ol
							</Link>
						</>
					) : (
						<div className="relative hidden sm:block">
							<button
								type="button"
								onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
								className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
							>
								<UserCircleIcon className="h-5 w-5 text-cyan-300" />
								<span>{user?.name}</span>
							</button>

							{isProfileMenuOpen && (
								<div className="absolute right-0 top-13 z-50 w-52 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-[0_18px_45px_rgba(2,6,23,0.75)] backdrop-blur-xl">
									<Link href="/hesabim" onClick={() => setIsProfileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white">
										Hesabım
									</Link>
									{user?.role === "admin" && (
										<Link href="/admin/urun-ekle" onClick={() => setIsProfileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-cyan-200 transition-colors hover:bg-cyan-500/15 hover:text-cyan-100">
											Admin Paneli
										</Link>
									)}
									<Link href="/sepetlerim" onClick={() => setIsProfileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white">
										Sepetim
									</Link>
									<button
										type="button"
										onClick={() => {
											logout();
											setIsProfileMenuOpen(false);
										}}
										className="mt-1 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-200 transition-colors hover:bg-rose-500/15"
									>
										<ArrowRightOnRectangleIcon className="h-4 w-4" />
										Çıkış Yap
									</button>
								</div>
							)}
						</div>
					)}

					<a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hidden sm:block" aria-label="WhatsApp ile iletişime geç">
						<Button
							variant="contained"
							sx={{
								background: "linear-gradient(135deg, #25d366 0%, #1ebe5d 55%, #128c7e 100%)",
								color: "#fff",
								width: "46px",
								minWidth: "46px",
								height: "46px",
								padding: "0",
								borderRadius: "999px",
								boxShadow: "0 10px 28px rgba(18,140,126,0.36)",
								animation: `${pulseAnimation} 2s infinite`,
								transition: "all .3s ease",
								"&:hover": { boxShadow: "0 14px 34px rgba(18,140,126,0.45)", transform: "translateY(-1px)", filter: "brightness(1.03)" },
							}}
						>
							{whatsappIcon}
						</Button>
					</a>

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
							<Link
								href={logoHref}
								onClick={() => {
									setIsMobileMenuOpen(false);
									setIsProductsOpen(false);
								}}
							>
								<Image src="/ankarom.png" width={100} height={30} alt="logo" className="brightness-0 invert" />
							</Link>
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

								<div className="grid grid-cols-2 gap-3">
									<Link
										href="/sepetlerim"
										onClick={() => {
											setIsMobileMenuOpen(false);
											setIsProductsOpen(false);
										}}
										className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
									>
										Sepetlerim ({itemCount})
									</Link>

									{!isAuthenticated ? (
										<>
											<Link
												href="/giris"
												onClick={() => {
													setIsMobileMenuOpen(false);
													setIsProductsOpen(false);
												}}
												className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
											>
												Giriş Yap
											</Link>
											<Link
												href="/kayit"
												onClick={() => {
													setIsMobileMenuOpen(false);
													setIsProductsOpen(false);
												}}
												className="col-span-2 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white"
											>
												Kayıt Ol
											</Link>
										</>
									) : (
										<>
											<Link
												href="/hesabim"
												onClick={() => {
													setIsMobileMenuOpen(false);
													setIsProductsOpen(false);
												}}
												className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
											>
												Hesabım
											</Link>
											{user?.role === "admin" && (
												<Link
													href="/admin/urun-ekle"
													onClick={() => {
														setIsMobileMenuOpen(false);
														setIsProductsOpen(false);
													}}
													className="col-span-2 inline-flex items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100"
												>
													Admin Paneli
												</Link>
											)}
											<button
												type="button"
												onClick={() => {
													logout();
													setIsMobileMenuOpen(false);
													setIsProductsOpen(false);
												}}
												className="inline-flex items-center justify-center rounded-xl border border-rose-300/25 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200"
											>
												Çıkış Yap
											</button>
										</>
									)}
								</div>
							</nav>
						</div>

						<div className="border-t border-white/10 p-6">
							<a
								href={whatsappHref}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="WhatsApp ile iletişime geç"
								onClick={() => {
									setIsMobileMenuOpen(false);
									setIsProductsOpen(false);
								}}
							>
								<Button
									variant="contained"
									sx={{
										background: "linear-gradient(135deg, #25d366 0%, #1ebe5d 55%, #128c7e 100%)",
										width: "52px",
										minWidth: "52px",
										height: "52px",
										p: 0,
										mx: "auto",
										borderRadius: "999px",
										animation: `${pulseAnimation} 2s infinite`,
										"&:hover": { filter: "brightness(1.03)" },
									}}
								>
									{whatsappIcon}
								</Button>
							</a>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

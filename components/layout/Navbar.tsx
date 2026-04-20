"use client";

import Link from "next/link";
import { Scissors, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";

export function Navbar() {
    const t = useTranslations("Navigation");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);


    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const toggleLanguage = () => {
        const nextLocale = locale === "en" ? "bg" : "en";
        let newPath;
        if (pathname === `/${locale}`) {
            newPath = `/${nextLocale}`;
        } else {
            newPath = pathname.replace(`/${locale}/`, `/${nextLocale}/`);
        }
        router.push(newPath || `/${nextLocale}`);
    };

    return (
        <nav className="w-full border-b border-black/10 bg-secondary/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href={`/${locale}`} className="flex items-center gap-2 group">
                    <div className="relative">
                        <Scissors className="h-7 w-7 sm:h-8 sm:w-8 text-black transition-transform duration-500 group-hover:rotate-12" />
                        <div className="absolute inset-0 blur-sm bg-primary/40 -z-10 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold tracking-tighter font-serif text-black laser-text">
                        Luxe Salon
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-black/70">
                    <Link href={`/${locale}`} className="hover:text-black transition-all">{t('home')}</Link>
                    <Link href={`/${locale}/#services`} className="hover:text-black transition-all">{t('services')}</Link>
                    <Link href={`/${locale}/gallery`} className="hover:text-black transition-all">{t('gallery')}</Link>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button 
                        onClick={toggleLanguage}
                        className="bg-black text-white font-bold px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(243,209,217,0.6)] border border-primary/20 hover:border-primary active:scale-95 flex items-center gap-1 leading-none text-xs"
                    >
                        <span className="opacity-80">{locale === "en" ? "EN" : "BG"}</span>
                        <span className="text-primary mx-1">/</span>
                        <span className="hover:text-primary transition-colors">{locale === "en" ? "BG" : "EN"}</span>
                    </button>
                    <Link
                        href={`/${locale}/#book`}
                        className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold border-2 border-black hover:shadow-[0_0_15px_rgba(243,209,217,0.5)] transition-all active:scale-95"
                    >
                        {t('book')}
                    </Link>
                </div>

                {/* Mobile: Language + Hamburger */}
                <div className="flex md:hidden items-center gap-3">
                    <button 
                        onClick={toggleLanguage}
                        className="bg-black text-white font-bold px-3 py-1.5 rounded-full text-xs active:scale-95 transition-all"
                    >
                        {locale === "en" ? "BG" : "EN"}
                    </button>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-xl bg-black/5 border border-black/10 text-black active:scale-95 transition-all"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col items-center justify-center gap-8 pt-16 px-8">
                        <Link 
                            href={`/${locale}`} 
                            className="text-2xl font-bold text-black laser-text w-full text-center py-4 border-b border-black/10"
                            onClick={() => setMobileOpen(false)}
                        >
                            {t('home')}
                        </Link>
                        <Link 
                            href={`/${locale}/#services`} 
                            className="text-2xl font-bold text-black laser-text w-full text-center py-4 border-b border-black/10"
                            onClick={() => setMobileOpen(false)}
                        >
                            {t('services')}
                        </Link>
                        <Link 
                            href={`/${locale}/gallery`} 
                            className="text-2xl font-bold text-black laser-text w-full text-center py-4 border-b border-black/10"
                            onClick={() => setMobileOpen(false)}
                        >
                            {t('gallery')}
                        </Link>

                        {/* Big CTA Button for Mobile */}
                        <Link
                            href={`/${locale}/#book`}
                            className="w-full bg-black text-primary px-8 py-5 rounded-full text-xl font-black text-center uppercase tracking-widest shadow-2xl active:scale-95 transition-all mt-4"
                            onClick={() => setMobileOpen(false)}
                        >
                            {t('book')}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

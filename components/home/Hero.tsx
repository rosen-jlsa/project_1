"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function Hero() {
    const t = useTranslations("Hero");

    return (
        <section className="relative min-h-[70vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden bg-secondary px-4 py-16">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent blur-[100px]" />
            </div>

            <div className="container mx-auto relative z-10 text-center">
                <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block py-1 px-3 rounded-full bg-black/5 text-black text-xs sm:text-sm font-bold mb-4 sm:mb-6 tracking-wider uppercase border border-black/10"
                >
                    {t('title')}
                </motion.span>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-serif font-black text-black laser-text mb-4 sm:mb-6 leading-tight uppercase tracking-tighter"
                >
                    {t('subtitle')}
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-xl mx-auto text-base sm:text-lg mb-8 sm:mb-10 text-black/80 font-medium italic px-2"
                >
                    {t('description') || "Experience world-class hair services in an environment designed for your absolute comfort and relaxation."}
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    <Link
                        href="#book"
                        className="group w-full sm:w-auto bg-black text-primary px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-black border-2 border-black hover:shadow-[0_0_30px_rgba(243,209,217,0.6)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
                    >
                        {t('bookButton')}
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="#services"
                        className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-black text-black border-2 border-black hover:bg-black hover:text-primary transition-all hover:shadow-[0_0_20px_rgba(243,209,217,0.4)] uppercase tracking-widest text-center active:scale-95"
                    >
                        {t('viewServices') || "View Services"}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

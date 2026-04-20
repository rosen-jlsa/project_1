"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
                >
                    <div className="relative overflow-hidden bg-black/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8">
                        {/* Premium Glow Effect */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
                        
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30">
                                        <Cookie className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Cookie Policy</h3>
                                        <div className="flex items-center gap-1.5 text-primary/80 text-xs font-bold uppercase tracking-wider">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span>Secure Choice</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsVisible(false)}
                                    className="p-1 text-white/40 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-white/70 text-sm leading-relaxed">
                                We use cookies to enhance your luxury experience, analyze site traffic, and optimize our professional services for you. By clicking <span className="text-primary font-bold">&quot;Accept All&quot;</span>, you consent to our use of these premium tracking technologies.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 bg-primary text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                                >
                                    ACCEPT ALL
                                </button>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="flex-1 bg-white/5 text-white/80 font-bold py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    CUSTOMIZE
                                </button>
                            </div>

                            <p className="text-[10px] text-center text-white/30">
                                Read our <Link href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</Link> to learn more.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

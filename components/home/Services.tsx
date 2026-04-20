"use client";

import { Scissors, Sparkles, User, Clock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Service } from "@/lib/data";

export function Services({ services }: { services: Service[] }) {
    const t = useTranslations("Services");

    // Group services by category
    const groupedServices = services?.reduce((acc: Record<string, Service[]>, service: Service) => {
        if (!acc[service.category || 'Other']) {
            acc[service.category || 'Other'] = [];
        }
        acc[service.category || 'Other'].push(service);
        return acc;
    }, {}) || {};

    return (
        <section id="services" className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-black laser-text mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-gray-800 laser-text-gray max-w-2xl mx-auto text-lg">
                        {t('subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(groupedServices).map(([category, categoryServices]) => {
                        return (
                            <motion.div 
                                key={category}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                viewport={{ once: true }}
                                className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-4 border-black/5 hover:border-black transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-primary shadow-lg transform rotate-3">
                                        {category === 'Men' && <Scissors className="w-7 h-7" />}
                                        {category === 'Women' && <Sparkles className="w-7 h-7" />}
                                        {category === 'Children' && <User className="w-7 h-7" />}
                                        {category === 'Piercing' && <Zap className="w-7 h-7" />}
                                        {category === 'Other' && <Scissors className="w-7 h-7" />}
                                    </div>
                                    <h3 className="text-2xl font-bold text-black laser-text">
                                        {t(`categories.${category}`)}
                                    </h3>
                                </div>

                                <ul className="space-y-5">
                                    {categoryServices?.map((service: Service) => (
                                        <li key={service.id} className="flex justify-between items-center group cursor-pointer border-b border-gray-100 pb-3 last:border-0">
                                            <div>
                                                <h4 className="font-bold text-black laser-text-gray group-hover:text-primary transition-colors">{service.name}</h4>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {service.duration} min
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-black text-black text-xl laser-text">€{service.price}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

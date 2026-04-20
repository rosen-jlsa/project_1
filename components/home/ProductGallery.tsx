"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProductImage } from "@/lib/data";

export default function ProductGallery({ products }: { products: ProductImage[] }) {
    const t = useTranslations("ProductGallery");

    return (
        <section className="py-20 bg-secondary">
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-6xl font-serif font-black text-black laser-text mb-6 uppercase tracking-tighter">
                        {t('title')}
                    </h2>
                    <div className="w-16 h-1 bg-primary mx-auto mb-6 shadow-[0_0_10px_rgba(243,209,217,0.5)]" />
                    <p className="text-gray-800 laser-text-gray text-xl italic">
                        {t('description')}
                    </p>
                </motion.div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map((product: ProductImage, index: number) => (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-black/5 hover:border-black transition-all duration-500 group"
                            >
                                <div className="aspect-square relative overflow-hidden bg-muted border-b-4 border-black/10 group-hover:border-black transition-colors">
                                    <Image
                                        src={product.image_url}
                                        alt={product.product_name || "Product image"}
                                        fill
                                        priority={index < 4}
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-black font-serif mb-3 text-black laser-text uppercase tracking-tight">{product.product_name}</h3>
                                    {product.description && (
                                        <p className="text-gray-700 laser-text-gray font-medium italic leading-relaxed">{product.description}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>{t('empty')}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

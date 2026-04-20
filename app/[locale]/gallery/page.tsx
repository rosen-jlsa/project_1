"use client";

import { getGalleryImages } from "@/app/actions";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GalleryImage } from "@/lib/data";

export default function GalleryPage() {
    const t = useTranslations("Gallery");
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            const data = await getGalleryImages();
            setImages(data);
            setLoading(false);
        };
        fetchImages();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-8xl font-serif font-black text-black laser-text mb-6 uppercase tracking-tighter">
                        {t('title')}
                    </h1>
                    <div className="w-24 h-2 bg-primary mx-auto mb-8 shadow-[0_0_15px_rgba(243,209,217,0.8)]" />
                    <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-3xl mx-auto italic">
                        {t('subtitle')}
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    </div>
                ) : images.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-800 py-32 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-dashed border-black/10"
                    >
                        <p className="text-2xl font-bold">{t('empty')}</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10"
                    >
                        {images.map((image: GalleryImage, idx: number) => (
                            <motion.div 
                                key={image.id} 
                                variants={item}
                                whileHover={{ scale: 1.02, rotate: -1 }}
                                className="break-inside-avoid relative group"
                            >
                                {/* The "Frame" */}
                                <div className="relative p-6 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-[12px] border-black transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_40px_80px_-15px_rgba(243,209,217,0.4)]">
                                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                                        <Image
                                            src={image.image_url}
                                            alt={image.caption || t('imageCaption')}
                                            fill
                                            priority={idx < 4}
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                    </div>
                                    
                                    {/* Caption inside the frame */}
                                    <div className="mt-4 pt-4 border-t-2 border-black/5">
                                        <p className="text-black font-black text-center uppercase tracking-widest text-sm">
                                            {image.caption || t('imageCaption')}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Professional Shadow under the frame */}
                                <div className="absolute -inset-2 bg-gradient-to-tr from-black/20 to-transparent blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

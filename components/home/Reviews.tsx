"use client";

import { useState, useEffect } from "react";
import { getReviews, submitReview } from "@/app/actions";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

type Review = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
};

interface RawReview {
    id: string;
    client_name?: string;
    name?: string;
    rating: number;
    comment: string;
    created_at?: string;
    date?: string;
    [key: string]: unknown;
}

export function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const t = useTranslations("Reviews");

    const mapReviewData = (data: RawReview[]) => {
        return data.map((r) => ({
            id: r.id,
            name: r.client_name || r.name || "Anonymous",
            rating: r.rating,
            comment: r.comment,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : r.date || new Date().toLocaleDateString()
        }));
    };

    useEffect(() => {
        const fetchReviews = async () => {
            const data = await getReviews();
            setReviews(mapReviewData(data));
        };
        fetchReviews();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append("rating", rating.toString());

        const result = await submitReview(null, formData);

        if (result.success) {
            setMessage("Thank you for your review!");
            setIsWriting(false);
            setIsWriting(false);
            // Reload reviews
            const data = await getReviews();
            setReviews(mapReviewData(data));
            (e.target as HTMLFormElement).reset();
        } else {
            setMessage(result.message || "Failed to submit review.");
        }
        setLoading(false);
    };

    return (
        <section className="py-24 bg-secondary/20">
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-black laser-text mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-gray-800 laser-text-gray max-w-2xl mx-auto text-lg italic">
                        {t('subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                    {reviews.map((review, index) => (
                        <motion.div 
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl shadow-2xl relative border border-gray-100 hover:-translate-y-2 transition-transform duration-300"
                        >
                            <Quote className="absolute -top-4 -left-4 w-10 h-10 text-primary opacity-50 fill-current" />
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-current" : "text-gray-200")} />
                                    ))}
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground ml-auto uppercase tracking-tighter opacity-70">{review.date}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-8 text-lg font-medium italic">&quot;{review.comment}&quot;</p>
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black text-primary rounded-xl flex items-center justify-center font-black shadow-lg transform -rotate-3 text-xl">
                                    {review.name.charAt(0)}
                                </div>
                                <div className="font-extrabold text-black laser-text text-lg uppercase tracking-tight">{review.name}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-2xl mx-auto">
                    {!isWriting ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <button
                                onClick={() => setIsWriting(true)}
                                className="bg-black text-primary px-10 py-4 rounded-full font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto uppercase tracking-widest border-2 border-primary"
                            >
                                <Quote className="w-5 h-5 opacity-70" />
                                {t('writeReview')}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-black"
                        >
                            <h3 className="text-3xl font-black text-black laser-text mb-8 text-center uppercase tracking-tight">
                                {t('shareExperience')}
                            </h3>
                            {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-center font-bold border-2 border-green-200">{message}</div>}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-black/60 mb-3 uppercase tracking-widest">
                                        {t('rating')}
                                    </label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md",
                                                    rating >= star ? "bg-primary text-black scale-110 rotate-3 shadow-lg" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                                )}
                                            >
                                                <Star className={cn("w-6 h-6", rating >= star && "fill-current")} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-black/60 mb-2 uppercase tracking-widest">
                                        {t('yourName')}
                                    </label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-lg"
                                        placeholder={t('yourName')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-black/60 mb-2 uppercase tracking-widest">
                                        {t('yourReview')}
                                    </label>
                                    <textarea
                                        name="comment"
                                        required
                                        rows={4}
                                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all font-medium text-lg"
                                        placeholder={t('yourReview')}
                                    />
                                </div>
                                <div className="flex gap-6 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsWriting(false)}
                                        className="flex-1 py-4 text-black font-black uppercase tracking-widest hover:text-primary transition-colors"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-3 bg-black text-primary py-4 rounded-xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest border-2 border-primary"
                                    >
                                        {loading ? t('submitting') : t('submit')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useState, useEffect } from "react";
import { getReviews, submitReview } from "@/app/actions";
import { Star, User, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Review = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
};

export function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        const data = await getReviews();
        // Map data to match Review type if needed (e.g. if Supabase returns different field names)
        // For now assuming mock data matches or Supabase uses client_name/rating/comment
        const formattedData = data.map((r: any) => ({
            id: r.id,
            name: r.client_name || r.name,
            rating: r.rating,
            comment: r.comment,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : r.date
        }));
        setReviews(formattedData);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append("rating", rating.toString());

        const result = await submitReview(null, formData);

        if (result.success) {
            setMessage("Thank you for your review!");
            setIsWriting(false);
            loadReviews(); // Reload reviews
            (e.target as HTMLFormElement).reset();
        } else {
            setMessage(result.message || "Failed to submit review.");
        }
        setLoading(false);
    };

    return (
        <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-primary mb-4">Client Experiences</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        See what our valued clients have to say about their services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-current" : "text-gray-200")} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground ml-auto">{review.date}</span>
                            </div>
                            <p className="text-gray-600 mb-6 italic">"{review.comment}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                    {review.name.charAt(0)}
                                </div>
                                <div className="font-bold text-primary">{review.name}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-2xl mx-auto">
                    {!isWriting ? (
                        <div className="text-center">
                            <button
                                onClick={() => setIsWriting(true)}
                                className="bg-white text-black px-8 py-3 rounded-full font-bold border-2 border-black hover:bg-black hover:text-white transition-colors shadow-lg flex items-center gap-2 mx-auto"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Write a Review
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-2xl font-bold text-primary mb-6 text-center">Share Your Experience</h3>
                            {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-center">{message}</div>}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                                    rating >= star ? "bg-yellow-400 text-white scale-110" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                                )}
                                            >
                                                <Star className={cn("w-5 h-5", rating >= star && "fill-current")} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Your Name</label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Your Review</label>
                                    <textarea
                                        name="comment"
                                        required
                                        rows={4}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                        placeholder="Tell us about your experience..."
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsWriting(false)}
                                        className="flex-1 py-3 text-muted-foreground hover:text-primary font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-white text-black py-3 rounded-lg font-bold border-2 border-black hover:bg-black hover:text-white transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        {loading ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

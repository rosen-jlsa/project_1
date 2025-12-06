"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { MessageCircle, Send, ThumbsUp, User } from "lucide-react";

interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
    date: string;
    likes: number;
}

export default function ReviewsPage() {
    const [rating, setRating] = useState(0);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 1,
            name: "Maria Ivanova",
            rating: 5,
            comment: "Amazing service! The staff is incredibly professional and the atmosphere is so relaxing. I had a wonderful experience with my haircut and styling.",
            date: "2025-11-28",
            likes: 12
        },
        {
            id: 2,
            name: "Elena Petrova",
            rating: 5,
            comment: "Best beauty salon in town! The attention to detail is outstanding. My nails look perfect and the manicure lasted for weeks. Highly recommend!",
            date: "2025-11-25",
            likes: 8
        },
        {
            id: 3,
            name: "Svetlana Georgieva",
            rating: 4,
            comment: "Great experience overall. The specialists are very skilled and friendly. Only minor wait time, but it was worth it. Will definitely come back!",
            date: "2025-11-20",
            likes: 5
        }
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0 || !name || !comment) {
            alert("Please fill in all fields and select a rating");
            return;
        }

        const newReview: Review = {
            id: reviews.length + 1,
            name,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0],
            likes: 0
        };

        setReviews([newReview, ...reviews]);

        // Reset form
        setRating(0);
        setName("");
        setComment("");
    };

    const handleLike = (id: number) => {
        setReviews(reviews.map(review =>
            review.id === id ? { ...review, likes: review.likes + 1 } : review
        ));
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0FFF0] via-white to-[#F0FFF0] py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                        <MessageCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                        Service Reviews
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Share your experience with our beauty services and help others make the best choice
                    </p>

                    {/* Average Rating Display */}
                    <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg inline-block">
                        <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
                        <StarRating rating={parseFloat(averageRating)} readonly size="lg" />
                        <p className="text-muted-foreground mt-2">Based on {reviews.length} reviews</p>
                    </div>
                </div>

                {/* Review Form */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-12 border border-gray-100">
                    <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                        <Send className="h-6 w-6" />
                        Share Your Experience
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Rate Our Service
                            </label>
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                                {rating > 0 && (
                                    <span className="text-lg font-semibold text-primary animate-fade-in">
                                        {rating} / 5
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-base"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Comment Textarea */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Review
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none text-base"
                                rows={5}
                                placeholder="Tell us about your experience with our services..."
                                required
                            />
                            <div className="text-right text-sm text-muted-foreground mt-1">
                                {comment.length} characters
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-white text-black py-4 px-6 rounded-xl font-bold text-lg border-2 border-black hover:bg-black hover:text-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Send className="h-5 w-5" />
                            Submit Review
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary mb-6">
                        Customer Reviews ({reviews.length})
                    </h2>

                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{review.name}</h3>
                                        <p className="text-sm text-muted-foreground">{review.date}</p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} readonly size="sm" />
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-4 text-base">
                                {review.comment}
                            </p>

                            <button
                                onClick={() => handleLike(review.id)}
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <ThumbsUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">{review.likes} helpful</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}

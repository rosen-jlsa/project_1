"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, onRatingChange, readonly = false, size = "md" }: StarRatingProps) {
    const [hoveredRating, setHoveredRating] = useState(0);

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8"
    };

    const handleClick = (value: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((value) => {
                const isFilled = value <= (hoveredRating || rating);
                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleClick(value)}
                        onMouseEnter={() => !readonly && setHoveredRating(value)}
                        onMouseLeave={() => !readonly && setHoveredRating(0)}
                        disabled={readonly}
                        className={`transition-all duration-200 ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                            }`}
                        aria-label={`Rate ${value} stars`}
                    >
                        <Star
                            className={`${sizeClasses[size]} transition-colors duration-200 ${isFilled
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-300"
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="relative group transition-all duration-300 hover:scale-110 focus:outline-none"
        >
          <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
          <Star
            size={40}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                : 'text-gray-300 hover:text-gray-400'
            } relative transition-all duration-300 transform ${
              star <= rating ? 'scale-110' : ''
            }`}
          />
        </button>
      ))}
    </div>
  );
}
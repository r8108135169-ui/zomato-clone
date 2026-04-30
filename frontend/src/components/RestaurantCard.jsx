// src/components/RestaurantCard.jsx
import { Star, Clock, Bike, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * RestaurantCard — Reusable card for displaying a restaurant in the listing.
 *
 * Props:
 *   restaurant {object}  — Restaurant data object
 *   className  {string}  — Optional extra class names
 */
export default function RestaurantCard({ restaurant, className = '' }) {
  const navigate = useNavigate();
  const {
    _id,
    name,
    cuisine,
    rating,
    reviewCount,
    deliveryTime,
    deliveryFee,
    priceForTwo,
    isVegOnly,
    isOpen,
    tags = [],
    image,
  } = restaurant;

  const handleClick = () => {
    if (!isOpen) return;
    navigate(`/restaurant/${_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`card group cursor-pointer transition-all duration-200
                  hover:-translate-y-1 hover:shadow-lg
                  ${!isOpen ? 'opacity-60 cursor-not-allowed' : ''}
                  ${className}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Closed overlay */}
        {!isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-display font-700 text-sm px-4 py-1.5 rounded-full">
              Currently Closed
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold bg-white/90 backdrop-blur-sm
                         text-gray-800 px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Veg only badge */}
        {isVegOnly && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-600
                          text-white text-xs font-semibold px-2 py-0.5 rounded-md">
            <Leaf size={10} />
            Pure Veg
          </div>
        )}

        {/* Delivery fee badge */}
        {deliveryFee === 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-brand-500
                          text-white text-xs font-semibold px-2 py-0.5 rounded-md">
            <Bike size={10} />
            Free Delivery
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-700 text-gray-900 text-base leading-tight line-clamp-1">
            {name}
          </h3>
          {/* Rating badge */}
          <div className="flex items-center gap-1 bg-green-50 border border-green-200
                          text-green-800 text-sm font-bold px-2 py-0.5 rounded-lg shrink-0">
            <Star size={11} fill="currentColor" />
            {rating}
          </div>
        </div>

        {/* Cuisine tags */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-1">
          {cuisine.join(' · ')}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span className="font-medium">{deliveryTime}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1">
            <Bike size={12} />
            <span className="font-medium">
              {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="font-medium text-gray-600">₹{priceForTwo} for two</span>
        </div>
      </div>
    </div>
  );
}

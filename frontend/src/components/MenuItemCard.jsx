// src/components/MenuItemCard.jsx
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * MenuItemCard — displays a single menu item with add/remove cart controls.
 *
 * Props:
 *   item           {object}  — MenuItem data
 *   restaurantId   {string}
 *   restaurantName {string}
 *   onRestaurantConflict (item, restaurantId, restaurantName) => void
 *                         — called when user tries to add from a different restaurant
 */
export default function MenuItemCard({ item, restaurantId, restaurantName, onRestaurantConflict }) {
  const { addItem, increment, decrement, getQuantity, isDifferentRestaurant } = useCart();
  const [imgErr, setImgErr] = useState(false);

  const qty = getQuantity(item._id);

  const handleAdd = () => {
    if (isDifferentRestaurant(restaurantId)) {
      onRestaurantConflict?.(item, restaurantId, restaurantName);
      return;
    }
    addItem(item, restaurantId, restaurantName);
  };

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0 group">
      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Veg/Non-veg indicator */}
        <div className="mb-1.5">
          {item.isVeg ? (
            <span className="veg-dot" title="Vegetarian" />
          ) : (
            <span className="non-veg-dot" title="Non-Vegetarian" />
          )}
        </div>

        {/* Name */}
        <h4 className="font-semibold text-gray-900 text-base mb-1">
          {item.name}
          {item.isBestseller && (
            <span className="ml-2 text-xs bg-amber-100 text-amber-800 font-semibold
                             px-1.5 py-0.5 rounded-md align-middle">
              🏆 Bestseller
            </span>
          )}
        </h4>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-2 line-clamp-2">
          {item.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-display font-700 text-gray-900 text-base">
            ₹{item.price}
          </span>
          {item.discountedPrice && (
            <span className="text-sm text-gray-400 line-through">₹{item.discountedPrice}</span>
          )}
        </div>
      </div>

      {/* Image + Add button */}
      <div className="relative shrink-0">
        <div className="w-28 h-24 rounded-xl overflow-hidden bg-gray-100">
          {!imgErr ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
          )}
        </div>

        {/* Add / Quantity control */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 bg-white border-2 border-brand-500
                         text-brand-600 font-bold text-sm px-4 py-1 rounded-xl
                         hover:bg-brand-500 hover:text-white transition-all shadow-sm
                         active:scale-95"
            >
              <Plus size={14} />
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-brand-500 text-white
                            rounded-xl px-2 py-1 shadow-sm animate-bounce-in">
              <button
                onClick={() => decrement(item._id)}
                className="hover:bg-brand-600 rounded-lg p-0.5 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-sm min-w-[1ch] text-center">{qty}</span>
              <button
                onClick={() => increment(item._id)}
                className="hover:bg-brand-600 rounded-lg p-0.5 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

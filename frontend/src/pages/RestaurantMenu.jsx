// src/pages/RestaurantMenu.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Bike, ArrowLeft, Leaf, AlertCircle } from 'lucide-react';
import MenuItemCard from '../components/MenuItemCard';
import { useCart } from '../context/CartContext';
import { useMenu } from '../hooks/useRestaurants';
import dummyData from '../data/restaurants.json';

// ─── Restaurant conflict modal ────────────────────────────────────────────────
function ConflictModal({ onConfirm, onCancel, currentName, newName }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-bounce-in">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-amber-600" />
        </div>
        <h3 className="font-display font-700 text-lg text-center text-gray-900 mb-2">
          Start a new cart?
        </h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          You have items from <strong>{currentName}</strong> in your cart. Adding items from{' '}
          <strong>{newName}</strong> will clear your existing cart.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-ghost py-3">
            Keep existing
          </button>
          <button onClick={onConfirm} className="flex-1 btn-primary py-3">
            Start fresh
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Category nav (sticky sidebar on desktop) ─────────────────────────────────
function CategoryNav({ categories, activeCategory, onSelect }) {
  return (
    <div className="hidden md:flex flex-col gap-1 w-48 shrink-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Menu</p>
      {categories.map((group) => (
        <button
          key={group.category}
          onClick={() => onSelect(group.category)}
          className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${activeCategory === group.category
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : 'text-gray-600 hover:bg-surface-100'}`}
        >
          {group.category}
          <span className="ml-1.5 text-xs text-gray-400">({group.items.length})</span>
        </button>
      ))}
    </div>
  );
}

// ─── Menu Page ────────────────────────────────────────────────────────────────
export default function RestaurantMenu() {
  const { id } = useParams();
  const { menu, loading, error } = useMenu(id);
  const { itemCount, total, openCart, restaurantName: cartRestaurantName } = useCart();

  const [activeCategory, setActiveCategory] = useState(null);
  const [vegFilter, setVegFilter] = useState(false);
  const [conflict, setConflict] = useState(null); // { item, restaurantId, restaurantName }

  // Get restaurant info from dummy data
  const restaurant = dummyData.restaurants.find((r) => r._id === id) || {};

  const handleRestaurantConflict = (item, restaurantId, restaurantName) => {
    setConflict({ item, restaurantId, restaurantName });
  };

  const handleConflictConfirm = () => {
    if (conflict) {
      // Force add — clearCart happens inside reducer when restaurant differs
      const { addItem, clearCart } = require('../context/CartContext'); // not ideal but works
    }
    setConflict(null);
  };

  const filteredMenu = menu
    .map((group) => ({
      ...group,
      items: vegFilter ? group.items.filter((i) => i.isVeg) : group.items,
    }))
    .filter((group) => group.items.length > 0)
    .filter((group) => !activeCategory || group.category === activeCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header skeleton */}
        <div className="h-48 bg-gray-200 rounded-3xl mb-6 animate-pulse" />
        <div className="flex gap-8">
          <div className="hidden md:flex flex-col gap-2 w-48">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="flex-1 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="w-28 h-24 bg-gray-200 rounded-xl animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
      {/* Back */}
      <div className="py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-600
                     text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to restaurants
        </Link>
      </div>

      {/* Restaurant header */}
      <div className="relative overflow-hidden rounded-3xl mb-8 bg-gray-100">
        {restaurant.coverImage && (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-48 sm:h-60 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              {restaurant.isVegOnly && (
                <div className="flex items-center gap-1 text-xs bg-green-500 text-white
                                font-semibold px-2 py-0.5 rounded-md w-fit mb-2">
                  <Leaf size={10} /> Pure Veg
                </div>
              )}
              <h1 className="font-display font-800 text-2xl sm:text-3xl mb-1">
                {restaurant.name}
              </h1>
              <p className="text-white/70 text-sm">{restaurant.cuisine?.join(' · ')}</p>
            </div>

            {/* Rating badge */}
            <div className="bg-green-500 text-white font-bold text-lg px-3 py-1.5
                            rounded-xl flex items-center gap-1.5 shrink-0">
              <Star size={15} fill="white" />
              {restaurant.rating}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
            <span className="flex items-center gap-1"><Clock size={13} />{restaurant.deliveryTime}</span>
            <span className="flex items-center gap-1">
              <Bike size={13} />
              {restaurant.deliveryFee === 0 ? 'Free delivery' : `₹${restaurant.deliveryFee} delivery`}
            </span>
            <span>₹{restaurant.priceForTwo} for two</span>
          </div>
        </div>
      </div>

      {/* Veg filter toggle */}
      <div className="flex items-center gap-3 mb-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setVegFilter(!vegFilter)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer
                        ${vegFilter ? 'bg-green-600' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
                            ${vegFilter ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">Veg only</span>
        </label>
      </div>

      {/* Layout: category nav + items */}
      <div className="flex gap-8">
        {/* Category nav */}
        {menu.length > 0 && (
          <div className="sticky top-20 h-fit">
            <CategoryNav
              categories={menu}
              activeCategory={activeCategory}
              onSelect={(cat) => setActiveCategory((p) => (p === cat ? null : cat))}
            />
          </div>
        )}

        {/* Menu items */}
        <div className="flex-1 min-w-0">
          {error && (
            <p className="text-red-500 text-center py-8">Failed to load menu: {error}</p>
          )}

          {filteredMenu.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🥗</p>
              <p className="font-display font-600 text-gray-600">No veg items in this section</p>
              <button onClick={() => setVegFilter(false)} className="btn-ghost mt-4 text-sm">
                Show all items
              </button>
            </div>
          )}

          {filteredMenu.map((group) => (
            <div key={group.category} className="mb-8" id={`cat-${group.category}`}>
              <h2 className="font-display font-700 text-xl text-gray-900 mb-1 pb-3
                             border-b border-gray-100">
                {group.category}
                <span className="ml-2 text-sm font-body font-normal text-gray-400">
                  ({group.items.length})
                </span>
              </h2>
              {group.items.map((item) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  restaurantId={id}
                  restaurantName={restaurant.name}
                  onRestaurantConflict={handleRestaurantConflict}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky cart bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
          <button
            onClick={openCart}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-display
                       font-700 text-base py-4 px-6 rounded-2xl shadow-lg shadow-brand-500/40
                       flex items-center justify-between transition-all active:scale-95"
          >
            <span className="bg-brand-600 text-white text-sm font-bold px-2 py-0.5 rounded-lg">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
            <span>View Cart</span>
            <span>₹{total.toLocaleString()}</span>
          </button>
        </div>
      )}

      {/* Conflict modal */}
      {conflict && (
        <ConflictModal
          currentName={cartRestaurantName}
          newName={conflict.restaurantName}
          onConfirm={() => setConflict(null)}
          onCancel={() => setConflict(null)}
        />
      )}
    </div>
  );
}

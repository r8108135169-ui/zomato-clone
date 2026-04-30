// src/components/CartDrawer.jsx
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    isOpen, closeCart, items, restaurantName,
    itemCount, subtotal, deliveryFee, taxes, total,
    increment, decrement, removeItem, clearCart,
  } = useCart();

  const goToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeCart();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Drawer panel */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col
                      animate-slide-up sm:animate-none sm:translate-x-0
                      sm:transform sm:transition-transform">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-display font-700 text-lg text-gray-900">Your Cart</h2>
            {restaurantName && (
              <p className="text-xs text-gray-500 mt-0.5">{restaurantName}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1
                           rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 rounded-xl hover:bg-surface-100 text-gray-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-display font-600 text-gray-700 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Add items to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="btn-primary mt-2"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map(({ item, quantity }) => (
                <div key={item._id} className="flex items-center gap-3 py-3 border-b border-gray-50">
                  {/* Veg indicator */}
                  <div className="shrink-0">
                    {item.isVeg
                      ? <span className="veg-dot" />
                      : <span className="non-veg-dot" />
                    }
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-brand-600 text-sm font-semibold mt-0.5">
                      ₹{(item.price * quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 bg-brand-50 rounded-xl px-2 py-1">
                    <button
                      onClick={() => decrement(item._id)}
                      className="text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-brand-700 text-sm min-w-[1ch] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => increment(item._id)}
                      className="text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bill summary + Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 pt-4 pb-6">
            {/* Bill details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery fee</span>
                <span className="font-medium">
                  {deliveryFee === 0
                    ? <span className="text-green-600">FREE</span>
                    : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%)</span>
                <span className="font-medium">₹{taxes}</span>
              </div>
              <div className="flex justify-between font-display font-700 text-gray-900 text-base
                              pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={goToCheckout}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-base"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

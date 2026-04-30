// src/pages/Checkout.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, CreditCard, Banknote, Smartphone,
  Wallet, CheckCircle, Loader2, ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePlaceOrder } from '../hooks/useRestaurants';

// ─── Payment method selector ──────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 'cod',    label: 'Cash on Delivery', icon: Banknote },
  { id: 'upi',    label: 'UPI',              icon: Smartphone },
  { id: 'card',   label: 'Card',             icon: CreditCard },
  { id: 'wallet', label: 'Wallet',           icon: Wallet },
];

// ─── Success overlay ──────────────────────────────────────────────────────────
function OrderSuccess({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white">
      <div className="text-center max-w-sm mx-auto animate-bounce-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="font-display font-800 text-2xl text-gray-900 mb-2">Order Placed! 🎉</h2>
        <p className="text-gray-500 mb-1">
          Your order has been confirmed successfully.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Estimated delivery: <span className="font-semibold text-brand-600">30–40 min</span>
        </p>
        <div className="bg-surface-100 rounded-2xl p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono font-semibold text-xs text-gray-700 truncate max-w-36">
              {order?._id || 'ORD-' + Date.now()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold text-gray-700 capitalize">{order?.paymentMethod || 'cod'}</span>
          </div>
        </div>
        <button onClick={onClose} className="btn-primary w-full py-3 text-base">
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName, subtotal, deliveryFee, taxes, total, clearCart } =
    useCart();
  const { placeOrder, loading } = usePlaceOrder();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    line1: '',
    city: 'Bengaluru',
    pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [orderResult, setOrderResult] = useState(null);

  // If cart is empty, redirect
  if (items.length === 0 && !orderResult) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-display font-700 text-xl text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add items before checking out.</p>
        <Link to="/" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!address.line1.trim()) errs.line1 = 'Address is required';
    if (!address.pincode.trim()) errs.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(address.pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      userId: 'guest_user',   // Replace with auth userId
      restaurantId,
      items: items.map(({ item, quantity }) => ({
        menuItemId: item._id,
        quantity,
      })),
      deliveryAddress: address,
      paymentMethod,
    };

    const result = await placeOrder(payload);
    if (result?.success) {
      clearCart();
      setOrderResult(result.data);
    }
  };

  if (orderResult) {
    return (
      <OrderSuccess
        order={orderResult}
        onClose={() => navigate('/')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Back */}
      <div className="mb-6">
        <Link
          to={`/restaurant/${restaurantId}`}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-600
                     text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to menu
        </Link>
      </div>

      <h1 className="font-display font-800 text-2xl text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left column: Address + Payment ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* Delivery Address */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-brand-600" />
              </div>
              <h2 className="font-display font-700 text-base text-gray-900">Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={address.line1}
                  onChange={(e) => {
                    setAddress({ ...address, line1: e.target.value });
                    setErrors({ ...errors, line1: undefined });
                  }}
                  placeholder="House no., street, area"
                  className={`w-full px-4 py-3 bg-surface-50 border rounded-xl text-sm
                              focus:outline-none focus:border-brand-400 focus:bg-white transition-all
                              ${errors.line1 ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 border border-gray-200 rounded-xl
                               text-sm focus:outline-none focus:border-brand-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode *</label>
                  <input
                    type="text"
                    value={address.pincode}
                    maxLength={6}
                    onChange={(e) => {
                      setAddress({ ...address, pincode: e.target.value });
                      setErrors({ ...errors, pincode: undefined });
                    }}
                    placeholder="560001"
                    className={`w-full px-4 py-3 bg-surface-50 border rounded-xl text-sm
                                focus:outline-none focus:border-brand-400 transition-all
                                ${errors.pincode ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                <CreditCard size={16} className="text-brand-600" />
              </div>
              <h2 className="font-display font-700 text-base text-gray-900">Payment Method</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left
                              transition-all font-medium text-sm
                              ${paymentMethod === id
                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                  ${paymentMethod === id ? 'bg-brand-500 text-white' : 'bg-surface-100'}`}>
                    <Icon size={16} />
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column: Order Summary ── */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBag size={16} className="text-brand-500" />
              <h2 className="font-display font-700 text-base text-gray-900">
                {restaurantName}
              </h2>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
              {items.map(({ item, quantity }) => (
                <div key={item._id} className="flex justify-between items-start gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className={`mt-1 shrink-0 w-3 h-3 rounded-sm border-2
                                     ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}
                    />
                    <span className="text-sm text-gray-700 line-clamp-1">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-gray-400 mr-1">×{quantity}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{(item.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery fee</span>
                <span>{deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes & charges</span>
                <span>₹{taxes}</span>
              </div>
              <div className="flex justify-between font-display font-700 text-gray-900 text-lg
                              pt-3 border-t border-gray-100">
                <span>To pay</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Place order button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full btn-primary py-4 text-base mt-5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Placing Order…
                </>
              ) : (
                <>
                  Place Order · ₹{total.toLocaleString()}
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By placing your order you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

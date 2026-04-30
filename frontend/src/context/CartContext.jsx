// src/context/CartContext.jsx
import { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  items: [],           // [{ item, quantity, restaurantId, restaurantName }]
  restaurantId: null,
  restaurantName: '',
  isOpen: false,       // cart drawer open/closed
};

// ─── Action Types ─────────────────────────────────────────────────────────────
const ADD_ITEM        = 'ADD_ITEM';
const REMOVE_ITEM     = 'REMOVE_ITEM';
const INCREMENT       = 'INCREMENT';
const DECREMENT       = 'DECREMENT';
const CLEAR_CART      = 'CLEAR_CART';
const TOGGLE_CART     = 'TOGGLE_CART';
const SET_CART_OPEN   = 'SET_CART_OPEN';

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {

    case ADD_ITEM: {
      const { item, restaurantId, restaurantName } = action.payload;

      // If cart has items from a different restaurant, reset it
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          ...state,
          items: [{ item, quantity: 1 }],
          restaurantId,
          restaurantName,
        };
      }

      const existing = state.items.find((i) => i.item._id === item._id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.item._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { item, quantity: 1 }],
        restaurantId,
        restaurantName,
      };
    }

    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((i) => i.item._id !== action.payload),
        ...(state.items.length <= 1 ? { restaurantId: null, restaurantName: '' } : {}),
      };

    case INCREMENT:
      return {
        ...state,
        items: state.items.map((i) =>
          i.item._id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };

    case DECREMENT: {
      const target = state.items.find((i) => i.item._id === action.payload);
      if (target && target.quantity <= 1) {
        // Remove item if quantity reaches 0
        const updated = state.items.filter((i) => i.item._id !== action.payload);
        return {
          ...state,
          items: updated,
          ...(updated.length === 0 ? { restaurantId: null, restaurantName: '' } : {}),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.item._id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }

    case CLEAR_CART:
      return { ...initialState };

    case TOGGLE_CART:
      return { ...state, isOpen: !state.isOpen };

    case SET_CART_OPEN:
      return { ...state, isOpen: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ── Derived values ──
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = state.items.reduce(
    (sum, i) => sum + i.item.price * i.quantity,
    0
  );

  const deliveryFee = state.items.length > 0 ? 30 : 0;
  const taxes       = Math.round(subtotal * 0.05);
  const total       = subtotal + deliveryFee + taxes;

  const getQuantity = useCallback(
    (itemId) => state.items.find((i) => i.item._id === itemId)?.quantity ?? 0,
    [state.items]
  );

  const isDifferentRestaurant = useCallback(
    (restaurantId) => !!state.restaurantId && state.restaurantId !== restaurantId,
    [state.restaurantId]
  );

  // ── Action dispatchers ──
  const addItem = useCallback((item, restaurantId, restaurantName) => {
    dispatch({ type: ADD_ITEM, payload: { item, restaurantId, restaurantName } });
  }, []);

  const removeItem  = useCallback((itemId)  => dispatch({ type: REMOVE_ITEM, payload: itemId }), []);
  const increment   = useCallback((itemId)  => dispatch({ type: INCREMENT,   payload: itemId }), []);
  const decrement   = useCallback((itemId)  => dispatch({ type: DECREMENT,   payload: itemId }), []);
  const clearCart   = useCallback(()        => dispatch({ type: CLEAR_CART  }), []);
  const toggleCart  = useCallback(()        => dispatch({ type: TOGGLE_CART }), []);
  const openCart    = useCallback(()        => dispatch({ type: SET_CART_OPEN, payload: true  }), []);
  const closeCart   = useCallback(()        => dispatch({ type: SET_CART_OPEN, payload: false }), []);

  return (
    <CartContext.Provider
      value={{
        // State
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        isOpen: state.isOpen,
        // Derived
        itemCount,
        subtotal,
        deliveryFee,
        taxes,
        total,
        // Helpers
        getQuantity,
        isDifferentRestaurant,
        // Actions
        addItem,
        removeItem,
        increment,
        decrement,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

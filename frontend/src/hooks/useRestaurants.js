// src/hooks/useRestaurants.js
import { useState, useEffect, useCallback } from 'react';
import dummyData from '../data/restaurants.json';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_DUMMY = import.meta.env.VITE_USE_DUMMY !== 'false'; // default: use dummy

export function useRestaurants(filters = {}) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_DUMMY) {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 400));
        let data = [...dummyData.restaurants];

        // Apply client-side filters on dummy data
        if (filters.search) {
          const q = filters.search.toLowerCase();
          data = data.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.cuisine.some((c) => c.toLowerCase().includes(q))
          );
        }
        if (filters.category) {
          data = data.filter((r) =>
            r.category.toLowerCase() === filters.category.toLowerCase()
          );
        }
        if (filters.isVegOnly) {
          data = data.filter((r) => r.isVegOnly);
        }
        if (filters.minRating) {
          data = data.filter((r) => r.rating >= parseFloat(filters.minRating));
        }
        if (filters.maxDeliveryFee !== undefined && filters.maxDeliveryFee !== null) {
          data = data.filter((r) => r.deliveryFee <= filters.maxDeliveryFee);
        }
        // Sort
        if (filters.sortBy === 'rating')       data.sort((a, b) => b.rating - a.rating);
        if (filters.sortBy === 'deliveryFee')  data.sort((a, b) => a.deliveryFee - b.deliveryFee);
        if (filters.sortBy === 'priceAsc')     data.sort((a, b) => a.priceForTwo - b.priceForTwo);
        if (filters.sortBy === 'priceDesc')    data.sort((a, b) => b.priceForTwo - a.priceForTwo);

        setRestaurants(data);
      } else {
        const params = new URLSearchParams(
          Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== '')
        );
        const res = await fetch(`${API_BASE}/restaurants?${params}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setRestaurants(json.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return { restaurants, loading, error, refetch: fetchRestaurants };
}

export function useMenu(restaurantId) {
  const [menu, setMenu]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!restaurantId) return;
    const fetch_ = async () => {
      setLoading(true);
      try {
        if (USE_DUMMY) {
          await new Promise((r) => setTimeout(r, 300));
          const items = dummyData.menuItems.filter(
            (item) => item.restaurantId === restaurantId
          );
          // Group by category
          const grouped = items.reduce((acc, item) => {
            const cat = item.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
          }, {});
          const categories = Object.keys(grouped).map((cat) => ({
            category: cat,
            items: grouped[cat],
          }));
          setMenu(categories);
        } else {
          const res  = await fetch(`${API_BASE}/menu/${restaurantId}`);
          const json = await res.json();
          if (!json.success) throw new Error(json.message);
          setMenu(json.data.categories);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [restaurantId]);

  return { menu, loading, error };
}

export function usePlaceOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const placeOrder = async (orderPayload) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_DUMMY) {
        await new Promise((r) => setTimeout(r, 1000));
        return {
          success: true,
          data: {
            _id: `order_${Date.now()}`,
            ...orderPayload,
            status: 'confirmed',
            estimatedDeliveryTime: '30-40 min',
            createdAt: new Date().toISOString(),
          },
        };
      }
      const res  = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
}

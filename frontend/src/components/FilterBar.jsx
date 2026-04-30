// src/components/FilterBar.jsx
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const SORT_OPTIONS = [
  { value: 'rating',      label: 'Top Rated' },
  { value: 'deliveryFee', label: 'Lowest Delivery Fee' },
  { value: 'priceAsc',    label: 'Price: Low to High' },
  { value: 'priceDesc',   label: 'Price: High to Low' },
];

const RATING_OPTIONS = [
  { value: '4.5', label: '4.5+' },
  { value: '4.0', label: '4.0+' },
  { value: '3.5', label: '3.5+' },
];

/**
 * FilterBar
 * Props:
 *   filters  { sortBy, minRating, isVegOnly, maxDeliveryFee }
 *   onChange (newFilters) => void
 */
export default function FilterBar({ filters, onChange }) {
  const [showSort, setShowSort] = useState(false);

  const toggle = (key, value) => {
    if (filters[key] === value) {
      onChange({ ...filters, [key]: undefined });
    } else {
      onChange({ ...filters, [key]: value });
    }
  };

  const activeCount = [
    filters.isVegOnly,
    filters.minRating,
    filters.maxDeliveryFee !== undefined,
    filters.sortBy && filters.sortBy !== 'rating',
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({ sortBy: 'rating', minRating: undefined, isVegOnly: false, maxDeliveryFee: undefined });

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">

      {/* Sort dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowSort(!showSort)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                      border transition-all
                      ${filters.sortBy && filters.sortBy !== 'rating'
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-400'}`}
        >
          <SlidersHorizontal size={14} />
          Sort
          <ChevronDown size={13} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
        </button>

        {showSort && (
          <div className="absolute top-full mt-1 left-0 z-30 bg-white border border-gray-100
                          rounded-xl shadow-lg py-1.5 min-w-48 animate-slide-up">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange({ ...filters, sortBy: opt.value }); setShowSort(false); }}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors
                            ${filters.sortBy === opt.value
                              ? 'text-brand-600 bg-brand-50'
                              : 'text-gray-700 hover:bg-surface-100'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Veg Only */}
      <button
        onClick={() => onChange({ ...filters, isVegOnly: !filters.isVegOnly })}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                    border transition-all shrink-0
                    ${filters.isVegOnly
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'}`}
      >
        <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center
                          ${filters.isVegOnly ? 'border-white' : 'border-green-600'}`}>
          <span className={`w-1.5 h-1.5 rounded-full
                            ${filters.isVegOnly ? 'bg-white' : 'bg-green-600'}`} />
        </span>
        Veg Only
      </button>

      {/* Rating filters */}
      {RATING_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => toggle('minRating', opt.value)}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium
                      border transition-all shrink-0
                      ${filters.minRating === opt.value
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-400'}`}
        >
          ★ {opt.label}
        </button>
      ))}

      {/* Free Delivery */}
      <button
        onClick={() => toggle('maxDeliveryFee', 0)}
        className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all shrink-0
                    ${filters.maxDeliveryFee === 0
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-400'}`}
      >
        Free Delivery
      </button>

      {/* Clear All */}
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium
                     text-red-500 border border-red-200 hover:bg-red-50 transition-all shrink-0"
        >
          <X size={13} />
          Clear ({activeCount})
        </button>
      )}
    </div>
  );
}

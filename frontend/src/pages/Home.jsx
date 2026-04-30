// src/pages/Home.jsx
import { useState } from 'react';
import { ChevronRight, Flame, Star } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import FilterBar from '../components/FilterBar';
import { useRestaurants } from '../hooks/useRestaurants';
import dummyData from '../data/restaurants.json';

// ─── Category Pill ────────────────────────────────────────────────────────────
function CategoryPill({ category, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(category.name)}
      className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl
                  border-2 transition-all duration-150 shrink-0 min-w-16
                  ${isActive
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-brand-300'}`}
    >
      <span className="text-2xl">{category.emoji}</span>
      <span className="text-xs font-semibold whitespace-nowrap">{category.name}</span>
    </button>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function RestaurantSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full mt-4" />
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home({ searchQuery = '' }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [filters, setFilters] = useState({ sortBy: 'rating' });

  const combinedFilters = {
    ...filters,
    ...(searchQuery ? { search: searchQuery } : {}),
    ...(activeCategory ? { category: activeCategory } : {}),
  };

  const { restaurants, loading, error } = useRestaurants(combinedFilters);
  const categories = dummyData.categories;

  const handleCategoryClick = (name) => {
    setActiveCategory((prev) => (prev === name ? null : name));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden rounded-3xl mt-6 mb-8
                           bg-gradient-to-br from-brand-500 via-orange-500 to-amber-400
                           px-8 py-10 sm:py-14">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/10 rounded-full translate-y-1/2" />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 bg-white/20 text-white text-sm font-semibold
                          px-3 py-1 rounded-full w-fit mb-4">
            <Flame size={14} />
            Delivering to Bengaluru
          </div>
          <h1 className="font-display font-800 text-white text-3xl sm:text-4xl leading-tight mb-3">
            Hungry? We've got<br />you covered. 🍔
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Order from 5+ restaurants near you — fast delivery, great food.
          </p>
        </div>

        {/* Floating food emoji decorations */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 text-4xl opacity-90">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🍕</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🍜</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🥗</span>
        </div>
      </section>

      {/* ── Category Scroll ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-700 text-xl text-gray-900">What's on your mind?</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              category={cat}
              isActive={activeCategory === cat.name}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </section>

      {/* ── Filters & Listing ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-700 text-xl text-gray-900">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : activeCategory
              ? `${activeCategory} Restaurants`
              : 'All Restaurants'}
            {!loading && (
              <span className="ml-2 text-sm font-body font-normal text-gray-400">
                ({restaurants.length})
              </span>
            )}
          </h2>
        </div>

        {/* Filter bar */}
        <div className="mb-6">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-12 text-red-500">
            <p>Failed to load restaurants: {error}</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <RestaurantSkeleton key={i} />)
            : restaurants.map((r) => (
                <div key={r._id} className="animate-fade-in">
                  <RestaurantCard restaurant={r} />
                </div>
              ))}
        </div>

        {/* Empty state */}
        {!loading && restaurants.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="font-display font-700 text-xl text-gray-700 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => { setFilters({ sortBy: 'rating' }); setActiveCategory(null); }}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

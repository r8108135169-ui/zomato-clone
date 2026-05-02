// src/components/Navbar.jsx
import { ShoppingBag, MapPin, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar({ onSearchChange }) {
  const { itemCount, toggleCart, total } = useCart();
  const [searchVal, setSearchVal] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-lg leading-none">🍔</span>
            </div>
            <span className="font-display font-800 text-xl text-gray-900 hidden sm:block">
              Foo<span className="text-brand-500">Dash</span>
            </span>
          </Link>

          {/* Location pill */}
          <button className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-600
                             hover:text-brand-600 border border-gray-200 rounded-xl px-3 py-1.5
                             hover:border-brand-300 transition-colors shrink-0">
            <MapPin size={14} className="text-brand-500" />
            <span>Bengaluru</span>
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={handleSearch}
                placeholder="Search restaurants, cuisines…"
                className="w-full pl-9 pr-4 py-2 bg-surface-100 border border-transparent
                           rounded-xl text-sm focus:outline-none focus:border-brand-400
                           focus:bg-white transition-all placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        
        {/* ADD THESE LINES STARTING HERE */}
        <div className="hidden md:flex items-center gap-3 mr-2">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="text-sm font-medium bg-gray-100 text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all">
            Sign Up
          </Link>
        </div>
        {/* ADD THESE LINES ENDING HERE */}

        {/* Cart button */}
        <button
          onClick={toggleCart}
          className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-3 py-2 transition-all active:scale-95"
        >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="hidden sm:inline text-sm font-semibold">
                  ₹{total.toLocaleString()}
                </span>
              )}
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white
                                 text-xs font-bold rounded-full flex items-center justify-center
                                 animate-bounce-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-100 text-gray-600"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

     {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 animate-slide-up">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
            <MapPin size={14} className="text-brand-500" />
            <span className="font-medium">Delivering to: Bengaluru</span>
          </div>

          {/* ADD THESE MOBILE LINKS HERE */}
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-50">
            <Link 
              to="/login" 
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm font-medium text-gray-600 hover:text-brand-600"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm font-medium text-brand-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

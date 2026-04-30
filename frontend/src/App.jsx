// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import RestaurantMenu from './pages/RestaurantMenu';
import Checkout from './pages/Checkout';

/**
 * App — root component with providers, routing, and shared layout.
 *
 * Layout:
 *  <CartProvider>            — global cart state
 *    <BrowserRouter>
 *      <Navbar />            — sticky header with search + cart icon
 *      <CartDrawer />        — slide-in cart panel (rendered at root so it overlays all pages)
 *      <Routes>
 *        /               → <Home />
 *        /restaurant/:id → <RestaurantMenu />
 *        /checkout       → <Checkout />
 *      </Routes>
 *    </BrowserRouter>
 *  </CartProvider>
 */
export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-surface-50 font-body">
          {/* Shared navigation */}
          <Navbar onSearchChange={setSearchQuery} />

          {/* Global cart drawer — portal-style, renders above all pages */}
          <CartDrawer />

          {/* Page routes */}
          <Routes>
            <Route path="/"                    element={<Home searchQuery={searchQuery} />} />
            <Route path="/restaurant/:id"      element={<RestaurantMenu />} />
            <Route path="/checkout"            element={<Checkout />} />
            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                  <p className="text-6xl mb-4">🍽️</p>
                  <h2 className="font-display font-800 text-2xl text-gray-800 mb-2">
                    Page not found
                  </h2>
                  <p className="text-gray-400 mb-6">Looks like this dish isn't on the menu.</p>
                  <a href="/" className="btn-primary">Go back home</a>
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

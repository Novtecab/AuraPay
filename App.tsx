
import React, { useState, useCallback, useEffect } from 'react';
import type { CartItem, NavItemType, Product } from './types';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import HomeView from './views/HomeView';
import ScanView from './views/ScanView';
import CartView from './views/CartView';
import ProfileView from './views/ProfileView';
import { MOCK_PRODUCTS } from './constants';

function App() {
  const [activeView, setActiveView] = useState<NavItemType>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000000');
    } else {
      document.documentElement.classList.remove('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
    }
  }, [isDarkMode]);

  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView products={filteredProducts} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case 'scan':
        return <ScanView />;
      case 'cart':
        return <CartView cart={cart} updateCartQuantity={updateCartQuantity} clearCart={clearCart} />;
      case 'profile':
        return <ProfileView isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />;
      default:
        return <HomeView products={filteredProducts} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full min-h-screen bg-slate-100 dark:bg-black font-sans">
      {/* --- Desktop Header --- */}
      <header className="hidden md:block sticky top-0 z-40">
        <Header 
          activeView={activeView} 
          setActiveView={setActiveView} 
          cartCount={cartCount} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </header>

      {/* --- Main Content Area --- */}
      <div className="w-full max-w-md md:max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 min-h-screen md:min-h-0 md:my-6 md:shadow-lg md:rounded-lg">
          <main className="flex-1 pb-20 md:pb-0">
            {renderView()}
          </main>
        </div>
      </div>
      
      {/* --- Mobile Bottom Navigation --- */}
      <div className="md:hidden">
        <BottomNav activeView={activeView} setActiveView={setActiveView} cartCount={cartCount} />
      </div>
    </div>
  );
}

export default App;

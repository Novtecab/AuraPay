import React from 'react';
import type { NavItemType, NavItem } from '../types';
import { HomeIcon, QrCodeIcon, ShoppingCartIcon, UserIcon } from './icons/NavIcons';

interface BottomNavProps {
  activeView: NavItemType;
  setActiveView: (view: NavItemType) => void;
  cartCount: number;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'scan', label: 'Scan', icon: QrCodeIcon },
  { id: 'cart', label: 'Cart', icon: ShoppingCartIcon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, cartCount }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center w-full transition-all duration-200 transform active:scale-90 ${
              activeView === item.id ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-500'
            }`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.id === 'cart' && cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default BottomNav;
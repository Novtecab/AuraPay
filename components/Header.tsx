import React from 'react';
import type { NavItemType, NavItem } from '../types';
import { HomeIcon, QrCodeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from './icons/NavIcons';
import { AuraPayIcon } from './icons/LogoIcon';

interface HeaderProps {
  activeView: NavItemType;
  setActiveView: (view: NavItemType) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const navItems: NavItem[] = [
  { id: 'scan', label: 'Scan', icon: QrCodeIcon },
  { id: 'cart', label: 'Cart', icon: ShoppingCartIcon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
];

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, cartCount, searchQuery, setSearchQuery }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <button onClick={() => setActiveView('home')} className="flex items-center space-x-2.5 group focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md">
                    <AuraPayIcon className="h-8 w-8 text-amber-700 group-hover:text-amber-600 transition-colors" />
                    <span className="text-2xl font-bold text-amber-700 group-hover:text-amber-600 transition-colors">AuraPay</span>
                </button>
                
                {activeView === 'home' && (
                  <div className="flex-1 max-w-xl mx-8">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="search"
                        name="search"
                        id="search"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-200"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <nav className="flex items-center space-x-8" style={{ marginLeft: activeView !== 'home' ? 'auto' : undefined }}>
                    {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`flex items-center space-x-2 transition-all duration-200 group transform active:scale-90 ${
                        activeView === item.id ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-500'
                        }`}
                    >
                        <div className="relative">
                            <item.icon className="w-6 h-6" />
                            {item.id === 'cart' && cartCount > 0 && (
                                <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                    ))}
                </nav>
            </div>
        </div>
    </header>
  );
};

export default Header;
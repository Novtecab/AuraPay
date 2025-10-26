
import React, { useState } from 'react';
import ImageWithLoader from '../components/ImageWithLoader';
import type { Product } from '../types';
import { HeartIcon, TrashIcon } from '../components/icons/UtilityIcons';
import { ShoppingCartIcon } from '../components/icons/NavIcons';

interface ProfileViewProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToCart: (product: Product) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ isDarkMode, setIsDarkMode, wishlist, toggleWishlist, addToCart }) => {
  const [showWishlist, setShowWishlist] = useState(false);

  const options = [
    { name: 'Wishlist', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z', action: () => setShowWishlist(true) },
    { name: 'Order History', icon: 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v.112A48.678 48.678 0 0 0 4.5 15.75v2.625c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-2.625a48.678 48.678 0 0 0-2.25-3.662v-.112Z' },
    { name: 'Payment Methods', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25h6m-6 2.25h6m3-5.25h6m-6 2.25h6M2.25 19.5h19.5M4.5 7.5v11.25' },
    { name: 'Settings', icon: 'M9.594 3.94c.09-.542.56-1.008 1.11-1.226a11.95 11.95 0 0 1 2.59 0c.55.218 1.02.684 1.11 1.226.09.542-.01 1.08-.232 1.564a10.485 10.485 0 0 1-.533 1.264c-.27.464-.626.86-1.025 1.18V13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V8.948a10.483 10.483 0 0 1-1.558-2.45c-.22-.48-.32-1.02-.23-1.56Z' },
    { name: 'Help & Support', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z' }
  ];

  if (showWishlist) {
    return (
      <div className="p-4 md:p-8 min-h-full animate-fadeIn">
        <header className="mb-6 flex items-center">
          <button onClick={() => setShowWishlist(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-2 -ml-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 ml-2">My Wishlist</h1>
        </header>
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <HeartIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">Your wishlist is empty.</p>
            <p className="text-slate-400 dark:text-slate-500 mt-2">Add items you love by tapping the heart icon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item, index) => (
              <div key={item.id} className="flex items-start bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 opacity-0 animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <ImageWithLoader
                  containerClassName="w-20 h-20 rounded-md mr-4 flex-shrink-0"
                  imageClassName="w-full h-full object-cover rounded-md"
                  src={item.image}
                  alt={item.name}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{item.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">${item.price.toLocaleString()}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <button onClick={() => addToCart(item)} className="flex items-center justify-center text-xs font-semibold bg-slate-100 text-slate-700 py-1.5 px-3 rounded-full hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors transform active:scale-95 duration-150">
                      <ShoppingCartIcon className="w-4 h-4 mr-1.5" />
                      Add to Cart
                    </button>
                    <button onClick={() => toggleWishlist(item)} className="flex items-center justify-center text-xs font-semibold text-red-500 py-1.5 px-3 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors transform active:scale-95 duration-150">
                      <TrashIcon className="w-4 h-4 mr-1.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-full animate-fadeIn">
      <div className="p-4 md:p-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-4 max-w-lg mx-auto opacity-0 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <ImageWithLoader
            containerClassName="h-20 w-20 rounded-full"
            imageClassName="w-full h-full object-cover rounded-full"
            src="https://picsum.photos/seed/user/200/200"
            alt="User"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Alex Chen</h1>
            <p className="text-slate-500 dark:text-slate-400">alex.chen@email.com</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 max-w-lg mx-auto">
          {options.map((option, index) => (
            <div 
              key={option.name} 
              onClick={option.action}
              className={`flex items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:translate-x-1 ${index < options.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''} opacity-0 animate-fadeInUp`}
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500 dark:text-slate-400 mr-4">
                <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
              </svg>
              <span className="flex-1 text-slate-700 dark:text-slate-300 font-medium">{option.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-400 dark:text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 max-w-lg mx-auto mt-8 opacity-0 animate-fadeInUp" style={{ animationDelay: `${300 + options.length * 100}ms` }}>
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500 dark:text-slate-400 mr-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Dark Mode</span>
                </div>
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-slate-900 ${isDarkMode ? 'bg-amber-600' : 'bg-slate-300'}`}
                    role="switch"
                    aria-checked={isDarkMode}
                    aria-label="Toggle dark mode"
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
            </div>
        </div>


        <button className="w-full max-w-lg mx-auto mt-8 text-red-600 font-semibold bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 transform active:scale-95 opacity-0 animate-fadeInUp" style={{ animationDelay: `${400 + options.length * 100}ms` }}>
            Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileView;

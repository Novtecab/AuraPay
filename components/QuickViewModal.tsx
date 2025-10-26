
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import InstallmentPlan from './InstallmentPlan';
import ImageWithLoader from './ImageWithLoader';
import { HeartIcon } from './icons/UtilityIcons';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  addToCart: (product: Product) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, addToCart, wishlist, toggleWishlist }) => {
  const [isAdded, setIsAdded] = useState(false);
  
  const isInWishlist = wishlist.some(item => item.id === product.id);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl m-4 animate-scaleIn overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 z-10"
          aria-label="Close quick view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-900 p-4">
            <ImageWithLoader
                containerClassName="w-full h-64 md:h-full rounded-lg"
                imageClassName="w-full h-full object-contain rounded-lg"
                src={product.image}
                alt={product.name}
            />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                  <span className="text-sm text-amber-600 font-semibold">{product.category}</span>
                  <h2 id="quick-view-title" className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {product.name}
                  </h2>
              </div>
              <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 rounded-full text-slate-600 hover:text-red-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 dark:hover:text-red-500 transition-colors flex-shrink-0 ml-4"
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                  <HeartIcon filled={isInWishlist} className={`w-6 h-6 ${isInWishlist ? 'text-red-500' : ''}`} />
              </button>
            </div>
            <p className="text-2xl font-bold text-amber-700 mt-3">
              ${product.price.toLocaleString()}
            </p>
            <div className="mt-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed pr-2">
              <p>{product.description}</p>
            </div>
          </div>
          
          <div className="mt-auto pt-6">
            <InstallmentPlan totalPrice={product.price} />
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full mt-4 py-3 rounded-lg font-semibold text-lg transition-colors transform active:scale-95 duration-150 ${
                isAdded
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-slate-800 text-white hover:bg-slate-900 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500'
              }`}
            >
              {isAdded ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

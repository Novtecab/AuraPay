
import React, { useState, useCallback } from 'react';
import type { Product } from '../types';
import InstallmentPlan from './InstallmentPlan';
import { generateProductDescription } from '../services/geminiService';
import ShareModal from './ShareModal';
import QuickViewModal from './QuickViewModal';
import { EyeIcon, HeartIcon } from './icons/UtilityIcons';
import ImageWithLoader from './ImageWithLoader';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, wishlist, toggleWishlist }) => {
  const [currentDescription, setCurrentDescription] = useState(product.description);
  const [isLoading, setIsLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const isInWishlist = wishlist.some(item => item.id === product.id);

  const handleGenerateDescription = useCallback(async () => {
    setIsLoading(true);
    // Add specific, plausible details based on the product name to guide the AI.
    let details = '';
    const lowerCaseName = product.name.toLowerCase();
    
    if (lowerCaseName.includes('ghost')) {
      details = 'Describe the VVS1 clarity diamonds and the 18k white gold setting.';
    } else if (lowerCaseName.includes('cuban link')) {
      details = 'Focus on the meticulous hand-setting of the 25 carats of diamonds and the weight of the 14k gold.';
    } else if (lowerCaseName.includes('oni')) {
      details = 'Envision Burmese rubies for the eyes and the intricate carving details of the 18k gold mask.';
    } else if (lowerCaseName.includes('bearbrick')) {
      details = 'Detail the colorful sapphires used and describe it as a tribute to pop culture art.';
    } else if (lowerCaseName.includes('jesus piece')) {
        details = 'Mention the crown of thorns and the detailed, expressive features of the piece in 14k gold.';
    }

    const newDescription = await generateProductDescription(product.name, product.category, details);
    setCurrentDescription(newDescription);
    setIsLoading(false);
  }, [product.name, product.category]);
  
  return (
    <>
      <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
        <div className="relative">
          <ImageWithLoader
            containerClassName="h-56 w-full"
            src={product.image}
            alt={`Image of ${product.name}`}
          />
          <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-1.5 rounded-full text-slate-700 hover:text-red-500 hover:bg-white transition-all duration-200 transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
              <HeartIcon filled={isInWishlist} className={`w-6 h-6 ${isInWishlist ? 'text-red-500' : 'text-slate-500'}`} />
          </button>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{product.name}</h3>
              <p className="text-base font-bold text-amber-700">${product.price.toLocaleString()}</p>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 h-16 overflow-hidden flex-1">
            {isLoading ? (
              <div className="space-y-2 pt-1">
                <div className="h-4 rounded animate-shimmer w-full"></div>
                <div className="h-4 rounded animate-shimmer w-5/6"></div>
                <div className="h-4 rounded animate-shimmer w-3/4"></div>
              </div>
            ) : (
              currentDescription
            )}
          </div>
          
          <button
            onClick={handleGenerateDescription}
            disabled={isLoading}
            className="text-xs text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 font-semibold mt-2 disabled:opacity-50 disabled:cursor-wait flex items-center"
          >
            <span className="mr-1">✨</span>
            {isLoading ? 'Generating...' : 'Generate with AI'}
          </button>

          <InstallmentPlan totalPrice={product.price} />

          <div className="mt-4 space-y-2">
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-slate-800 text-white py-2 rounded-lg font-semibold hover:bg-slate-900 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-slate-900 transition-colors transform active:scale-95 duration-150"
            >
              Add to Cart
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setIsQuickViewOpen(true)}
                className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors transform active:scale-95 duration-150 flex items-center justify-center space-x-2"
              >
                <EyeIcon className="h-5 w-5" />
                <span>Quick View</span>
              </button>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors transform active:scale-95 duration-150 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 0 5.367-2.684 3 3 0 0 0-5.367 2.684Zm0 9.316a3 3 0 1 0 5.367 2.684 3 3 0 0 0-5.367-2.684Z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isShareModalOpen && (
        <ShareModal 
          product={product} 
          onClose={() => setIsShareModalOpen(false)} 
        />
      )}
      {isQuickViewOpen && (
        <QuickViewModal
            product={product}
            onClose={() => setIsQuickViewOpen(false)}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
        />
      )}
    </>
  );
};

export default ProductCard;

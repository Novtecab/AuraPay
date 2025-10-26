import React from 'react';
import type { Product } from '../types';
import ImageWithLoader from './ImageWithLoader';

interface NewArrivalCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

const NewArrivalCard: React.FC<NewArrivalCardProps> = ({ product, addToCart }) => {
  return (
    <div className="w-48 md:w-56 flex-shrink-0 group">
      <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md overflow-hidden transform group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <ImageWithLoader
          containerClassName="h-40 w-full"
          src={product.image}
          alt={`Image of ${product.name}`}
        />
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate" title={product.name}>{product.name}</h3>
          <p className="text-sm font-bold text-amber-700 mt-1">${product.price.toLocaleString()}</p>
          <div className="mt-auto pt-2">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 hover:text-white dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-amber-600 dark:hover:text-slate-900 transition-colors transform active:scale-95 duration-150"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalCard;

import React, { useRef, useState, useMemo } from 'react';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ImageWithLoader from '../components/ImageWithLoader';
import NewArrivalCard from '../components/NewArrivalCard';
import Pagination from '../components/Pagination';

interface HomeViewProps {
  products: Product[];
  addToCart: (product: Product) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
}

type SortOrder = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const ITEMS_PER_PAGE = 6;

const HomeView: React.FC<HomeViewProps> = ({ products, addToCart, wishlist, toggleWishlist }) => {
  const collectionRef = useRef<HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  const handleShopNowClick = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const newArrivals = useMemo(() => products.slice(-4).reverse(), [products]);

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    const byCategory = selectedCategory === 'All'
      ? products
      : products.filter(product => product.category === selectedCategory);

    const sorted = [...byCategory].sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0; // Maintain original order if 'default'
      }
    });
    
    return sorted;
  }, [products, selectedCategory, sortOrder]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as SortOrder);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);


  return (
    <div className="min-h-full animate-fadeIn">
      {/* --- Hero Section --- */}
      <div className="relative bg-slate-800 md:rounded-t-lg overflow-hidden">
        <ImageWithLoader
          containerClassName="w-full h-64"
          imageClassName="w-full h-full object-cover opacity-30"
          src="https://picsum.photos/seed/hero/1200/400"
          alt="Luxury jewelry collection"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-amber-50 animate-fadeInUp">Timeless Elegance</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl text-slate-300 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            Explore a curated collection of handcrafted luxury, where every piece tells a story of unparalleled craftsmanship.
          </p>
          <button
            onClick={handleShopNowClick}
            className="mt-8 px-8 py-3 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-500 transition-transform transform hover:scale-105 active:scale-95 duration-200 animate-fadeInUp"
            style={{ animationDelay: '400ms' }}
          >
            Shop Now
          </button>
        </div>
      </div>

      <div className="py-4 md:py-8">
        {/* --- New Arrivals Section --- */}
        <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 px-4 md:px-8 mb-4">New Arrivals</h2>
            <div className="overflow-x-auto hide-scrollbar -mx-4">
                 <div className="flex space-x-4 px-4 md:px-8">
                    {newArrivals.map((product, index) => (
                        <div key={product.id} className="opacity-0 animate-fadeInUp" style={{ animationDelay: `${500 + index * 100}ms` }}>
                            <NewArrivalCard product={product} addToCart={addToCart} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* --- Main Collection Section --- */}
        <div className="px-4 md:px-8">
            <header ref={collectionRef} className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Our Collection</h2>
                <p className="text-slate-500 dark:text-slate-400 md:text-lg">Discover your next statement piece</p>
              </div>
              <div className="relative mt-4 md:mt-0">
                  <select
                    id="sort"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="appearance-none bg-white dark:bg-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 w-full md:w-auto"
                    aria-label="Sort products"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
              </div>
            </header>

            {/* Category Filter */}
            <div className="mb-8">
                <div className="flex space-x-2 overflow-x-auto pb-3 -mx-4 px-4 hide-scrollbar">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors duration-200 transform active:scale-95 ${
                                selectedCategory === category
                                    ? 'bg-amber-600 text-white shadow'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:border-slate-600'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {paginatedProducts.map((product, index) => (
                  <div key={product.id} className="opacity-0 animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
                      <ProductCard product={product} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                  </div>
                  ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
            ) : (
            <div className="text-center py-20">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No products found.</p>
                <p className="text-slate-400 dark:text-slate-500 mt-2">Try adjusting your filters or search.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HomeView;

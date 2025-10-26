import React, { useState } from 'react';
import type { CartItem } from '../types';
import InstallmentPlan from '../components/InstallmentPlan';
import CheckoutModal from '../components/CheckoutModal';
import Toast from '../components/Toast';
import ImageWithLoader from '../components/ImageWithLoader';

interface CartViewProps {
  cart: CartItem[];
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, updateCartQuantity, clearCart }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleClearCart = () => {
    clearCart();
    setShowConfirm(false);
  };

  const handleCheckoutSuccess = () => {
    clearCart();
    setIsCheckoutOpen(false);
    setToastMessage('Payment successful! Thank you for your order.');
  }

  const renderSummary = () => (
    <>
      <div className="flex justify-between items-baseline text-lg font-semibold text-slate-800 dark:text-slate-100">
        <span>Subtotal</span>
        <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Shipping & taxes calculated at checkout.</p>
      <InstallmentPlan totalPrice={subtotal} />
      <button 
        onClick={() => setIsCheckoutOpen(true)}
        className="w-full mt-6 bg-slate-800 text-white py-3 rounded-lg font-bold text-lg hover:bg-slate-900 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-colors transform active:scale-95 duration-150"
      >
        Checkout
      </button>
    </>
  );

  return (
    <div className="p-4 md:p-8 min-h-full animate-fadeIn">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Cart</h1>
        {cart.length > 0 && (
          <button 
            onClick={() => setShowConfirm(true)}
            className="flex items-center text-sm text-red-600 hover:text-red-800 font-semibold"
            aria-label="Clear all items from cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        )}
      </header>
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">Your cart is empty.</p>
        </div>
      ) : (
        <div className="md:grid md:grid-cols-3 md:gap-12">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={item.id} className="flex items-start bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 opacity-0 animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <ImageWithLoader
                  containerClassName="w-20 h-20 rounded-md mr-4 flex-shrink-0"
                  imageClassName="w-full h-full object-cover rounded-md"
                  src={item.image}
                  alt={item.name}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">${item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors transform active:scale-90 duration-150">-</button>
                  <span className="w-10 text-center font-medium dark:text-slate-300">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors transform active:scale-90 duration-150">+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            {/* Mobile Summary */}
            <div className="md:hidden mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              {renderSummary()}
            </div>
            {/* Desktop Summary */}
            <div className="hidden md:block p-6 border border-slate-200 dark:border-slate-700 rounded-lg sticky top-28 bg-white dark:bg-slate-800/50">
               <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Order Summary</h2>
               {renderSummary()}
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-80 m-4 animate-scaleIn">
            <h2 id="confirm-dialog-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Confirm Clear Cart</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to remove all items from your cart?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearCart}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onCheckoutSuccess={handleCheckoutSuccess}
        cart={cart}
        updateCartQuantity={updateCartQuantity}
      />
    </div>
  );
};

export default CartView;
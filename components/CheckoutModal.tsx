import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { CartItem } from '../types';
import ImageWithLoader from './ImageWithLoader';
import { StripeIcon, GooglePayIcon, ApplePayIcon, CryptoIcon, InstallmentIcon, SwishIcon } from './icons/PaymentIcons';
import { QrCodeIcon, ClipboardIcon, UploadIcon, TrashIcon, RefreshIcon } from './icons/UtilityIcons';


interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess: () => void;
  cart: CartItem[];
  updateCartQuantity: (productId: number, quantity: number) => void;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', name: 'Standard Shipping', price: 5.00, description: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 15.00, description: '2-3 business days' },
  { id: 'next-day', name: 'Next-Day Air', price: 25.00, description: 'Next business day' },
];

const MOCK_INITIAL_ETH_PRICE = 3000; // 1 ETH = $3000 USD for simulation

type Step = 'info' | 'shipping' | 'summary' | 'payment';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onCheckoutSuccess, cart, updateCartQuantity }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [errors, setErrors] = useState<{ name?: string; email?: string; address?: string }>({});
  const [paymentMethod, setPaymentMethod] = useState<'select' | 'crypto' | 'swish'>('select');
  const [addressCopied, setAddressCopied] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [ethPrice, setEthPrice] = useState(MOCK_INITIAL_ETH_PRICE);
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MOCK_WALLET_ADDRESS = '0x1A2b3c4D5e6F7g8H9i0JkL1m2N3o4P5q6R7s8T9u';
  const MOCK_SWISH_NUMBER = '123-456 78 90';
  
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const finalTotal = useMemo(() => subtotal + selectedShipping.price, [subtotal, selectedShipping]);
  const cryptoAmount = useMemo(() => (finalTotal / ethPrice).toFixed(6), [finalTotal, ethPrice]);
  const installmentAmount = useMemo(() => (finalTotal / 4).toFixed(2), [finalTotal]);
  const canProceed = useMemo(() => cart.length > 0, [cart]);


  const resetState = () => {
    setIsProcessing(false);
    setCurrentStep('info');
    setPaymentMethod('select');
    setPaymentProof(null);
    setForm({ name: '', email: '', address: '' });
    setSelectedShipping(SHIPPING_OPTIONS[0]);
    setEthPrice(MOCK_INITIAL_ETH_PRICE);
    setErrors({});
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
       document.body.style.overflow = 'auto';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleClose = () => {
    resetState();
    onClose();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
     if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateInfo = () => {
    const newErrors: { name?: string, email?: string, address?: string } = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim()) {
        newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Email is invalid.";
    }
    if (!form.address.trim()) newErrors.address = "Shipping address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 'info' && !validateInfo()) return;
    
    const steps: Step[] = ['info', 'shipping', 'summary', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['info', 'shipping', 'summary', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };
  
  const simulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
        resetState();
        onCheckoutSuccess();
    }, 2500);
  };
  
  const handleCopyAddress = () => {
    const addressToCopy = paymentMethod === 'crypto' ? MOCK_WALLET_ADDRESS : MOCK_SWISH_NUMBER;
    navigator.clipboard.writeText(addressToCopy).then(() => {
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    });
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };
  
  const handleRefreshEthPrice = () => {
    setIsRefreshingPrice(true);
    setTimeout(() => {
      const newPrice = MOCK_INITIAL_ETH_PRICE + (Math.random() * 200 - 100);
      setEthPrice(newPrice);
      setIsRefreshingPrice(false);
    }, 1000);
  };

  if (!isOpen) return null;
  
  const renderStepper = () => {
    const steps: { id: Step, name: string }[] = [
        { id: 'info', name: 'Details' },
        { id: 'shipping', name: 'Shipping' },
        { id: 'summary', name: 'Review' },
        { id: 'payment', name: 'Payment' },
    ];
    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                        {stepIdx < currentStepIndex ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-amber-600" />
                                </div>
                                <button
                                    onClick={() => setCurrentStep(step.id)}
                                    className="relative w-8 h-8 flex items-center justify-center bg-amber-600 rounded-full hover:bg-amber-700"
                                >
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                    </svg>
                                    <span className="sr-only">{step.name} - Completed</span>
                                </button>
                            </>
                        ) : stepIdx === currentStepIndex ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700" />
                                </div>
                                <div className="relative w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-amber-600 rounded-full" aria-current="step">
                                    <span className="h-2.5 w-2.5 bg-amber-600 rounded-full" aria-hidden="true" />
                                    <span className="sr-only">{step.name} - Current</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700" />
                                </div>
                                <div className="group relative w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full">
                                    <span className="sr-only">{step.name} - Upcoming</span>
                                </div>
                            </>
                        )}
                        <span className="absolute -bottom-6 text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{step.name}</span>
                    </li>
                ))}
            </ol>
        </nav>
    );
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
        case 'info':
            return (
                 <section className="mt-8 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Guest Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                            <input type="text" name="name" id="name" value={form.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-800 dark:text-slate-200 ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}/>
                             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                            <input type="email" name="email" id="email" value={form.email} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-800 dark:text-slate-200 ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}/>
                             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Shipping Address</label>
                            <textarea name="address" id="address" value={form.address} onChange={handleInputChange} rows={3} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-800 dark:text-slate-200 ${errors.address ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}></textarea>
                             {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                    </div>
                </section>
            );
        case 'shipping':
             return (
                <fieldset className="mt-8 animate-fadeIn">
                    <legend className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Shipping Method</legend>
                    <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((option) => (
                        <div key={option.id} className="relative">
                        <input
                            type="radio"
                            id={`shipping-${option.id}`}
                            name="shipping-option"
                            value={option.id}
                            checked={selectedShipping.id === option.id}
                            onChange={() => setSelectedShipping(option)}
                            className="peer sr-only"
                        />
                        <label
                            htmlFor={`shipping-${option.id}`}
                            className="block w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center cursor-pointer bg-white border-slate-300 hover:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600 peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:shadow-sm dark:peer-checked:bg-amber-900/20 dark:peer-checked:border-amber-500"
                        >
                            <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 peer-checked:text-amber-800 dark:peer-checked:text-amber-300">{option.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 peer-checked:text-amber-600 dark:peer-checked:text-amber-400">{option.description}</p>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 peer-checked:text-amber-800 dark:peer-checked:text-amber-300">
                            ${option.price.toFixed(2)}
                            </span>
                        </label>
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 text-amber-600 opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none" aria-hidden="true">
                            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        </div>
                    ))}
                    </div>
                </fieldset>
             );
        case 'summary':
            return (
                 <section className="mt-8 animate-fadeIn bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Order Summary</h3>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 mb-4">
                      {cart.length > 0 ? (
                        cart.map(item => (
                          <div key={item.id} className="flex items-center">
                            <ImageWithLoader
                              containerClassName="w-16 h-16 rounded-md mr-4 flex-shrink-0"
                              imageClassName="w-full h-full object-cover rounded-md"
                              src={item.image}
                              alt={item.name}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">${item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
                              <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-slate-200 rounded-full text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors transform active:scale-90 duration-150 flex items-center justify-center">-</button>
                              <span className="w-8 text-center font-medium text-sm dark:text-slate-300">{item.quantity}</span>
                              <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-slate-200 rounded-full text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors transform active:scale-90 duration-150 flex items-center justify-center">+</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 text-sm py-4">Your cart is empty.</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-slate-600 dark:text-slate-300">
                            <span>Shipping</span>
                            <span>${selectedShipping.price.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between font-bold text-slate-800 dark:text-slate-100 text-base pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                            <span>Total</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        or 4 interest-free payments of
                      </p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                        ${installmentAmount}
                      </p>
                    </div>
                </section>
            );
        case 'payment':
            if (paymentMethod === 'select') {
                return (
                     <section className="mt-8 animate-fadeIn">
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Payment Method</h3>
                        <div className="space-y-3">
                            <button disabled={isProcessing || !canProceed} onClick={simulatePayment} className="w-full flex items-center justify-center bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-900 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
                                <StripeIcon className="w-6 h-6 mr-3" /> Pay with Card
                            </button>
                            <button disabled={isProcessing || !canProceed} onClick={simulatePayment} className="w-full flex items-center justify-center bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                                  <GooglePayIcon className="h-6 mr-3" /> Pay with Google Pay
                            </button>
                            <button disabled={isProcessing || !canProceed} onClick={simulatePayment} className="w-full flex items-center justify-center bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                                  <ApplePayIcon className="h-6 mr-3" /> Pay with Apple Pay
                            </button>
                            <button disabled={isProcessing || !canProceed} onClick={simulatePayment} className="w-full flex flex-col items-center justify-center bg-sky-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:bg-sky-400 disabled:cursor-not-allowed">
                                <div className="flex items-center">
                                    <InstallmentIcon className="w-6 h-6 mr-3" />
                                    <span>Pay in installments</span>
                                </div>
                                <span className="text-xs font-normal mt-0.5">4 interest-free payments of ${installmentAmount}</span>
                            </button>
                             <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            </div>
                             <button disabled={isProcessing || !canProceed} onClick={() => setPaymentMethod('crypto')} className="w-full flex items-center justify-center bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:bg-amber-400 disabled:cursor-not-allowed">
                                <CryptoIcon className="w-6 h-6 mr-3" /> Pay with Crypto
                            </button>
                            <button disabled={isProcessing || !canProceed} onClick={() => setPaymentMethod('swish')} className="w-full flex items-center justify-center bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-800 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed">
                                <SwishIcon className="w-6 h-6 mr-3" /> Pay with Swish
                            </button>
                        </div>
                    </section>
                );
            } else {
                 const isCrypto = paymentMethod === 'crypto';
                const title = isCrypto ? 'Pay with Crypto' : 'Pay with Swish';
                const amount = isCrypto ? `${cryptoAmount} ETH` : `${finalTotal.toFixed(2)} USD`;
                const subtext = isCrypto ? `($${finalTotal.toFixed(2)} USD)` : '';
                const address = isCrypto ? MOCK_WALLET_ADDRESS : MOCK_SWISH_NUMBER;
                const instructions = isCrypto
                ? 'Scan QR code or copy the address below to send your payment. Once sent, you must upload proof of the transaction.'
                : 'Open your Swish app and pay to the number below. Once sent, you must upload proof of the transaction.';

                return (
                 <section className="mt-8 animate-fadeIn">
                     <div className="flex items-center mb-4">
                        <button onClick={() => setPaymentMethod('select')} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-300">{instructions}</p>
                         {isCrypto && (
                          <>
                            <div className="my-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 p-2 rounded-md border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                              <span>
                                Current Rate: <strong>1 ETH ≈ ${ethPrice.toFixed(2)} USD</strong>
                              </span>
                              <button onClick={handleRefreshEthPrice} disabled={isRefreshingPrice} className="flex items-center font-semibold text-amber-600 hover:text-amber-800 disabled:opacity-50 disabled:cursor-wait text-xs">
                                <RefreshIcon className={`w-3 h-3 mr-1 ${isRefreshingPrice ? 'animate-spin' : ''}`} />
                                {isRefreshingPrice ? 'Refreshing...' : 'Refresh Price'}
                              </button>
                            </div>
                            <div className="my-4 p-2 bg-white rounded-md inline-block">
                                <QrCodeIcon className="w-32 h-32 text-slate-800" />
                            </div>
                          </>
                        )}
                        <p className={`font-mono text-xl mt-4 text-slate-800 dark:text-slate-100 ${isCrypto ? '' : 'pt-4'}`}>
                            <span className="font-bold">{amount}</span>
                        </p>
                        {subtext && <p className="text-xs text-slate-500 dark:text-slate-400">{subtext}</p>}
                        
                         <div className="mt-4 flex items-center space-x-2 p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                            <input type="text" readOnly value={address} className="flex-1 text-xs bg-transparent text-slate-600 dark:text-slate-300 outline-none font-mono truncate"/>
                            <button 
                              onClick={handleCopyAddress} 
                              className={`flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-md transition-colors w-24 ${addressCopied ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500'}`}
                              aria-live="polite"
                            >
                                {addressCopied ? (
                                  'Copied!'
                                ) : (
                                  <>
                                    <ClipboardIcon className="w-4 h-4 mr-1.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                            </button>
                        </div>
                        <div className="mt-4">
                          {!paymentProof ? (
                            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center text-sm font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 py-2.5 px-4 rounded-lg transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                              <UploadIcon className="w-5 h-5 mr-2" />
                              Upload Payment Proof
                            </button>
                          ) : (
                            <div className="flex items-center justify-between text-sm text-slate-700 bg-green-100 border border-green-200 p-2.5 rounded-lg dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-200">
                              <span className="truncate" title={paymentProof.name}>{paymentProof.name}</span>
                              <button onClick={() => setPaymentProof(null)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 flex-shrink-0" aria-label="Remove payment proof">
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                          <input type="file" ref={fileInputRef} onChange={handleProofUpload} className="hidden" accept="image/*" />
                        </div>
                    </div>
                    <button disabled={isProcessing || !paymentProof || !canProceed} onClick={simulatePayment} className="w-full mt-4 flex items-center justify-center bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-900 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500">
                        {isProcessing ? <><Spinner /> Confirming...</> : 'I Have Sent The Payment'}
                    </button>
                 </section>
                );
            }
        default:
            return null;
    }
  };
  
  const renderNavigationButtons = () => {
    return (
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          {currentStep !== 'info' && (
            <button
              onClick={prevStep}
              className="px-6 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Back
            </button>
          )}
        </div>
        <div>
          {currentStep !== 'payment' && (
            <button
              onClick={nextStep}
              className="px-6 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-colors"
            >
              {currentStep === 'summary' ? 'Proceed to Payment' : `Next`}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn p-4" 
      role="dialog" 
      aria-modal="true" 
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-lg animate-scaleIn flex flex-col max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0">
            <div className="flex justify-between items-center pb-4">
              <h2 id="checkout-dialog-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100">Checkout</h2>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label="Close checkout">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-8 mt-2">{renderStepper()}</div>
        </header>
        
        <main className="flex-grow overflow-y-auto pr-2 -mr-2">
            {isProcessing ? (
              <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <Spinner />
                <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold">{paymentMethod === 'crypto' ? 'Confirming transaction...' : 'Processing payment...'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Please do not close this window.</p>
              </div>
            ) : renderStepContent()}
        </main>

        {!isProcessing && (
            <footer className="flex-shrink-0">
                {renderNavigationButtons()}
            </footer>
        )}

      </div>
    </div>
  );
};

export default CheckoutModal;
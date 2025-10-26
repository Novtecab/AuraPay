import React, { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { LinkIcon, EmailIcon, TwitterIcon, FacebookIcon } from './icons/ShareIcons';

interface ShareModalProps {
  product: Product;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ product, onClose }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const productUrl = `${window.location.origin}/product/${product.id}`;
  
  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  }, [productUrl]);

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

  const emailBody = `I thought you might like this: ${product.name}\n\n${productUrl}`;
  const tweetText = `Check out this amazing ${product.name}!`;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="share-dialog-title"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-sm m-4 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="share-dialog-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">Share "{product.name}"</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label="Close share dialog">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 border border-slate-200 dark:border-slate-600 rounded-lg">
                <LinkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <input type="text" readOnly value={productUrl} className="flex-1 text-sm bg-transparent text-slate-600 dark:text-slate-300 outline-none"/>
                <button 
                    onClick={handleCopyLink} 
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${linkCopied ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'}`}
                >
                    {linkCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
                 <a href={`mailto:?subject=Check out this ${product.name}&body=${encodeURIComponent(emailBody)}`} className="flex flex-col items-center p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <EmailIcon className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs mt-1 font-medium text-slate-700 dark:text-slate-400">Email</span>
                 </a>
                 <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(tweetText)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <TwitterIcon className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs mt-1 font-medium text-slate-700 dark:text-slate-400">Twitter</span>
                 </a>
                 <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <FacebookIcon className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs mt-1 font-medium text-slate-700 dark:text-slate-400">Facebook</span>
                 </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
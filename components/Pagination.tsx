
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const goToPrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const goToNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-8 md:mt-12">
      <button
        onClick={goToPrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg font-semibold text-sm bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:border-slate-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
        aria-label="Go to previous page"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300" aria-label={`Page ${currentPage} of ${totalPages}`}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg font-semibold text-sm bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:border-slate-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
        aria-label="Go to next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
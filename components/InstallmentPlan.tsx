
import React from 'react';

interface InstallmentPlanProps {
  totalPrice: number;
  installments?: number;
}

const InstallmentPlan: React.FC<InstallmentPlanProps> = ({ totalPrice, installments = 4 }) => {
  const installmentPrice = (totalPrice / installments).toFixed(2);

  return (
    <div className="text-center bg-amber-50 border border-amber-200 rounded-lg py-2 px-3 mt-2 dark:bg-amber-900/20 dark:border-amber-800/30">
      <p className="text-sm text-slate-700 dark:text-slate-300">
        or {installments} interest-free payments of{' '}
        <span className="font-bold text-slate-800 dark:text-slate-100">${installmentPrice}</span>
      </p>
    </div>
  );
};

export default InstallmentPlan;
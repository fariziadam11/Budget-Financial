import React from 'react';
import { motion } from 'framer-motion';
import { CoinsIcon, RefreshCwIcon } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface CurrencyToggleProps {
  className?: string;
  compact?: boolean;
}

/**
 * A toggle button to switch between USD and IDR currencies
 */
const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ 
  className = '',
  compact = false
}) => {
  const { 
    displayCurrency, 
    setDisplayCurrency,
    isLoading
  } = useCurrency();

  // Toggle between USD and IDR
  const toggleCurrency = () => {
    setDisplayCurrency(displayCurrency === 'USD' ? 'IDR' : 'USD');
  };

  return (
    <motion.button
      onClick={toggleCurrency}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 px-3 py-2 
        bg-yellow-400 dark:bg-yellow-500 
        hover:bg-yellow-500 dark:hover:bg-yellow-600 
        text-gray-900 rounded-lg transition-all duration-300
        border-2 border-gray-800 dark:border-gray-200
        focus:outline-none focus:ring-2 focus:ring-yellow-400 
        dark:focus:ring-yellow-500 focus:ring-opacity-50
        disabled:opacity-50 shadow-md
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${displayCurrency === 'USD' ? 'IDR' : 'USD'}`}
    >
      {isLoading ? (
        <RefreshCwIcon size={16} className="animate-spin" />
      ) : (
        <CoinsIcon size={16} />
      )}
      
      {!compact && (
        <>
          <span className="font-medium">
            {displayCurrency === 'USD' ? 'USD' : 'IDR'}
          </span>
          <span className="text-xs bg-yellow-500 dark:bg-yellow-600 px-1.5 py-0.5 rounded">
            {displayCurrency === 'USD' ? 'IDR' : 'USD'}
          </span>
        </>
      )}
    </motion.button>
  );
};

export default CurrencyToggle;

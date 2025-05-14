import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CoinsIcon } from 'lucide-react';

interface CurrencySelectorProps {
  compact?: boolean;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  compact = false,
  className = ''
}) => {
  const { 
    displayCurrency, 
    setDisplayCurrency, 
    availableCurrencies,
    isLoading
  } = useCurrency();

  // Helper function to get currency names
  const getCurrencyName = (code: string): string => {
    const names: Record<string, string> = {
      IDR: 'Indonesian Rupiah',
      USD: 'US Dollar',
      EUR: 'Euro',
      JPY: 'Japanese Yen',
      GBP: 'British Pound',
      AUD: 'Australian Dollar',
      SGD: 'Singapore Dollar',
      CNY: 'Chinese Yuan',
      MYR: 'Malaysian Ringgit',
      THB: 'Thai Baht',
      KRW: 'South Korean Won'
    };
    
    return names[code] || code;
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {!compact && (
        <label htmlFor="currency-selector" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Display Currency:
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          <CoinsIcon size={16} className="text-yellow-500" />
        </div>
        <select
          id="currency-selector"
          value={displayCurrency}
          onChange={(e) => setDisplayCurrency(e.target.value)}
          disabled={isLoading}
          className={`
            pl-8 pr-8 py-1 border border-gray-300 dark:border-gray-600 rounded 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent
            text-sm appearance-none cursor-pointer disabled:opacity-70
            ${compact ? 'w-20' : 'w-40'}
          `}
        >
          {availableCurrencies.map(currency => (
            <option key={currency} value={currency}>
              {compact ? currency : `${currency} - ${getCurrencyName(currency)}`}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;

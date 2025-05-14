import React, { useState, useEffect, useCallback } from 'react';
import { 
  toIdr, 
  fromIdr, 
  formatIdr, 
  formatCurrency, 
  fetchExchangeRates, 
  getAvailableCurrencies 
} from '../utils/currencyConverter';
import { 
  formatCurrencyInput, 
  parseCurrencyInput, 
  handleCurrencyInputChange 
} from '../utils/currencyInputFormatter';
import { motion } from 'framer-motion';
import { ArrowDownIcon, ArrowUpIcon, RefreshCwIcon, LoaderIcon } from 'lucide-react';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [formattedAmount, setFormattedAmount] = useState<string>('1.00');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('IDR');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<string[]>(['IDR', 'USD', 'EUR', 'JPY', 'SGD', 'AUD', 'GBP']);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Fetch exchange rates on component mount
  useEffect(() => {
    updateRates();
    
    // Refresh rates every hour
    const interval = setInterval(updateRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const updateRates = async () => {
    setIsLoading(true);
    try {
      await fetchExchangeRates();
      setCurrencies(getAvailableCurrencies());
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to update rates:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format the amount input when currency changes
  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setFormattedAmount(formatCurrencyInput(numAmount, fromCurrency));
      }
    }
  }, [amount, fromCurrency]);

  // Handle amount input change with proper formatting
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === '') {
      setAmount('');
      setFormattedAmount('');
      return;
    }
    
    // Format the input based on the selected currency
    handleCurrencyInputChange(inputValue, fromCurrency, (formattedValue) => {
      setFormattedAmount(formattedValue);
      // Store the actual numeric value for calculations
      setAmount(parseCurrencyInput(formattedValue, fromCurrency).toString());
    });
  }, [fromCurrency]);

  // Convert currency whenever inputs change
  useEffect(() => {
    if (!amount || isNaN(Number(amount))) {
      setResult('');
      return;
    }
    
    const numAmount = parseFloat(amount);
    
    if (fromCurrency === toCurrency) {
      // Same currency, just format
      setResult(formatCurrency(numAmount, fromCurrency));
      return;
    }
    
    if (toCurrency === 'IDR') {
      // Convert from foreign currency to IDR
      const convertedAmount = toIdr(numAmount, fromCurrency);
      setResult(formatIdr(convertedAmount));
    } else if (fromCurrency === 'IDR') {
      // Convert from IDR to foreign currency
      const convertedAmount = fromIdr(numAmount, toCurrency);
      setResult(formatCurrency(convertedAmount, toCurrency));
    } else {
      // Convert from foreign currency to IDR first, then to another foreign currency
      const idrAmount = toIdr(numAmount, fromCurrency);
      const convertedAmount = fromIdr(idrAmount, toCurrency);
      setResult(formatCurrency(convertedAmount, toCurrency));
    }
  }, [amount, fromCurrency, toCurrency]);

  // Swap currencies
  const handleSwapCurrencies = useCallback(() => {
    // Save the current amount value before swapping
    const currentAmount = amount;
    
    // Swap the currencies
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    
    // If we have a result, use it as the new input amount
    if (result) {
      try {
        // Extract the numeric value from the result
        const resultNumeric = parseCurrencyInput(
          result.replace(/[^\d,.]/g, ''), // Remove currency symbols
          toCurrency
        );
        
        // Update the amount with the result value
        setAmount(resultNumeric.toString());
        
        // Format the amount according to the new fromCurrency (which was toCurrency)
        setFormattedAmount(formatCurrencyInput(resultNumeric, toCurrency));
      } catch (error) {
        // If parsing fails, keep the current amount
        setAmount(currentAmount);
        setFormattedAmount(formatCurrencyInput(parseFloat(currentAmount), toCurrency));
      }
    }
  }, [amount, fromCurrency, toCurrency, result]);

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-yellow-400 dark:border-yellow-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-gray-100">Currency Converter</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            id="amount"
            type="text"
            value={formattedAmount}
            onChange={handleAmountChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent"
            placeholder={`Enter amount in ${fromCurrency}`}
            inputMode="decimal"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From
            </label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency} ({getCurrencyName(currency)})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={handleSwapCurrencies}
              className="p-2 bg-yellow-400 dark:bg-yellow-500 rounded-full hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:ring-opacity-50"
              aria-label="Swap currencies"
            >
              {toCurrency === 'IDR' ? <ArrowDownIcon size={16} /> : <ArrowUpIcon size={16} />}
            </button>
          </div>
          
          <div className="flex-1">
            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To
            </label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency} ({getCurrencyName(currency)})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Result:</span>
            <button
              onClick={updateRates}
              className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-500 flex items-center gap-1"
              aria-label="Refresh rates"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderIcon size={14} className="animate-spin" />
              ) : (
                <RefreshCwIcon size={14} />
              )}
            </button>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {result || '—'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
            <span>
              {fromCurrency !== toCurrency && fromCurrency && toCurrency ? (
                <>Exchange rate: 1 {fromCurrency} ≈ {formatExchangeRate(fromCurrency, toCurrency)} {toCurrency}</>
              ) : (
                'Select different currencies to see exchange rate'
              )}
            </span>
            {lastUpdated && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Updated: {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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

// Format the exchange rate for display
const formatExchangeRate = (from: string, to: string): string => {
  if (from === to) return '1';
  
  if (to === 'IDR') {
    // Direct conversion to IDR
    const rate = toIdr(1, from);
    return formatIdr(rate).replace('Rp', '').trim();
  } else if (from === 'IDR') {
    // Direct conversion from IDR
    const rate = fromIdr(1, to);
    return rate.toLocaleString(undefined, { maximumFractionDigits: 4 });
  } else {
    // Cross-currency conversion
    const idrAmount = toIdr(1, from);
    const targetAmount = fromIdr(idrAmount, to);
    return targetAmount.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
};

export default CurrencyConverter;

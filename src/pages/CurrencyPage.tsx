import React, { useState, useEffect } from 'react';
import CurrencyConverter from '../components/CurrencyConverter';
import { motion } from 'framer-motion';
import { fetchExchangeRates } from '../utils/currencyConverter';
import { GlobeIcon, RefreshCwIcon, LoaderIcon } from 'lucide-react';

const CurrencyPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Update exchange rates when the page loads
  useEffect(() => {
    updateRates();
  }, []);

  const updateRates = async () => {
    setIsLoading(true);
    try {
      await fetchExchangeRates();
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to update rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Currency Conversion</h1>
        <button 
          onClick={updateRates}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-900 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoaderIcon size={16} className="animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <RefreshCwIcon size={16} />
              <span>Update Rates</span>
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CurrencyConverter />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-yellow-400 dark:border-yellow-500">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <GlobeIcon size={20} className="text-yellow-500" />
            <span>About Currency Conversion</span>
          </h2>
          <div className="prose dark:prose-invert">
            <p>
              This tool allows you to convert between IDR (Indonesian Rupiah) and various other currencies using real-time exchange rates.
            </p>
            <p className="mt-2">
              Exchange rates are fetched from a public API and updated regularly. The last update was at <span className="font-medium">{lastUpdated || 'loading...'}</span>.
            </p>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Tips</h3>
              <ul className="mt-2 text-sm list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Use the swap button to quickly switch between currencies</li>
                <li>Results update automatically as you type</li>
                <li>Click the refresh button to get the latest exchange rates</li>
                <li>IDR (Indonesian Rupiah) is the base currency for all conversions</li>
              </ul>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Supported Currencies</h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                The converter supports many major currencies including USD (US Dollar), EUR (Euro), JPY (Japanese Yen), 
                GBP (British Pound), AUD (Australian Dollar), SGD (Singapore Dollar), and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrencyPage;

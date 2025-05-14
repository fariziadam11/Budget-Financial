import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchExchangeRates, 
  toIdr, 
  fromIdr, 
  formatIdr, 
  formatCurrency, 
  getAvailableCurrencies 
} from '../utils/currencyConverter';

interface CurrencyContextType {
  // Base currency is always IDR
  baseCurrency: 'IDR';
  
  // Current display currency (what the user wants to see)
  displayCurrency: string;
  setDisplayCurrency: (currency: string) => void;
  
  // Available currencies
  availableCurrencies: string[];
  
  // Conversion functions
  convertToDisplay: (idrAmount: number) => number;
  convertToIdr: (displayAmount: number) => number;
  
  // Formatting functions
  formatDisplay: (displayAmount: number) => string;
  formatIdr: (idrAmount: number) => string;
  
  // Exchange rate info
  lastUpdated: Date | null;
  isLoading: boolean;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  // Default display currency is IDR, but user can change it
  const [displayCurrency, setDisplayCurrency] = useState<string>('IDR');
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(['IDR']);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Try to load preferred currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('displayCurrency');
    if (savedCurrency) {
      setDisplayCurrency(savedCurrency);
    }
  }, []);
  
  // Save preferred currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('displayCurrency', displayCurrency);
  }, [displayCurrency]);
  
  // Fetch exchange rates on mount
  useEffect(() => {
    refreshRates();
    
    // Refresh rates every hour
    const interval = setInterval(refreshRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const refreshRates = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await fetchExchangeRates();
      setAvailableCurrencies(getAvailableCurrencies());
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to update rates:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Convert IDR amount to display currency
  const convertToDisplay = (idrAmount: number): number => {
    if (displayCurrency === 'IDR') return idrAmount;
    return fromIdr(idrAmount, displayCurrency);
  };
  
  // Convert display currency to IDR
  const convertToIdr = (displayAmount: number): number => {
    if (displayCurrency === 'IDR') return displayAmount;
    return toIdr(displayAmount, displayCurrency);
  };
  
  // Format amount in display currency
  const formatDisplay = (displayAmount: number): string => {
    return formatCurrency(displayAmount, displayCurrency);
  };
  
  const value: CurrencyContextType = {
    baseCurrency: 'IDR',
    displayCurrency,
    setDisplayCurrency,
    availableCurrencies,
    convertToDisplay,
    convertToIdr,
    formatDisplay,
    formatIdr,
    lastUpdated,
    isLoading,
    refreshRates
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;

/**
 * Currency converter utility functions
 * Provides functionality to convert between different currencies
 * Uses real-time exchange rates from ExchangeRate-API
 */

// Default fallback rates in case API is unavailable
const FALLBACK_RATES = {
  USD: 15500, // 1 USD = 15,500 IDR
  EUR: 16800, // 1 EUR = 16,800 IDR
  JPY: 100,   // 1 JPY = 100 IDR
  SGD: 11500, // 1 SGD = 11,500 IDR
  AUD: 10200, // 1 AUD = 10,200 IDR
  GBP: 19700  // 1 GBP = 19,700 IDR
};

// Store exchange rates with IDR as the base currency
type ExchangeRates = Record<string, number>;
let currentRates: ExchangeRates = { ...FALLBACK_RATES };
let lastFetchTime = 0;
let isLoading = false;

/**
 * Fetches the latest exchange rates from the API
 * Uses IDR as the base currency
 * @returns Promise that resolves when rates are updated
 */
export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  // Don't fetch more than once every 30 minutes
  const now = Date.now();
  if (now - lastFetchTime < 30 * 60 * 1000 && Object.keys(currentRates).length > 0) {
    return currentRates;
  }
  
  if (isLoading) {
    // Wait for the current fetch to complete
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!isLoading) {
          clearInterval(checkInterval);
          resolve(currentRates);
        }
      }, 100);
    });
  }
  
  isLoading = true;
  
  try {
    // Using ExchangeRate-API with your API key
    const API_KEY = '9f4a37c4033bea7052f1a68e';
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/IDR`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json();
    
    // Convert rates to have IDR as base (data.rates contains rates with IDR as base)
    // The API returns rates like USD: 0.0000645 (meaning 1 IDR = 0.0000645 USD)
    // We want to store the inverse (1 USD = 15,500 IDR)
    const rates: ExchangeRates = {};
    
    for (const [currency, rate] of Object.entries(data.rates)) {
      if (currency !== 'IDR') {
        // Store as: 1 CURRENCY = X IDR
        rates[currency] = 1 / (rate as number);
      }
    }
    
    currentRates = rates;
    lastFetchTime = now;
    
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Use fallback rates if API fails
    return FALLBACK_RATES;
  } finally {
    isLoading = false;
  }
};

/**
 * Initializes the currency converter by fetching rates
 * Call this when your app starts
 */
export const initializeCurrencyConverter = (): void => {
  fetchExchangeRates().catch(console.error);
};

/**
 * Converts an amount from a foreign currency to IDR
 * @param amount - Amount in foreign currency
 * @param fromCurrency - Source currency code (e.g., 'USD')
 * @returns Amount in IDR
 */
export const toIdr = (amount: number, fromCurrency: string): number => {
  const rate = currentRates[fromCurrency] || FALLBACK_RATES[fromCurrency as keyof typeof FALLBACK_RATES];
  if (!rate) {
    console.warn(`Exchange rate for ${fromCurrency} not found, using 1:1 rate`);
    return amount;
  }
  return amount * rate;
};

/**
 * Converts an amount from IDR to a foreign currency
 * @param idrAmount - Amount in IDR
 * @param toCurrency - Target currency code (e.g., 'USD')
 * @returns Amount in the target currency
 */
export const fromIdr = (idrAmount: number, toCurrency: string): number => {
  const rate = currentRates[toCurrency] || FALLBACK_RATES[toCurrency as keyof typeof FALLBACK_RATES];
  if (!rate) {
    console.warn(`Exchange rate for ${toCurrency} not found, using 1:1 rate`);
    return idrAmount;
  }
  return idrAmount / rate;
};

/**
 * Formats a number as IDR currency
 * @param amount - Amount to format
 * @returns Formatted IDR string
 */
export const formatIdr = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0, // IDR typically doesn't use decimal places
  }).format(amount);
};

/**
 * Formats a number in a specific currency
 * @param amount - Amount to format
 * @param currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currencyCode,
  };
  
  // Different formatting for different currencies
  switch (currencyCode) {
    case 'IDR':
      options.maximumFractionDigits = 0;
      return new Intl.NumberFormat('id-ID', options).format(amount);
    case 'JPY':
      options.maximumFractionDigits = 0;
      return new Intl.NumberFormat('ja-JP', options).format(amount);
    case 'USD':
      return new Intl.NumberFormat('en-US', options).format(amount);
    case 'EUR':
      return new Intl.NumberFormat('de-DE', options).format(amount);
    case 'GBP':
      return new Intl.NumberFormat('en-GB', options).format(amount);
    default:
      return new Intl.NumberFormat('en-US', options).format(amount);
  }
};

/**
 * Gets all available currencies
 * @returns Array of currency codes
 */
export const getAvailableCurrencies = (): string[] => {
  return ['IDR', ...Object.keys(currentRates)];
};

// Initialize rates when this module is imported
initializeCurrencyConverter();

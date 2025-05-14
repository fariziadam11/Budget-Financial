/**
 * Utility functions for formatting currency inputs
 */

/**
 * Format a number or string as a currency input string based on currency type
 * @param value - The value to format
 * @param currencyCode - The currency code (e.g., 'USD', 'IDR')
 * @returns Formatted string for display in input
 */
export const formatCurrencyInput = (value: string | number, currencyCode: string): string => {
  // Handle empty or invalid values
  if (value === '' || value === null || value === undefined) {
    return '';
  }

  // Convert to string and remove any non-numeric characters except decimal point
  let numericValue = typeof value === 'string' 
    ? value.replace(/[^\d.]/g, '') 
    : value.toString();
  
  // Handle multiple decimal points (keep only the first one)
  const parts = numericValue.split('.');
  if (parts.length > 2) {
    numericValue = parts[0] + '.' + parts.slice(1).join('');
  }

  // Parse the numeric value
  let numValue = parseFloat(numericValue);
  
  // Handle NaN
  if (isNaN(numValue)) {
    return '';
  }

  // Format based on currency
  switch (currencyCode) {
    case 'IDR':
      // For IDR: no decimal places, use . as thousands separator
      return formatIDR(numValue);
    case 'USD':
    default:
      // For USD: two decimal places, use , as thousands separator
      return formatUSD(numValue);
  }
};

/**
 * Parse a formatted currency string back to a number
 * @param formattedValue - The formatted currency string
 * @param currencyCode - The currency code
 * @returns The numeric value
 */
export const parseCurrencyInput = (formattedValue: string, currencyCode: string): number => {
  if (!formattedValue) return 0;

  let cleanValue = formattedValue;
  
  // Remove currency-specific formatting
  switch (currencyCode) {
    case 'IDR':
      // For IDR: remove all dots
      cleanValue = formattedValue.replace(/\./g, '');
      break;
    case 'USD':
    default:
      // For USD: remove all commas
      cleanValue = formattedValue.replace(/,/g, '');
      break;
  }

  // Parse the clean value
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Format a number as IDR input (no decimals, . as thousands separator)
 * @param value - The numeric value
 * @returns Formatted IDR string
 */
const formatIDR = (value: number): string => {
  // Round to whole number (IDR doesn't use decimals in practice)
  const roundedValue = Math.round(value);
  
  // Convert to string with . as thousands separator
  return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Format a number as USD input (2 decimals, , as thousands separator)
 * @param value - The numeric value
 * @returns Formatted USD string
 */
const formatUSD = (value: number): string => {
  // Format with up to 2 decimal places
  const parts = value.toFixed(2).split('.');
  
  // Add thousands separator
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Join with decimal point
  return parts.join('.');
};

/**
 * Handle input change for currency fields
 * @param value - The current input value
 * @param currencyCode - The currency code
 * @param onChange - Callback function to update state
 */
export const handleCurrencyInputChange = (
  value: string,
  currencyCode: string,
  onChange: (value: string) => void
): void => {
  // Allow empty input
  if (value === '') {
    onChange('');
    return;
  }

  // For IDR: only allow digits and dots
  if (currencyCode === 'IDR') {
    // Remove any character that is not a digit or dot
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Parse and format
    const numValue = parseCurrencyInput(cleanValue, 'IDR');
    onChange(formatCurrencyInput(numValue, 'IDR'));
  } 
  // For USD: allow digits, commas, and one decimal point
  else {
    // Remove any character that is not a digit, comma, or decimal point
    const cleanValue = value.replace(/[^\d,.]/g, '');
    
    // Parse and format
    const numValue = parseCurrencyInput(cleanValue, 'USD');
    onChange(formatCurrencyInput(numValue, 'USD'));
  }
};

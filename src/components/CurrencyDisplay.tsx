import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

interface CurrencyDisplayProps {
  amount: number;
  /**
   * If true, the amount is already in IDR (base currency)
   * If false, the amount is in the display currency and needs to be converted to IDR first
   */
  isBaseAmount?: boolean;
  className?: string;
  showCurrencyCode?: boolean;
  compact?: boolean;
}

/**
 * Component to display monetary values in the user's preferred currency
 * Always stores values in IDR (Indonesian Rupiah) as the base currency
 */
const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  isBaseAmount = true,
  className = '',
  showCurrencyCode = false,
  compact = false
}) => {
  const { 
    displayCurrency, 
    convertToDisplay, 
    formatDisplay 
  } = useCurrency();
  
  // If amount is already in IDR (base currency), convert to display currency
  // If amount is in display currency, keep as is
  const displayAmount = isBaseAmount 
    ? convertToDisplay(amount) 
    : amount;
  
  // Format the amount according to the display currency
  const formattedAmount = formatDisplay(displayAmount);
  
  return (
    <span className={`font-medium ${className}`} title={`${amount.toLocaleString()} IDR`}>
      {formattedAmount}
      {showCurrencyCode && !compact && ` ${displayCurrency}`}
    </span>
  );
};

export default CurrencyDisplay;

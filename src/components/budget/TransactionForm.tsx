import React, { useState, useEffect, useCallback } from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrencyInput, parseCurrencyInput, handleCurrencyInputChange } from '../../utils/currencyInputFormatter';
import { motion } from 'framer-motion';
import CurrencyToggle from '../CurrencyToggle';

const TransactionForm: React.FC = () => {
  const { addTransaction, getTransactionCategories } = useStoreContext();
  const { displayCurrency } = useCurrency();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const { income: incomeCategories, expense: expenseCategories } = getTransactionCategories();
  
  // Merge with default categories
  const defaultIncomeCategories = ['Income', 'Salary', 'Gift', 'Other'];
  const defaultExpenseCategories = ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Other'];
  
  const allIncomeCategories = [...new Set([...incomeCategories, ...defaultIncomeCategories])];
  const allExpenseCategories = [...new Set([...expenseCategories, ...defaultExpenseCategories])];
  
  const currentCategories = type === 'income' ? allIncomeCategories : allExpenseCategories;

  // Format amount when currency changes
  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setFormattedAmount(formatCurrencyInput(numAmount, displayCurrency));
      }
    }
  }, [amount, displayCurrency]);

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
    handleCurrencyInputChange(inputValue, displayCurrency, (formattedValue) => {
      setFormattedAmount(formattedValue);
      // Store the actual numeric value for calculations
      setAmount(parseCurrencyInput(formattedValue, displayCurrency).toString());
    });
  }, [displayCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || !category) return;
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) return;
    
    addTransaction({
      description: description.trim(),
      amount: amountValue,
      category,
      type,
      date: new Date(date).toISOString(),
    });
    
    setDescription('');
    setAmount('');
    setFormattedAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsFormVisible(false);
  };

  return (
    <div className="mb-6">
      {!isFormVisible ? (
        <div className="flex justify-center space-x-3">
          <motion.button
            onClick={() => {
              setIsFormVisible(true);
              setType('income');
              setCategory(allIncomeCategories[0]);
            }}
            className="px-4 py-2 border-4 border-black dark:border-gray-700 bg-green-400 dark:bg-green-600 hover:bg-green-500 dark:hover:bg-green-700 transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Income
          </motion.button>
          
          <motion.button
            onClick={() => {
              setIsFormVisible(true);
              setType('expense');
              setCategory(allExpenseCategories[0]);
            }}
            className="px-4 py-2 border-4 border-black dark:border-gray-700 bg-red-400 dark:bg-red-600 hover:bg-red-500 dark:hover:bg-red-700 transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Expense
          </motion.button>
        </div>
      ) : (
        <motion.div 
          className={`border-4 border-black dark:border-gray-700 ${
            type === 'income' ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'
          } p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold dark:text-white">
              Add {type === 'income' ? 'Income' : 'Expense'}
            </h3>
            <CurrencyToggle compact />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold dark:text-white">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={type === 'income' ? 'E.g., Salary' : 'E.g., Groceries'}
                  className="w-full p-2 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-bold dark:text-white">Amount</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formattedAmount}
                    onChange={handleAmountChange}
                    placeholder={displayCurrency === 'IDR' ? '1.000.000' : '1,000.00'}
                    className="w-full p-2 pl-8 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
                    inputMode="decimal"
                    required
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    {displayCurrency === 'IDR' ? 'Rp' : '$'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 font-bold dark:text-white">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {currentCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-bold dark:text-white">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="px-4 py-2 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className={`px-4 py-2 text-black dark:text-white border-2 border-black dark:border-gray-700 ${
                  type === 'income' 
                    ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' 
                    : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                } transition-colors duration-200`}
              >
                Add {type === 'income' ? 'Income' : 'Expense'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default TransactionForm;
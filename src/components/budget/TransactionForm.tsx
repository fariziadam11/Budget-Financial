import React, { useState } from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { motion } from 'framer-motion';

const TransactionForm: React.FC = () => {
  const { addTransaction, getTransactionCategories } = useStoreContext();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
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
            className="px-4 py-2 border-4 border-black bg-green-400 hover:bg-green-500 transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
            className="px-4 py-2 border-4 border-black bg-red-400 hover:bg-red-500 transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Expense
          </motion.button>
        </div>
      ) : (
        <motion.div 
          className={`border-4 border-black ${
            type === 'income' ? 'bg-green-100' : 'bg-red-100'
          } p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-4">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={type === 'income' ? 'E.g., Salary' : 'E.g., Groceries'}
                  className="w-full p-2 border-2 border-black focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-bold">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="w-full p-2 border-2 border-black focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-bold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border-2 border-black focus:outline-none"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {currentCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-bold">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border-2 border-black focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className={`px-4 py-2 text-white border-2 border-black ${
                  type === 'income' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
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
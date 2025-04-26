import React, { useState } from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '../../types';

interface TransactionListProps {
  showFilters?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ showFilters = true }) => {
  const { transactions, deleteTransaction, getTransactionCategories } = useStoreContext();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  
  const { income: incomeCategories, expense: expenseCategories } = getTransactionCategories();
  const allCategories = [...new Set([...incomeCategories, ...expenseCategories])];
  
  // Apply filters and sorting
  const filteredTransactions = transactions
    .filter(transaction => {
      if (typeFilter === 'all') return true;
      return transaction.type === typeFilter;
    })
    .filter(transaction => {
      if (categoryFilter === 'all') return true;
      return transaction.category === categoryFilter;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOrder === 'highest') {
        return b.amount - a.amount;
      } else { // lowest
        return a.amount - b.amount;
      }
    });

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 border-4 border-dashed border-gray-300">
        <p className="text-gray-500">No transactions yet. Add your first transaction!</p>
      </div>
    );
  }

  return (
    <div className="border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
      {showFilters && (
        <div className="p-4 border-b-4 border-black dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block mb-1 text-sm font-bold text-black dark:text-white">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="p-1 border-2 border-black dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-bold dark:text-white">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-1 border-2 border-black dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="all">All Categories</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-bold dark:text-white">Sort By</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="p-1 border-2 border-black dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="divide-y-2 divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={deleteTransaction}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 text-center text-gray-500"
            >
              No transactions match your filters
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  return (
    <motion.div 
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`p-2 mr-3 ${
            transaction.type === 'income' 
              ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
          }`}>
            {transaction.type === 'income' ? (
              <ArrowUpCircle size={20} />
            ) : (
              <ArrowDownCircle size={20} />
            )}
          </div>
          <div>
            <p className="font-medium text-black dark:text-white">{transaction.description}</p>
            <div className="flex text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="mr-2">{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
              <span className="px-1 bg-gray-200 dark:bg-gray-600">{transaction.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`font-bold mr-4 ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </span>
          
          <button
            onClick={() => onDelete(transaction.id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionList;
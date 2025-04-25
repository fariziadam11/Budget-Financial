import React from 'react';
// import { useStoreContext } from '../context/StoreContext';
import TransactionForm from '../components/budget/TransactionForm';
import TransactionList from '../components/budget/TransactionList';
import BudgetSummary from '../components/dashboard/BudgetSummary';
import { DollarSignIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Budget: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight flex items-center dark:text-white">
          <DollarSignIcon size={36} className="mr-3" />
          BUDGET
        </h1>
        <p className="text-gray-600 mt-1">Track your income and expenses</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Summary</h2>
          <div className="p-6 border-4 border-black bg-white">
            <BudgetSummary />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Add Transaction</h2>
          <TransactionForm />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Transactions</h2>
        <TransactionList />
      </motion.div>
    </div>
  );
};

export default Budget;
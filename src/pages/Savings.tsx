import React from 'react';
import { useStoreContext } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import SavingGoalForm from '../components/savings/SavingGoalForm';
import SavingGoalCard from '../components/savings/SavingGoalCard';
import { PiggyBank, TrendingUp, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import CurrencyToggle from '../components/CurrencyToggle';

const Savings: React.FC = () => {
  const { 
    savingGoals, 
    deleteSavingGoal, 
    contributeTosavingGoal 
  } = useStoreContext();
  
  const { convertToDisplay, formatDisplay } = useCurrency();

  // Calculate totals
  const totalSaved = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = savingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completionPercentage = totalTargets > 0 
  ? Math.min(100, Math.round((totalSaved / totalTargets) * 100))
  : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center dark:text-white">
              <PiggyBank size={36} className="mr-3 text-yellow-500 dark:text-yellow-400" />
              SAVINGS
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your saving goals and progress towards financial milestones
            </p>
          </div>
          <CurrencyToggle />
        </div>
      </motion.div>
      
      {/* Summary Cards */}
      {savingGoals.length > 0 && (
        <motion.div 
          className="p-6 mb-8 border-4 border-black dark:border-gray-600 bg-blue-100 dark:bg-gray-900/50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Saved Card */}
            <motion.div 
              className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center mb-2">
                <TrendingUp size={20} className="text-green-500 dark:text-green-400 mr-2" />
                <p className="text-lg font-bold text-black dark:text-white">Total Saved</p>
              </div>
              <p className="text-2xl font-black text-green-600 dark:text-green-400">
                {formatDisplay(convertToDisplay(totalSaved))}
              </p>
            </motion.div>
            
            {/* Total Goals Card */}
            <motion.div 
              className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center mb-2">
                <Target size={20} className="text-blue-500 dark:text-gray-400 mr-2" />
                <p className="text-lg font-bold text-black dark:text-white">Total Goals</p>
              </div>
              <p className="text-2xl font-black text-black dark:text-white">
                {formatDisplay(convertToDisplay(totalTargets))}
              </p>
            </motion.div>
            
            {/* Completion Card */}
            <motion.div 
              className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center mb-2">
                <Award size={20} className="text-yellow-500 dark:text-yellow-400 mr-2" />
                <p className="text-lg font-bold text-black dark:text-white">Completion</p>
              </div>
              <p className="text-2xl font-black text-black dark:text-white">
                {completionPercentage}%
              </p>
            </motion.div>
          </div>
          
          {/* Progress Bar */}
          {totalTargets > 0 && (
            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-black dark:text-white">
                  Overall Progress
                </span>
                <span className="text-sm font-medium text-black dark:text-white border-radius: 50px">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full h-4 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, type: 'spring' }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SavingGoalForm />
      </motion.div>
      
      {/* Goals List */}
      {savingGoals.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {savingGoals.map((goal) => (
            <SavingGoalCard
              key={goal.id}
              goal={goal}
              onDelete={deleteSavingGoal}
              onContribute={contributeTosavingGoal}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center p-8 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PiggyBank size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
            No Saving Goals Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Create your first saving goal to start tracking your financial progress
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Savings;
import React, { useState, useCallback } from 'react';
import { SavingGoal } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash, Plus, ArrowRight } from 'lucide-react';

interface SavingGoalCardProps {
  goal: SavingGoal;
  onDelete: (id: string) => void;
  onContribute: (id: string, amount: number) => void;
}

const SavingGoalCard: React.FC<SavingGoalCardProps> = ({ 
  goal, 
  onDelete, 
  onContribute 
}) => {
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const progressPercentage = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  );
  
  const remaining = goal.targetAmount - goal.currentAmount;
  const isComplete = goal.currentAmount >= goal.targetAmount;
  
  const deadlineDate = new Date(goal.deadline);
  const isOverdue = deadlineDate < new Date() && !isComplete;
  
  const handleContribute = useCallback(() => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    onContribute(goal.id, amount);
    setContributionAmount('');
    setIsContributing(false);
  }, [contributionAmount, goal.id, onContribute]);

  const handleDelete = useCallback(() => {
    onDelete(goal.id);
  }, [goal.id, onDelete]);

  const toggleContribute = useCallback(() => {
    setIsContributing(prev => !prev);
  }, []);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setContributionAmount(e.target.value);
    },
    []
  );

  return (
    <motion.div 
      className={`border-4 border-black dark:border-gray-700 p-5 ${
        isComplete 
          ? 'bg-green-100 dark:bg-green-900/50' 
          : isOverdue 
          ? 'bg-red-100 dark:bg-red-900/50' 
          : 'bg-blue-100 dark:bg-blue-900/50'
      } relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      aria-labelledby={`goal-${goal.id}-title`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 
          id={`goal-${goal.id}-title`}
          className="text-xl font-bold text-black dark:text-white"
        >
          {goal.name}
        </h3>
        <button
          onClick={handleDelete}
          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
          aria-label={`Delete ${goal.name} goal`}
        >
          <Trash size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-medium text-black dark:text-white">Progress</span>
            <span className="text-black dark:text-white">{progressPercentage}%</span>
          </div>
          <div 
            className="w-full h-8 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800"
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div 
              className={`h-full ${
                isComplete 
                  ? 'bg-green-500 dark:bg-green-400' 
                  : isOverdue 
                  ? 'bg-red-500 dark:bg-red-400' 
                  : 'bg-blue-500 dark:bg-blue-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Target</p>
            <p className="text-xl font-bold text-black dark:text-white">
              {goal.targetAmount.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current</p>
            <p className="text-xl font-bold text-black dark:text-white">
              {goal.currentAmount.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
        </div>
        
        {!isComplete && (
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {remaining.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
        )}
        
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deadline</p>
          <p className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white'}`}>
            {format(deadlineDate, 'MMM d, yyyy')}
            {isOverdue && ' (Overdue)'}
            {!isOverdue && !isComplete && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                ({formatDistanceToNow(deadlineDate, { addSuffix: true })})
              </span>
            )}
          </p>
        </div>
        
        {isContributing && (
          <motion.div 
            className="flex flex-col sm:flex-row gap-2 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white">$</span>
              <input
                type="number"
                value={contributionAmount}
                onChange={handleAmountChange}
                className="flex-1 w-full border-2 border-black dark:border-gray-700 p-2 pl-8 rounded-lg"
                placeholder="Amount"
                min="0.01"
                step="0.01"
                aria-label="Contribution amount"
              />
            </div>
            <motion.button
              onClick={handleContribute}
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 border-2 border-black dark:border-gray-700 rounded-lg font-medium flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
            >
              <span>Add</span>
              <ArrowRight size={16} className="ml-2" />
            </motion.button>
          </motion.div>
        )}
        
        {!isComplete && !isContributing && (
          <motion.button
            onClick={toggleContribute}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="w-full py-3 mt-4 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black transition-all duration-300 border-2 border-black dark:border-gray-700 rounded-lg font-medium shadow-md hover:shadow-lg"
            whileHover={{ 
              scale: 1.03,
              backgroundColor: isOverdue ? '#ef4444' : '#3b82f6',
              color: 'white'
            }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Add money to ${goal.name} goal`}
          >
            <motion.div 
              className="flex items-center"
              animate={{ x: isButtonHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Plus size={20} className="mr-2" />
              <span className="text-lg">Add Money</span>
            </motion.div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(SavingGoalCard);
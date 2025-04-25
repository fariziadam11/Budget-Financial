import React, { useState } from 'react';
import { SavingGoal } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash, Plus } from 'lucide-react';

interface SavingGoalCardProps {
  goal: SavingGoal;
  onDelete: (id: string) => void;
  onContribute: (id: string, amount: number) => void;
}

const SavingGoalCard: React.FC<SavingGoalCardProps> = ({ goal, onDelete, onContribute }) => {
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  
  const progressPercentage = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  );
  
  const remaining = goal.targetAmount - goal.currentAmount;
  const isComplete = goal.currentAmount >= goal.targetAmount;
  
  const deadlineDate = new Date(goal.deadline);
  const isOverdue = deadlineDate < new Date() && !isComplete;
  
  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    onContribute(goal.id, amount);
    setContributionAmount('');
    setIsContributing(false);
  };

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
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-black dark:text-white">{goal.name}</h3>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
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
          <div className="w-full h-8 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
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
            <p className="text-xl font-bold text-black dark:text-white">${goal.targetAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current</p>
            <p className="text-xl font-bold text-black dark:text-white">${goal.currentAmount.toFixed(2)}</p>
          </div>
        </div>
        
        {!isComplete && (
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">${remaining.toFixed(2)}</p>
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
        
        {!isComplete && (
          <button
            onClick={() => setIsContributing(true)}
            disabled={isComplete}
            className={`w-full py-2 mt-2 flex items-center justify-center ${
              isComplete 
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
            } transition-colors duration-200 border-2 border-black dark:border-gray-700`}
          >
            <Plus size={16} className="mr-1" />
            {isComplete ? 'Goal Completed!' : 'Add Money'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SavingGoalCard;
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

  // Color scheme based on status and theme with neobrutalist shadow
  const getStatusColors = () => {
    if (isComplete) {
      return { 
        bg: 'bg-white dark:bg-gray-900', 
        accent: 'bg-green-500', 
        text: 'text-green-600 dark:text-green-400',
        border: 'border-black dark:border-gray-700 border-2',
        shadow: 'shadow-[6px_6px_0px_0px_rgba(22,163,74,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]'
      };
    }
    if (isOverdue) {
      return { 
        bg: 'bg-white dark:bg-gray-900', 
        accent: 'bg-red-500', 
        text: 'text-red-600 dark:text-red-400',
        border: 'border-black dark:border-gray-700 border-2',
        shadow: 'shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]'
      };
    }
    return { 
      bg: 'bg-white dark:bg-gray-900', 
      accent: 'bg-blue-500', 
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-black dark:border-gray-700 border-2',
      shadow: 'shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]'
    };
  };

  const colors = getStatusColors();

  // Neobrutalist button style
  const getButtonStyle = (isOverdue: boolean) => {
    if (isOverdue) {
      return 'bg-red-600 text-white border-2 border-black dark:border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]';
    }
    return 'bg-blue-600 text-white border-2 border-black dark:border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]';
  };

  const inputStyle = 'bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-gray-700 text-gray-900 dark:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)]';

  return (
    <motion.div 
      className={`${colors.bg} p-6 rounded-none ${colors.border} ${colors.shadow}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -2, translateX: -2 }}
      transition={{ duration: 0.2 }}
      aria-labelledby={`goal-${goal.id}-title`}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 
          id={`goal-${goal.id}-title`}
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          {goal.name}
        </h3>
        <button
          onClick={handleDelete}
          className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
          aria-label={`Delete ${goal.name} goal`}
        >
          <Trash size={18} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-bold text-gray-700 dark:text-gray-300">Progress</span>
            <span className={`font-bold ${colors.text}`}>{progressPercentage}%</span>
          </div>
          <div 
            className="w-full h-3 bg-gray-200 dark:bg-gray-800 border border-black dark:border-gray-600 overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div 
              className={`h-full ${colors.accent} border-r border-black dark:border-gray-600`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Current Amount</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {goal.currentAmount.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Target</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {goal.targetAmount.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
            <p className={`font-bold ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {format(deadlineDate, 'MMM d, yyyy')}
              {!isOverdue && !isComplete && (
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  ({formatDistanceToNow(deadlineDate, { addSuffix: true })})
                </span>
              )}
            </p>
          </div>
          
          {!isComplete && (
            <div className="text-right">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Remaining</p>
              <p className="font-bold text-red-600 dark:text-red-400">
                {remaining.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </p>
            </div>
          )}
        </div>
        
        {isContributing && (
          <motion.div 
            className="flex gap-2 mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">$</span>
              <input
                type="number"
                value={contributionAmount}
                onChange={handleAmountChange}
                className={`w-full p-2 pl-8 rounded-none focus:outline-none ${inputStyle}`}
                placeholder="Amount"
                min="0.01"
                step="0.01"
                aria-label="Contribution amount"
              />
            </div>
            <button
              onClick={handleContribute}
              className="bg-blue-600 text-white px-4 py-2 rounded-none font-bold flex items-center justify-center border-2 border-black dark:border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-150 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
              disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
            >
              <span>Add</span>
              <ArrowRight size={16} className="ml-2" />
            </button>
          </motion.div>
        )}
        
        {!isComplete && !isContributing && (
          <button
            onClick={toggleContribute}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className={`w-full py-3 mt-4 flex items-center justify-center font-bold rounded-none transition-all duration-150 ${getButtonStyle(isOverdue)}`}
            aria-label={`Add money to ${goal.name} goal`}
          >
            <div className="flex items-center">
              <Plus size={18} className="mr-2" />
              <span>Add Money</span>
            </div>
          </button>
        )}

        {isComplete && (
          <div className="flex items-center justify-center space-x-2 py-3 mt-2 text-green-600 dark:text-green-400 border-2 border-black dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(22,163,74,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold">Goal Completed</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(SavingGoalCard);
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
      className={`border-4 border-black p-5 ${
        isComplete 
          ? 'bg-green-100' 
          : isOverdue 
          ? 'bg-red-100' 
          : 'bg-blue-100'
      } relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold">{goal.name}</h3>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <Trash size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-medium">Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full h-8 border-2 border-black bg-white">
            <motion.div 
              className={`h-full ${
                isComplete 
                  ? 'bg-green-500' 
                  : isOverdue 
                  ? 'bg-red-500' 
                  : 'bg-blue-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Target</p>
            <p className="text-xl font-bold">${goal.targetAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Current</p>
            <p className="text-xl font-bold">${goal.currentAmount.toFixed(2)}</p>
          </div>
        </div>
        
        {!isComplete && (
          <div>
            <p className="text-sm font-medium">Remaining</p>
            <p className="text-xl font-bold text-red-600">${remaining.toFixed(2)}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm font-medium">Deadline</p>
          <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
            {format(deadlineDate, 'MMM d, yyyy')}
            {isOverdue && ' (Overdue)'}
            {!isOverdue && !isComplete && (
              <span className="text-sm text-gray-500 ml-1">
                ({formatDistanceToNow(deadlineDate, { addSuffix: true })})
              </span>
            )}
          </p>
        </div>
        
        {!isContributing ? (
          <button
            onClick={() => setIsContributing(true)}
            disabled={isComplete}
            className={`w-full py-2 mt-2 flex items-center justify-center ${
              isComplete 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            } transition-colors duration-200 border-2 border-black`}
          >
            <Plus size={16} className="mr-1" />
            {isComplete ? 'Goal Completed!' : 'Add Money'}
          </button>
        ) : (
          <div className="mt-2 space-y-2">
            <input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="Amount"
              min="0.01"
              step="0.01"
              className="w-full p-2 border-2 border-black focus:outline-none"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setIsContributing(false)}
                className="flex-1 py-1 border-2 border-black bg-white hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleContribute}
                className="flex-1 py-1 bg-black text-white border-2 border-black hover:bg-gray-800 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SavingGoalCard;
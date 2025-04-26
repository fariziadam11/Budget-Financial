import React, { useState } from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const SavingGoalForm: React.FC = () => {
  const { addSavingGoal } = useStoreContext();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !targetAmount || !deadline) return;
    
    const targetValue = parseFloat(targetAmount);
    const currentValue = currentAmount ? parseFloat(currentAmount) : 0;
    
    if (isNaN(targetValue) || targetValue <= 0) return;
    if (isNaN(currentValue) || currentValue < 0) return;
    if (currentValue > targetValue) return;
    
    addSavingGoal({
      name: name.trim(),
      targetAmount: targetValue,
      currentAmount: currentValue,
      deadline: new Date(deadline).toISOString(),
    });
    
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setIsFormVisible(false);
  };

  return (
    <div className="mb-6">
      {!isFormVisible ? (
        <div className="flex justify-center">
          <motion.button
            onClick={() => setIsFormVisible(true)}
            className="flex items-center gap-2 px-6 py-3 border-4 border-black dark:border-gray-700 
                      bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 
                      text-black dark:text-white transition-colors duration-200 
                      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]
                      rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Create New Saving Goal
          </motion.button>
        </div>
      ) : (
        <motion.div 
          className="border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 
                    p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]
                    rounded-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-black dark:text-white">Create New Saving Goal</h3>
            <button
              onClick={() => setIsFormVisible(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Close form"
            >
              <X size={20} className="text-black dark:text-white" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-black dark:text-white">Goal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Vacation, New Laptop"
                className="w-full p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 
                          text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500
                          rounded-lg"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-black dark:text-white">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-gray-400">$</span>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className="w-full p-3 pl-8 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 
                              text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500
                              rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-black dark:text-white">Current Amount (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-gray-400">$</span>
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full p-3 pl-8 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 
                              text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500
                              rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-black dark:text-white">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 
                          text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500
                          rounded-lg"
                required
              />
            </div>
            
            <div className="flex justify-between pt-4 gap-4">
              <motion.button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="flex-1 py-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 
                          text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 
                          transition-colors duration-200 rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black 
                          border-2 border-black dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 
                          transition-colors duration-200 rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Goal
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default SavingGoalForm;

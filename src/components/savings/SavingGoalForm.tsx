import React, { useState } from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { motion } from 'framer-motion';

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
            className="px-6 py-2 border-4 border-black bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create New Saving Goal
          </motion.button>
        </div>
      ) : (
        <motion.div 
          className="border-4 border-black bg-yellow-100 p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-4">Create New Saving Goal</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-bold">Goal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Vacation, New Laptop"
                className="w-full p-2 border-2 border-black focus:outline-none"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Target Amount</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="w-full p-2 border-2 border-black focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-bold">Current Amount (Optional)</label>
                <input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border-2 border-black focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 font-bold">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border-2 border-black focus:outline-none"
                required
              />
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
                className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-gray-800 transition-colors duration-200"
              >
                Create Goal
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default SavingGoalForm;
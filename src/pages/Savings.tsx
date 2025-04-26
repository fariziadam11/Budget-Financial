import React from 'react';
import { useStoreContext } from '../context/StoreContext';
import SavingGoalForm from '../components/savings/SavingGoalForm';
import SavingGoalCard from '../components/savings/SavingGoalCard';
import { PiggyBankIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Savings: React.FC = () => {
  const { 
    savingGoals, 
    deleteSavingGoal, 
    contributeTosavingGoal 
  } = useStoreContext();

  // Calculate total saved
  const totalSaved = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = savingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight flex items-center">
          <PiggyBankIcon size={36} className="mr-3" />
          SAVINGS
        </h1>
        <p className="text-gray-600 mt-1">Track your saving goals and progress</p>
      </div>
      
      {savingGoals.length > 0 && (
        <motion.div 
          className="p-6 mb-8 border-4 border-black bg-blue-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:justify-around">
            <div className="text-center mb-4 md:mb-0">
              <p className="text-lg font-bold">Total Saved</p>
              <p className="text-3xl font-black text-green-600">${totalSaved.toFixed(2)}</p>
            </div>
            
            <div className="text-center mb-4 md:mb-0">
              <p className="text-lg font-bold">Total Goals</p>
              <p className="text-3xl font-black">${totalTargets.toFixed(2)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold">Completion</p>
              <p className="text-3xl font-black">
                {totalTargets > 0 
                  ? Math.round((totalSaved / totalTargets) * 100)
                  : 0
                }%
              </p>
            </div>
          </div>
          
          {totalTargets > 0 && (
            <div className="mt-4">
              <div className="w-full h-8 border-2 border-black bg-white">
                <motion.div 
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalSaved / totalTargets) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      <SavingGoalForm />
      
      {savingGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingGoals.map((goal) => (
            <SavingGoalCard
              key={goal.id}
              goal={goal}
              onDelete={deleteSavingGoal}
              onContribute={contributeTosavingGoal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-4 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">You don't have any saving goals yet!</p>
          <p className="text-gray-500">Create your first goal to start tracking your progress.</p>
        </div>
      )}
    </div>
  );
};

export default Savings;
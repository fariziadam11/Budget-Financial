import React from 'react';
import { useStoreContext } from '../context/StoreContext';
import {  
  CheckSquareIcon,
  DollarSignIcon,
  PiggyBankIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/dashboard/DashboardCard';
import TaskItem from '../components/tasks/TaskItem';
import BudgetSummary from '../components/dashboard/BudgetSummary';
import SavingGoalCard from '../components/savings/SavingGoalCard';

const Dashboard: React.FC = () => {
  const { 
    getTodaysTasks, 
    toggleTaskCompletion, 
    deleteTask, 
    updateTask,
    savingGoals,
    deleteSavingGoal,
    contributeTosavingGoal,
  } = useStoreContext();

  // Skeleton loader state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Animated counter
  const AnimatedCounter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = value;
      if (start === end) return;
      let increment = end / 30;
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(timer);
    }, [value]);
    return <span>{count}</span>;
  };

  // Toast feedback
  const handleTaskToggle = useCallback((taskId: string) => {
    toggleTaskCompletion(taskId);
    toast.success('Task status updated!');
  }, [toggleTaskCompletion]);

  const handleTaskDelete = useCallback((taskId: string) => {
    deleteTask(taskId);
    toast('Task deleted', { icon: '🗑️' });
  }, [deleteTask]);

  const handleTaskEdit = useCallback((task: any) => {
    updateTask(task.id, task);
    toast.success('Task updated!');
  }, [updateTask]);

  const todaysTasks = getTodaysTasks();
  const topSavingGoals = savingGoals.slice(0, 1); // Show only the first one

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2200 }} />
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-black dark:text-white">DASHBOARD</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Your daily financial and task overview</p>
      {/* Mind blowing stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-tr from-yellow-200 to-yellow-400 dark:from-yellow-800 dark:to-yellow-600 rounded-xl shadow-lg p-6 text-center">
          <span className="block text-lg font-bold text-gray-700 dark:text-yellow-100 mb-1">Tasks Today</span>
          <span className="text-4xl font-black text-yellow-700 dark:text-yellow-200">
            <AnimatedCounter value={todaysTasks.length} />
          </span>
        </div>
        <div className="bg-gradient-to-tr from-purple-200 to-purple-400 dark:from-purple-800 dark:to-purple-600 rounded-xl shadow-lg p-6 text-center">
          <span className="block text-lg font-bold text-gray-700 dark:text-purple-100 mb-1">Saving Goals</span>
          <span className="text-4xl font-black text-purple-700 dark:text-purple-200">
            <AnimatedCounter value={savingGoals.length} />
          </span>
        </div>
        <div className="bg-gradient-to-tr from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-600 rounded-xl shadow-lg p-6 text-center">
          <span className="block text-lg font-bold text-gray-700 dark:text-blue-100 mb-1">Completed Tasks</span>
          <span className="text-4xl font-black text-blue-700 dark:text-blue-200">
            <AnimatedCounter value={todaysTasks.filter(t => t.completed).length} />
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard 
          title="Today's Tasks" 
          icon={<CheckSquareIcon size={24} />}
          color={{ light: "bg-purple-100", dark: "bg-purple-900/50" }}
          delay={0}
        >
          <div className="mt-3">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
              </div>
            ) : todaysTasks.length > 0 ? (
              <div>
                {todaysTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleTaskToggle}
                    onDelete={handleTaskDelete}
                    onEdit={handleTaskEdit}
                  />
                ))}
                <Link to="/tasks">
                  <motion.button
                    className="w-full p-2 mt-4 border-2 border-gray-300 dark:border-gray-500 
                          bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                          text-gray-800 dark:text-gray-200 transition-colors duration-200
                          rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Tasks
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-3">No tasks due today!</p>
                <Link to="/tasks">
                  <motion.button
                    className="p-2 border-2 border-black dark:border-white bg-purple-200 hover:bg-purple-300 dark:bg-purple-800 dark:hover:bg-purple-700 transition-colors duration-200 dark:text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add New Task
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Budget Overview" 
          icon={<DollarSignIcon size={24} />}
          color={{ light: "bg-blue-100", dark: "bg-blue-900/50" }}
          delay={1}
        >
          <div className="mt-3">
            <BudgetSummary />
            <Link to="/budget">
              <motion.button
                className="w-full p-2 mt-4 border-2 border-gray-300 dark:border-gray-500 
                          bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                          text-gray-800 dark:text-gray-200 transition-colors duration-200
                          rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Manage Budget
              </motion.button>
            </Link>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Saving Goals" 
          icon={<PiggyBankIcon size={24} />}
          color={{ light: "bg-yellow-100", dark: "bg-yellow-800/50" }} // Less brown, more golden
          delay={2}
        >
          <div className="mt-3">
            {topSavingGoals.length > 0 ? (  
              <div>
                {topSavingGoals.map(goal => (
                  <SavingGoalCard
                    key={goal.id}
                    goal={goal}
                    onDelete={deleteSavingGoal}
                    onContribute={contributeTosavingGoal}
                  />
                ))}
                <Link to="/savings">
                  <motion.button
                    className="w-full p-2 mt-4 border-2 border-gray-300 dark:border-gray-500 
                          bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                          text-gray-800 dark:text-gray-200 transition-colors duration-200
                          rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Goals
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-3">No saving goals yet!</p>
                <Link to="/savings">
                  <motion.button
                    className="p-2 border-2 border-black dark:border-white bg-yellow-200 hover:bg-yellow-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 dark:text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create a Goal
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
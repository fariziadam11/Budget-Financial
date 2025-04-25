import React from 'react';
import { useStoreContext } from '../context/StoreContext';
import { 
  HomeIcon, 
  CheckSquareIcon,
  DollarSignIcon,
  PiggyBankIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
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
  
  const todaysTasks = getTodaysTasks();
  const topSavingGoals = savingGoals.slice(0, 1); // Show only the first one

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight">DASHBOARD</h1>
        <p className="text-gray-600 mt-1">Your daily financial and task overview</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard 
          title="Today's Tasks" 
          icon={<CheckSquareIcon size={24} />}
          color="bg-purple-100"
          delay={0}
        >
          <div className="mt-3">
            {todaysTasks.length > 0 ? (
              <div>
                {todaysTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompletion}
                    onDelete={deleteTask}
                    onEdit={updateTask}
                  />
                ))}
                <Link to="/tasks">
                  <motion.button
                    className="w-full p-2 mt-2 border-2 border-black bg-purple-200 hover:bg-purple-300 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Tasks
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-3">No tasks due today!</p>
                <Link to="/tasks">
                  <motion.button
                    className="p-2 border-2 border-black bg-purple-200 hover:bg-purple-300 transition-colors duration-200"
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
          color="bg-blue-100"
          delay={1}
        >
          <div className="mt-3">
            <BudgetSummary />
            <Link to="/budget">
              <motion.button
                className="w-full p-2 mt-4 border-2 border-black bg-blue-200 hover:bg-blue-300 transition-colors duration-200"
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
          color="bg-yellow-100"
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
                    className="w-full p-2 mt-4 border-2 border-black bg-yellow-200 hover:bg-yellow-300 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Goals
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-3">No saving goals yet!</p>
                <Link to="/savings">
                  <motion.button
                    className="p-2 border-2 border-black bg-yellow-200 hover:bg-yellow-300 transition-colors duration-200"
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
  );
};

export default Dashboard;
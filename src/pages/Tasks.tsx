import React, { useState } from 'react';
import { useStoreContext } from '../context/StoreContext';
import TaskForm from '../components/tasks/TaskForm';
import TaskItem from '../components/tasks/TaskItem';
import { CheckSquareIcon, FilterIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks: React.FC = () => {
  const { 
    tasks, 
    toggleTaskCompletion, 
    deleteTask, 
    updateTask, 
    getTaskCategories 
  } = useStoreContext();
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt'>('dueDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const categories = getTaskCategories();
  
  // Apply filters and sorting
  const filteredTasks = tasks
    .filter(task => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return !task.completed;
      return task.completed;
    })
    .filter(task => {
      if (categoryFilter === 'all') return true;
      return task.category === categoryFilter;
    })
    .filter(task => {
      if (!searchTerm.trim()) return true;
      return task.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight flex items-center dark:text-white">
          <CheckSquareIcon size={36} className="mr-3" />
          TASKS
        </h1>
        <p className="text-gray-600 mt-1">Manage your daily tasks and to-dos</p>
      </div>
      
      <TaskForm />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-1 border-2 border-black ${
              statusFilter === 'all' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-1 border-2 border-black ${
              statusFilter === 'active' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-1 border-2 border-black ${
              statusFilter === 'completed' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            Completed
          </button>
        </div>
        
        <motion.button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center px-3 py-1 border-2 border-black ${
            isFilterOpen || categoryFilter !== 'all' || searchTerm ? 'bg-yellow-400' : 'bg-white hover:bg-gray-100'
          } transition-colors duration-200`}
          whileTap={{ scale: 0.95 }}
        >
          {isFilterOpen ? <XIcon size={16} className="mr-1" /> : <FilterIcon size={16} className="mr-1" />}
          {isFilterOpen ? 'Close' : 'Filter'}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            className="bg-gray-100 p-4 mb-6 border-4 border-black"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-bold">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 border-2 border-black focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-bold">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'createdAt')}
                  className="w-full p-2 border-2 border-black focus:outline-none"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="createdAt">Creation Date</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-bold">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full p-2 border-2 border-black focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div>
        {filteredTasks.length > 0 ? (
          <AnimatePresence>
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTaskCompletion}
                onDelete={deleteTask}
                onEdit={updateTask}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center p-8 border-4 border-dashed border-gray-300">
            <p className="text-gray-500">No tasks found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
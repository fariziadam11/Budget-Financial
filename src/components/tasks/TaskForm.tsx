import React, { useState } from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const TaskForm: React.FC = () => {
  const { addTask, getTaskCategories } = useStoreContext();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categories = ['Personal', 'Work', 'Financial', 'Health', 'Shopping', ...getTaskCategories()]
    .filter((value, index, self) => self.indexOf(value) === index);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addTask({
      title: title.trim(),
      completed: false,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
    
    setTitle('');
    setCategory('Personal');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <motion.div 
      className="bg-yellow-400 dark:bg-gray-800 border-4 border-black dark:border-gray-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] mb-6 text-black dark:text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value && !isExpanded) {
                  setIsExpanded(true);
                }
              }}
              className="w-full p-3 pr-10 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none font-medium placeholder-gray-700 dark:placeholder-gray-400"
              onFocus={() => setIsExpanded(true)}
            />
            {!isExpanded && (
              <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-400" size={20} />
            )}
          </div>
          
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <label className="block mb-1 font-bold text-black dark:text-white">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block mb-1 font-bold text-black dark:text-white">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    if (!title) {
                      setTitle('');
                      setCategory('Personal');
                      setDueDate('');
                    }
                  }}
                  className="flex items-center px-4 py-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <X size={18} className="mr-1" />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="flex items-center px-4 py-2 border-2 border-black dark:border-gray-600 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} className="mr-1" />
                  Add Task
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;

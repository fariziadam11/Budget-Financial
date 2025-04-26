import React, { useState } from 'react';
import { Task } from '../../types';
import { Check, Trash, Edit, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, { light: string; dark: string }> = {
    'Personal': { light: 'bg-purple-500', dark: 'bg-purple-600' },
    'Work': { light: 'bg-blue-500', dark: 'bg-blue-600' },
    'Financial': { light: 'bg-green-500', dark: 'bg-green-600' },
    'Health': { light: 'bg-red-500', dark: 'bg-red-600' },
    'Shopping': { light: 'bg-yellow-500', dark: 'bg-yellow-600' },
  };
  
  const defaultColor = { light: 'bg-gray-500', dark: 'bg-gray-600' };
  return colors[category] || defaultColor;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedCategory, setEditedCategory] = useState(task.category);
  const [editedDueDate, setEditedDueDate] = useState(
    task.dueDate ? task.dueDate.split('T')[0] : ''
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedCategory(task.category);
    setEditedDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  };

  const handleSave = () => {
    onEdit(task.id, { 
      title: editedTitle,
      category: editedCategory,
      dueDate: editedDueDate ? new Date(editedDueDate).toISOString() : null
    });
    setIsEditing(false);
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && !task.completed;
  };

  const dueDateFormatted = task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '';
  const categoryColor = getCategoryColor(task.category);

  if (isEditing) {
    return (
      <motion.div 
        className="border-4 border-black dark:border-yellow-400 bg-white dark:bg-gray-900 p-4 mb-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border-2 border-black dark:border-yellow-400 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400"
          />
          
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="p-2 border-2 border-black dark:border-yellow-400 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Financial">Financial</option>
              <option value="Health">Health</option>
              <option value="Shopping">Shopping</option>
            </select>
            
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="p-2 border-2 border-black dark:border-yellow-400 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 border-2 border-black dark:border-yellow-400 bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-yellow-400 dark:bg-yellow-500 border-2 border-black dark:border-yellow-400 text-black dark:text-gray-900 hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`border-4 border-black dark:border-gray-600 ${
        task.completed 
          ? 'bg-gray-100 dark:bg-gray-800/50' 
          : 'bg-white dark:bg-gray-900'
      } p-4 mb-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] ${
        isOverdue() ? 'border-l-8 border-l-red-500 dark:border-l-red-600' : ''
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className={`flex-shrink-0 mt-1 w-6 h-6 border-2 border-black dark:border-gray-300 mr-3 ${
              task.completed 
                ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600' 
                : 'bg-white dark:bg-gray-800'
            } hover:border-green-500 dark:hover:border-green-500 transition-colors duration-200 flex items-center justify-center`}
            aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
          >
            {task.completed && <Check size={16} className="text-white" />}
          </button>
          <div className="flex-1">
            <p className={`font-medium text-black dark:text-gray-100 ${
              task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
            }`}>
              {task.title}
            </p>
            <div className="flex flex-wrap items-center mt-2 text-sm gap-2">
              <span className={`${categoryColor.light} dark:${categoryColor.dark} text-white text-xs px-2 py-1 rounded-full`}>
                {task.category}
              </span>
              {task.dueDate && (
                <span className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                  <Calendar size={12} className="mr-1" />
                  {dueDateFormatted}
                </span>
              )}
              {isOverdue() && (
                <span className="flex items-center text-xs text-red-500 dark:text-red-400">
                  <AlertCircle size={12} className="mr-1" />
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-2">
          <button
            onClick={handleEdit}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            aria-label="Edit task"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
            aria-label="Delete task"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
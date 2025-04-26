import React from 'react';
import { BellIcon, MenuIcon, LogOutIcon, SunIcon, MoonIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onNotificationClick: () => void;
  onMenuClick: () => void;
  notificationCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNotificationClick, 
  onMenuClick,
  notificationCount 
}) => {
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-b-4 border-yellow-500 shadow-md transition-colors duration-300">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-1 rounded-none border-2 border-gray-800 dark:border-gray-200 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors duration-200"
            aria-label="Menu"
          >
            <MenuIcon size={24} />
          </button>
          <div className="flex items-center">
            <h1 className="text-2xl font-black tracking-tight">
              BUDGET<span className="text-yellow-500 dark:text-yellow-400">BOSS</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="hidden md:block text-sm font-medium">
            Welcome, {user?.name}
          </span>
          
          <motion.button 
            onClick={toggleTheme}
            className="p-2 border-2 border-gray-800 dark:border-gray-200 rounded-none hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </motion.button>
          
          <motion.button 
            className="relative p-2 border-2 border-gray-800 dark:border-gray-200 rounded-none hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors duration-200"
            onClick={onNotificationClick}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
          >
            <BellIcon size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notificationCount}
              </span>
            )}
          </motion.button>

          <motion.button 
            className="p-2 border-2 border-gray-800 dark:border-gray-200 rounded-none hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors duration-200"
            onClick={logout}
            whileTap={{ scale: 0.95 }}
            aria-label="Log out"
          >
            <LogOutIcon size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
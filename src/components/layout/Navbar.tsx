import React from 'react';
import { BellIcon, MenuIcon, LogOutIcon, SunIcon, MoonIcon, UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useEffect } from 'react';

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

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 border-b-4 border-yellow-400 shadow-xl transition-all duration-300 rounded-b-2xl sticky top-0 z-30">
      <div className="flex justify-between items-center px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-1.5 sm:p-2 rounded-full border-2 border-yellow-400 dark:border-yellow-500 bg-white/80 dark:bg-gray-900/80 hover:bg-yellow-100 dark:hover:bg-yellow-700 transition-colors duration-200 shadow-md"
            aria-label="Menu"
          >
            <MenuIcon size={20} className="sm:size-[24px]" />
          </button>
          <motion.div
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 8 }}
            className="flex items-center"
          >
            <h1 className="text-xl sm:text-2xl font-black tracking-tight select-none">
              BUDGET<span className="text-yellow-500 dark:text-yellow-400">BOSS</span>
            </h1>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4">
          <span className="hidden lg:block text-sm font-medium">
            Welcome, {user?.name}
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-400 dark:border-yellow-500 text-white font-bold shadow-lg ring-2 ring-yellow-200 dark:ring-yellow-700">
            {user?.name ? (
              <span className="text-sm sm:text-base md:text-lg">{getInitials(user.name)}</span>
            ) : (
              <UserIcon size={18} className="sm:size-[20px] md:size-[24px]" />
            )}
          </div>
          
          <motion.button 
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 border-2 border-gray-800 dark:border-gray-200 rounded-none hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon size={16} className="sm:size-[18px] md:size-[20px]" /> : <MoonIcon size={16} className="sm:size-[18px] md:size-[20px]" />}
          </motion.button>
          
          <motion.button 
            className="relative p-1.5 sm:p-2 border-2 border-gray-800 dark:border-gray-200 rounded-none hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors duration-200"
            onClick={onNotificationClick}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
          >
            <BellIcon size={16} className="sm:size-[18px] md:size-[20px]" />
            {notificationCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 bg-gradient-to-tr from-red-500 to-yellow-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full shadow-lg text-[10px] sm:text-xs"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              >
                {notificationCount}
              </motion.span>
            )}
          </motion.button>

          <motion.button 
            className="p-1.5 sm:p-2 border-2 border-gray-800 dark:border-gray-200 rounded-none hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors duration-200"
            onClick={logout}
            whileTap={{ scale: 0.95 }}
            aria-label="Log out"
          >
            <LogOutIcon size={16} className="sm:size-[18px] md:size-[20px]" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
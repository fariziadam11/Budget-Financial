import React from 'react';
import { BellIcon, MenuIcon, LogOutIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../context/AuthContext';

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

  return (
    <header className="bg-black text-white border-b-4 border-yellow-400">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-1 rounded-none border-2 border-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            <MenuIcon size={24} />
          </button>
          <div className="flex items-center">
            <h1 className="text-2xl font-black tracking-tight">
              BUDGET<span className="text-yellow-400">BOSS</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="hidden md:block text-sm">
            Welcome, {user?.name}
          </span>
          
          <motion.button 
            className="relative p-2 border-2 border-white rounded-none hover:bg-white hover:text-black transition-colors duration-200"
            onClick={onNotificationClick}
            whileTap={{ scale: 0.95 }}
          >
            <BellIcon size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </motion.button>

          <motion.button 
            className="p-2 border-2 border-white rounded-none hover:bg-white hover:text-black transition-colors duration-200"
            onClick={logout}
            whileTap={{ scale: 0.95 }}
          >
            <LogOutIcon size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
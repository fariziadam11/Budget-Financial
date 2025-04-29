import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useStoreContext } from '../../context/StoreContext';
import NotificationPanel from '../notifications/NotificationPanel';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout: React.FC = () => {
  const { getUnreadNotificationsCount } = useStoreContext();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const unreadCount = getUnreadNotificationsCount();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-gray-50 to-yellow-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
      <Navbar 
        onNotificationClick={toggleNotifications} 
        onMenuClick={toggleMobileSidebar}
        notificationCount={unreadCount}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div 
              className="fixed inset-0 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={toggleMobileSidebar}></div>
              <motion.div 
                className="relative w-72 max-w-xs h-full bg-gradient-to-b from-yellow-100 via-yellow-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-white shadow-2xl rounded-r-3xl"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3 }}
              >
                <Sidebar onNavItemClick={() => setIsMobileSidebarOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 transition-colors duration-300 rounded-3xl shadow-xl border border-yellow-100 dark:border-yellow-900 mx-2 my-4">
          <Outlet />
        </main>
        
        {/* Notification Panel */}
        <AnimatePresence>
          {isNotificationOpen && (
            <motion.div 
              className="fixed inset-0 z-50 md:inset-auto md:top-16 md:right-4 md:bottom-auto md:left-auto md:w-96"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="absolute inset-0 bg-black bg-opacity-70 md:hidden" 
                onClick={toggleNotifications}
              ></div>
              <div className="relative h-full md:h-auto">
                <NotificationPanel onClose={toggleNotifications} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;
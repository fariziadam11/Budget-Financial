import React from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { X, Check, Bell, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const getNotificationColor = (type: string) => {
  const colors = {
    success: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-l-green-500 dark:border-l-green-400',
      icon: 'text-green-600 dark:text-green-400'
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      border: 'border-l-yellow-500 dark:border-l-yellow-400',
      icon: 'text-yellow-600 dark:text-yellow-400'
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-l-red-500 dark:border-l-red-400',
      icon: 'text-red-600 dark:text-red-400'
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-l-blue-500 dark:border-l-blue-400',
      icon: 'text-blue-600 dark:text-blue-400'
    }
  };
  
  return colors[type as keyof typeof colors] || colors.info;
};

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { 
    notifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications
  } = useStoreContext();

  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-full max-w-md max-h-[80vh] md:max-h-[600px] flex flex-col"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="p-4 border-b-4 border-black dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
        <h2 className="text-xl font-bold text-black dark:text-white flex items-center">
          <Bell className="mr-2" size={20} />
          Notifications
          {notifications.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full">
              {notifications.length}
            </span>
          )}
        </h2>
        <div className="flex space-x-2">
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="p-2 border-2 border-red-500 dark:border-red-400 hover:bg-red-500 dark:hover:bg-red-400 hover:text-white transition-colors duration-200 dark:text-red-500"
              aria-label="Clear all notifications"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-200 dark:text-white"
            aria-label="Close notifications"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900">
        {notifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center">
            <Bell size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              We'll notify you when something important happens
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const color = getNotificationColor(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 ${color.bg} ${color.border} border-l-4 ${
                  notification.read ? 'opacity-70' : ''
                } hover:shadow-sm dark:hover:shadow-md transition-all duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-medium ${notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-black dark:text-white'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format(new Date(notification.createdAt), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    {!notification.read && (
                      <button
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={`p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 ${color.icon}`}
                        aria-label="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                      aria-label="Delete notification"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default NotificationPanel;
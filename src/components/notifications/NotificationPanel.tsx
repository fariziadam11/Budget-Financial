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
    clearAllNotifications,
    markAllNotificationsAsRead
  } = useStoreContext();

  return (
    <motion.div 
      role="dialog"
      aria-modal="true"
      className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-4 border-yellow-400 dark:border-yellow-600 shadow-2xl rounded-3xl w-full max-w-md max-h-[80vh] md:max-h-[600px] flex flex-col transition-all duration-300"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="p-4 border-b-4 border-yellow-400 dark:border-yellow-600 flex justify-between items-center bg-white/90 dark:bg-gray-900/90 rounded-t-2xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
          <Bell className="mr-1" size={22} />
          Notifications
          {notifications.length > 0 && (
            <motion.span
              className="ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-600 dark:to-yellow-400 text-white text-xs rounded-full shadow animate-bounce"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
            >
              {notifications.length}
            </motion.span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.read) && notifications.length > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="p-2 rounded-full border-2 border-green-400 dark:border-green-500 bg-white/80 dark:bg-gray-900/80 hover:bg-green-500 dark:hover:bg-green-600 hover:text-white transition-colors duration-200 shadow-md"
              aria-label="Mark all as read"
            >
              <Check size={16} />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="p-2 rounded-full border-2 border-red-400 dark:border-red-500 bg-white/80 dark:bg-gray-900/80 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition-colors duration-200 shadow-md"
              aria-label="Clear all notifications"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full border-2 border-yellow-400 dark:border-yellow-500 bg-white/80 dark:bg-gray-900/80 hover:bg-yellow-400 dark:hover:bg-yellow-700 hover:text-white transition-colors duration-200 shadow-md"
            aria-label="Close notifications"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-gray-800 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
        {notifications.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <Bell size={44} className="text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              You'll see important updates here
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
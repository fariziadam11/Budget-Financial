import React from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { XIcon, CheckIcon, BellIcon, TrashIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500';
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500';
    case 'error':
      return 'bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500';
    default:
      return 'bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500';
  }
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

  if (notifications.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-none border-4 border-black dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b-4 border-black dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-black dark:text-white">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <XIcon size={20} className="text-black dark:text-white" />
          </button>
        </div>
        <div className="p-8 text-center">
          <BellIcon size={40} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-none border-4 border-black dark:border-gray-700 overflow-hidden max-h-[80vh] md:max-h-[600px] flex flex-col">
      <div className="p-4 border-b-4 border-black dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-black dark:text-white">Notifications</h2>
        <div className="flex space-x-2">
          <button
            onClick={clearAllNotifications}
            className="p-1 border-2 border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            <TrashIcon size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black hover:bg-black hover:text-white transition-colors duration-200"
          >
            <XIcon size={18} />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {notifications.map((notification) => (
          <motion.div 
            key={notification.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 ${getNotificationColor(notification.type)} ${
              notification.read ? 'opacity-60' : ''
            } hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex justify-between">
              <p className="font-medium">{notification.message}</p>
              <div className="flex space-x-2 ml-2">
                {!notification.read && (
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckIcon size={16} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XIcon size={16} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  color: string | {  // Allow both string and object
    light: string;
    dark: string;
  };
  delay?: number;
  buttonText?: string;
  onButtonClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  children, 
  color,
  delay = 0
}) => {
  const colorClasses = typeof color === 'string' 
    ? { light: color, dark: color } 
    : color;
  return (
    <motion.div 
      className={`border-4 border-black dark:border-gray-700 p-6 
      bg-white dark:bg-gray-900
      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]
      hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]
      transition-all duration-300 flex flex-col h-full
      ${colorClasses.light} dark:${colorClasses.dark}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center mb-4">
        <div className="mr-3 bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-black dark:text-white">{title}</h2>
      </div>
      
      <div className="text-gray-800 dark:text-gray-200 mb-4 flex-1">
        {children}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
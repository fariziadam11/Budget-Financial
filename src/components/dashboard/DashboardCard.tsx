import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  color: string;
  delay?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  children, 
  color,
  delay = 0
}) => {
  return (
    <motion.div 
      className={`border-4 border-black ${color} p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center mb-4">
        <div className="mr-3 bg-black text-white p-2">{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
};

export default DashboardCard;
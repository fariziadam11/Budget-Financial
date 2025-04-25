import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CheckSquareIcon, DollarSignIcon, PiggyBankIcon} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  onNavItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavItemClick }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquareIcon size={20} /> },
    { path: '/budget', label: 'Budget', icon: <DollarSignIcon size={20} /> },
    { path: '/savings', label: 'Savings', icon: <PiggyBankIcon size={20} /> },
  ];

  return (
    <aside className="w-64 h-full bg-white dark:bg-gray-900 text-black dark:text-white border-r-4 border-yellow-400">
      <nav className="py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavItemClick}
                className={({ isActive }) => 
                  `flex items-center px-6 py-3 text-lg font-medium border-l-4 ${
                    isActive 
                      ? 'border-yellow-400 bg-yellow-400 text-black' 
                      : 'border-transparent hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  } transition-colors duration-200`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
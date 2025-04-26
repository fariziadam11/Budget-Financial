import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CheckSquareIcon, DollarSignIcon, PiggyBankIcon} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext'; // Import your auth context/hook

interface SidebarProps {
  onNavItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavItemClick }) => {
  const { user } = useAuthContext(); // Get the user from your auth context
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquareIcon size={20} /> },
    { path: '/budget', label: 'Budget', icon: <DollarSignIcon size={20} /> },
    { path: '/savings', label: 'Savings', icon: <PiggyBankIcon size={20} /> },
  ];

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!user?.name) return "BB";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-r-4 border-yellow-500 shadow-lg transition-colors duration-300 flex flex-col">
      <div className="py-6 flex-1">
        {/* User profile section */}
        <div className="px-6 mb-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold">
              {getUserInitials()}
            </div>
            <div className="text-center">
              <p className="font-medium">{user?.name || "BudgetBoss User"}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path} className="px-3">
                <NavLink
                  to={item.path}
                  onClick={onNavItemClick}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-3 text-base font-medium border-l-4 ${
                      isActive 
                        ? 'border-yellow-500 bg-yellow-500 dark:bg-yellow-600 dark:border-yellow-600 text-gray-900' 
                        : 'border-transparent hover:border-gray-800 dark:hover:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
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
      </div>

      {/* Bottom section for potential additional actions */}
      <div className="px-6 pb-6">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <p className="text-xs text-center text-gray-600 dark:text-gray-400">
            BudgetBoss v2.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
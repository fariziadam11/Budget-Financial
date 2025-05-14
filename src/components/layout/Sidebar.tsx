import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CheckSquareIcon, DollarSignIcon, PiggyBankIcon, CoinsIcon} from 'lucide-react';
// // import { useAuthContext } from '../../context/AuthContext'; // Import your auth context/hook

interface SidebarProps {
  onNavItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavItemClick }) => {
  //  // const { user } = useAuthContext(); // Get the user from your auth context
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquareIcon size={20} /> },
    { path: '/budget', label: 'Budget', icon: <DollarSignIcon size={20} /> },
    { path: '/savings', label: 'Savings', icon: <PiggyBankIcon size={20} /> },
    { path: '/currency', label: 'Currency', icon: <CoinsIcon size={20} /> },
  ];

  return (
    <aside className="w-full md:w-64 h-full bg-gradient-to-b from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 border-r-4 border-yellow-400 shadow-xl transition-colors duration-300 flex flex-col rounded-tr-3xl rounded-br-3xl overflow-hidden">
      {/* Logo or Title */}
      <div className="flex items-center justify-center py-5 sm:py-6 md:py-8 mb-4 md:mb-6 select-none">
        <span className="inline-flex items-center text-xl sm:text-2xl font-extrabold tracking-tight text-yellow-500 dark:text-yellow-400">
          <PiggyBankIcon size={24} className="mr-2 sm:size-[28px] md:size-[32px]" />
          BudgetBoss
        </span>
      </div>
      <div className="flex-1">
        {/* Navigation */}
        <nav>
          <ul className="space-y-1.5 sm:space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onNavItemClick}
                  className={({ isActive }) => 
                    `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm group
                    ${isActive
                      ? 'bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 scale-105 shadow-md'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-yellow-200 dark:hover:bg-yellow-700/70 hover:text-yellow-900 dark:hover:text-yellow-100 hover:scale-105'}
                    `
                  }
                >
                  <span className="text-lg sm:text-xl transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 mt-auto">
        <div className="border-t border-yellow-200 dark:border-yellow-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
          <p className="text-xs text-center text-yellow-600 dark:text-yellow-400 font-semibold tracking-wide">
            © {new Date().getFullYear()} BudgetBoss
          </p>
          <p className="text-[10px] text-center text-gray-400 dark:text-gray-600 mt-1">
            Crafted with <span className="text-pink-500">♥</span> for your finances
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
import React from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  ChartOptions
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import CurrencyToggle from '../../components/CurrencyToggle';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement
);

const BudgetSummary: React.FC = () => {
  const { getIncome, getExpenses, getBalance, transactions } = useStoreContext();
  const { theme } = useTheme();
  const { 
    convertToDisplay, 
    formatDisplay 
  } = useCurrency();
  
  const income = getIncome();
  const expenses = getExpenses();
  const balance = getBalance();
  
  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  // Sort categories by amount (highest first)
  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Prepare chart data
  const categoryColors = [
    '#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#f43f5e', 
    '#06b6d4', '#84cc16', '#6366f1', '#ec4899', '#14b8a6'
  ];
  
  const categories = sortedCategories.map(([cat]) => cat);
  const categoryValues = sortedCategories.map(([, value]) => value);
  
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryColors.slice(0, categories.length),
        borderWidth: 1,
        borderColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
      },
    ],
  };

  // Bar chart data for income vs expenses
  const barData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [income, expenses],
        backgroundColor: ['#10b981', '#f43f5e'],
        borderWidth: 0,
      },
    ],
  };

  // Chart options with proper typing
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter',
            size: 11,
          },
          color: theme === 'dark' ? '#e5e7eb' : '#4b5563',
          boxWidth: 12,
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : 'rgba(255, 255, 255, 0.9)',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#4b5563',
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            // Convert to display currency
            const displayValue = convertToDisplay(value);
            return `${context.label}: ${formatDisplay(displayValue)}`;
          }
        }
      }
    },
    cutout: '70%',
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : 'rgba(255, 255, 255, 0.9)',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#4b5563',
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            // Convert to display currency
            const displayValue = convertToDisplay(value);
            return formatDisplay(displayValue);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Inter',
            size: 11,
          },
          callback: function(value) {
            // Convert to display currency
            const displayValue = convertToDisplay(value as number);
            return formatDisplay(displayValue).replace(/\d+\.\d+/, '');
          }
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#f3f4f6',
        },
      },
      x: {
        border: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Inter',
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
          Financial Overview
        </h3>
        <CurrencyToggle compact />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Income</p>
              <TrendingUp size={16} className="text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatDisplay(convertToDisplay(income))}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-900/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Expenses</p>
              <TrendingDown size={16} className="text-rose-500 dark:text-rose-400" />
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-xl font-semibold text-rose-600 dark:text-rose-400">
              {formatDisplay(convertToDisplay(expenses))}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Balance</p>
              <DollarSign size={16} className={balance >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'} />
            </div>
          </div>
          <div className="px-4 py-3">
            <p className={`text-xl font-semibold ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatDisplay(convertToDisplay(balance))}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expenses > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                Top Expense Categories
              </h3>
            </div>
            <div className="p-5 h-64 relative">
              <Doughnut 
                data={chartData} 
                options={chartOptions}
              />
              {categories.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                  No expense data available
                </div>
              )}
            </div>
          </div>
        )}
        
        {(income > 0 || expenses > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                Income vs Expenses
              </h3>
            </div>
            <div className="p-5 h-64 relative">
              <Bar 
                data={barData} 
                options={barChartOptions}
              />
              {income === 0 && expenses === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                  No financial data available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSummary;
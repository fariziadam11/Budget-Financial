import React from 'react';
import { useStoreContext } from '../../context/StoreContext';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext'; // Assuming you have a ThemeContext

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
  const { theme } = useTheme(); // Get the current theme
  
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
  
  // Prepare chart data
  const categoryColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F94144'
  ];
  
  const categories = Object.keys(expensesByCategory).slice(0, 5); // Limit to top 5
  const categoryValues = categories.map(cat => expensesByCategory[cat]);
  
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryColors.slice(0, categories.length),
        borderColor: theme === 'dark' ? '#374151' : '#000',
        borderWidth: 2,
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
        backgroundColor: ['#4ade80', '#f87171'],
        borderColor: theme === 'dark' ? '#374151' : '#000',
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: 'Inter',
            size: 12,
          },
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
    },
  };

  const barChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          color: theme === 'dark' ? '#374151' : '#000',
          width: 2,
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            family: 'Inter',
          },
        },
        grid: {
          color: theme === 'dark' ? '#374151' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        border: {
          color: theme === 'dark' ? '#374151' : '#000',
          width: 2,
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            family: 'Inter',
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border-4 border-black dark:border-gray-700 bg-green-100 dark:bg-green-900/50">
          <p className="text-sm font-bold mb-1 text-black dark:text-white">Income</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">${income.toFixed(2)}</p>
        </div>
        
        <div className="p-4 border-4 border-black dark:border-gray-700 bg-red-100 dark:bg-red-900/50">
          <p className="text-sm font-bold mb-1 text-black dark:text-white">Expenses</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">${expenses.toFixed(2)}</p>
        </div>
        
        <div className="p-4 border-4 border-black dark:border-gray-700 bg-blue-100 dark:bg-blue-900/50">
          <p className="text-sm font-bold mb-1 text-black dark:text-white">Balance</p>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expenses > 0 && (
          <div className="p-4 border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold mb-3 text-black dark:text-white">Top Expense Categories</h3>
            <div className="h-64">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
        
        {(income > 0 || expenses > 0) && (
          <div className="p-4 border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold mb-3 text-black dark:text-white">Income vs Expenses</h3>
            <div className="h-64">
              <Bar 
                data={barData} 
                options={barChartOptions}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSummary;
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
        borderColor: Array(categories.length).fill('#000'),
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
        borderColor: ['#000', '#000'],
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
          color: '#000',
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border-4 border-black bg-green-100">
          <p className="text-sm font-bold mb-1">Income</p>
          <p className="text-xl font-bold text-green-600">${income.toFixed(2)}</p>
        </div>
        
        <div className="p-4 border-4 border-black bg-red-100">
          <p className="text-sm font-bold mb-1">Expenses</p>
          <p className="text-xl font-bold text-red-600">${expenses.toFixed(2)}</p>
        </div>
        
        <div className="p-4 border-4 border-black bg-blue-100">
          <p className="text-sm font-bold mb-1">Balance</p>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expenses > 0 && (
          <div className="p-4 border-4 border-black bg-white">
            <h3 className="text-lg font-bold mb-3">Top Expense Categories</h3>
            <div className="h-64">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
        
        {(income > 0 || expenses > 0) && (
          <div className="p-4 border-4 border-black bg-white">
            <h3 className="text-lg font-bold mb-3">Income vs Expenses</h3>
            <div className="h-64">
              <Bar 
                data={barData} 
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      border: {
                        color: '#000',
                        width: 2,
                      },
                      ticks: {
                        font: {
                          family: 'Inter',
                        },
                      },
                    },
                    x: {
                      border: {
                        color: '#000',
                        width: 2,
                      },
                      ticks: {
                        font: {
                          family: 'Inter',
                          weight: 'bold',
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSummary;
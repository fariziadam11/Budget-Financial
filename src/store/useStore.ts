import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Transaction, SavingGoal, Notification } from '../types';
import { useAuthContext } from '../context/AuthContext';

// Load state from localStorage or use initial values
const loadFromStorage = <T>(key: string, initialState: T): T => {
  try {
    const savedState = localStorage.getItem(key);
    return savedState ? JSON.parse(savedState) : initialState;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return initialState;
  }
};

// Hook for managing global state
export const useStore = () => {
  const { user } = useAuthContext();
  const userId = user?.id || '';

  const [tasks, setTasks] = useState<Task[]>(() => 
    loadFromStorage('tasks', [])
  );
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadFromStorage('transactions', [])
  );
  
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>(() => 
    loadFromStorage('savingGoals', [])
  );
  
  const [notifications, setNotifications] = useState<Notification[]>(() => 
    loadFromStorage('notifications', [])
  );

  // Filter data by user ID
  const userTasks = tasks.filter(task => task.userId === userId);
  const userTransactions = transactions.filter(transaction => transaction.userId === userId);
  const userSavingGoals = savingGoals.filter(goal => goal.userId === userId);
  const userNotifications = notifications.filter(notification => notification.userId === userId);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('savingGoals', JSON.stringify(savingGoals));
  }, [savingGoals]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Task management functions
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      userId,
    };
    setTasks([...tasks, newTask]);
    addNotification(`New task added: ${task.title}`, 'info');
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId && task.userId === userId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => !(task.id === taskId && task.userId === userId)));
    addNotification('Task deleted successfully', 'info');
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.userId === userId) {
        const completed = !task.completed;
        const action = completed ? 'completed' : 'uncompleted';
        addNotification(`Task ${action}: ${task.title}`, 'success');
        return { ...task, completed };
      }
      return task;
    }));
  };

  // Transaction management functions
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      userId,
    };
    setTransactions([...transactions, newTransaction]);
    addNotification(
      `New ${transaction.type} added: ${transaction.description}`, 
      transaction.type === 'income' ? 'success' : 'info'
    );
  };

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === transactionId && transaction.userId === userId 
        ? { ...transaction, ...updates } 
        : transaction
    ));
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter(
      transaction => !(transaction.id === transactionId && transaction.userId === userId)
    ));
    addNotification('Transaction deleted', 'info');
  };

  // Saving goals management functions
  const addSavingGoal = (goal: Omit<SavingGoal, 'id' | 'createdAt' | 'userId'>) => {
    const newGoal: SavingGoal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      userId,
    };
    setSavingGoals([...savingGoals, newGoal]);
    addNotification(`New saving goal created: ${goal.name}`, 'success');
  };

  const updateSavingGoal = (goalId: string, updates: Partial<SavingGoal>) => {
    setSavingGoals(savingGoals.map(goal => 
      goal.id === goalId && goal.userId === userId ? { ...goal, ...updates } : goal
    ));
  };

  const deleteSavingGoal = (goalId: string) => {
    setSavingGoals(savingGoals.filter(
      goal => !(goal.id === goalId && goal.userId === userId)
    ));
    addNotification('Saving goal deleted', 'info');
  };

  const contributeTosavingGoal = (goalId: string, amount: number) => {
    setSavingGoals(savingGoals.map(goal => {
      if (goal.id === goalId && goal.userId === userId) {
        const newAmount = goal.currentAmount + amount;
        const isComplete = newAmount >= goal.targetAmount;
        
        if (isComplete) {
          addNotification(`Congratulations! You've reached your goal: ${goal.name}`, 'success');
        } else {
          addNotification(`Added ${amount} to ${goal.name}`, 'success');
        }
        
        return { 
          ...goal, 
          currentAmount: newAmount 
        };
      }
      return goal;
    }));
  };

  // Notification management functions
  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const newNotification: Notification = {
      id: uuidv4(),
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      userId,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId && notification.userId === userId 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(
      notification => !(notification.id === notificationId && notification.userId === userId)
    ));
  };

  const clearAllNotifications = () => {
    setNotifications(notifications.filter(notification => notification.userId !== userId));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification =>
      notification.userId === userId ? { ...notification, read: true } : notification
    ));
  };

  // Computed values
  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return userTasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.split('T')[0] === today;
    });
  };

  const getIncome = () => {
    return userTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getExpenses = () => {
    return userTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getIncome() - getExpenses();
  };

  const getTaskCategories = () => {
    return Array.from(new Set(userTasks.map(task => task.category)));
  };

  const getTransactionCategories = () => {
    return {
      income: Array.from(new Set(userTransactions
        .filter(t => t.type === 'income')
        .map(t => t.category))),
      expense: Array.from(new Set(userTransactions
        .filter(t => t.type === 'expense')
        .map(t => t.category)))
    };
  };

  const getUnreadNotificationsCount = () => {
    return userNotifications.filter(notification => !notification.read).length;
  };

  return {
    // State
    tasks: userTasks,
    transactions: userTransactions,
    savingGoals: userSavingGoals,
    notifications: userNotifications,
    
    // Task functions
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    
    // Transaction functions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Saving goal functions
    addSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
    contributeTosavingGoal,
    
    // Notification functions
    addNotification,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
    markAllNotificationsAsRead,
    
    // Computed values
    getTodaysTasks,
    getIncome,
    getExpenses,
    getBalance,
    getTaskCategories,
    getTransactionCategories,
    getUnreadNotificationsCount
  };
};
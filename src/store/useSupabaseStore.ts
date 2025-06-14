import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Task, Transaction, SavingGoal, Notification } from '../types';
import { Database } from '../types/database';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type SavingGoalRow = Database['public']['Tables']['saving_goals']['Row'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];

/**
 * Custom hook for managing application data with Supabase
 */
export const useSupabaseStore = (userId: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert database rows to our types
  const convertTask = (row: TaskRow): Task => ({
    id: row.id,
    title: row.title,
    completed: row.completed,
    category: row.category,
    dueDate: row.due_date,
    createdAt: row.created_at,
    userId: row.user_id
  });

  const convertTransaction = (row: TransactionRow): Transaction => ({
    id: row.id,
    amount: row.amount,
    description: row.description,
    category: row.category,
    type: row.type,
    date: row.date,
    userId: row.user_id
  });

  const convertSavingGoal = (row: SavingGoalRow): SavingGoal => ({
    id: row.id,
    name: row.name,
    targetAmount: row.target_amount,
    currentAmount: row.current_amount,
    deadline: row.deadline,
    createdAt: row.created_at,
    userId: row.user_id
  });

  const convertNotification = (row: NotificationRow): Notification => ({
    id: row.id,
    message: row.message,
    type: row.type,
    read: row.read,
    createdAt: row.created_at,
    userId: row.user_id
  });

  // Load all data when user changes
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setTransactions([]);
      setSavingGoals([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // Load all data in parallel
        const [tasksResult, transactionsResult, savingGoalsResult, notificationsResult] = await Promise.all([
          supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
          supabase.from('saving_goals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
        ]);

        if (tasksResult.error) throw tasksResult.error;
        if (transactionsResult.error) throw transactionsResult.error;
        if (savingGoalsResult.error) throw savingGoalsResult.error;
        if (notificationsResult.error) throw notificationsResult.error;

        setTasks(tasksResult.data.map(convertTask));
        setTransactions(transactionsResult.data.map(convertTransaction));
        setSavingGoals(savingGoalsResult.data.map(convertSavingGoal));
        setNotifications(notificationsResult.data.map(convertNotification));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // Task management functions
  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: task.title,
          completed: task.completed,
          category: task.category,
          due_date: task.dueDate
        })
        .select()
        .single();

      if (error) throw error;

      const newTask = convertTask(data);
      setTasks(prev => [newTask, ...prev]);
      
      // Add notification
      await addNotification(`New task added: ${task.title}`, 'info');
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }, [userId]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          completed: updates.completed,
          category: updates.category,
          due_date: updates.dueDate
        })
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = convertTask(data);
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }, [userId]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      await addNotification('Task deleted successfully', 'info');
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }, [userId]);

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    if (!userId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const completed = !task.completed;
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = convertTask(data);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      const action = completed ? 'completed' : 'uncompleted';
      await addNotification(`Task ${action}: ${task.title}`, 'success');
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }, [userId, tasks]);

  // Transaction management functions
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          type: transaction.type,
          date: transaction.date
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction = convertTransaction(data);
      setTransactions(prev => [newTransaction, ...prev]);
      
      await addNotification(
        `New ${transaction.type} added: ${transaction.description}`,
        transaction.type === 'income' ? 'success' : 'info'
      );
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }, [userId]);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', userId);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      await addNotification('Transaction deleted', 'info');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }, [userId]);

  // Saving goals management functions
  const addSavingGoal = useCallback(async (goal: Omit<SavingGoal, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('saving_goals')
        .insert({
          user_id: userId,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline
        })
        .select()
        .single();

      if (error) throw error;

      const newGoal = convertSavingGoal(data);
      setSavingGoals(prev => [newGoal, ...prev]);
      
      await addNotification(`New saving goal created: ${goal.name}`, 'success');
    } catch (error) {
      console.error('Error adding saving goal:', error);
      throw error;
    }
  }, [userId]);

  const deleteSavingGoal = useCallback(async (goalId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('saving_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', userId);

      if (error) throw error;

      setSavingGoals(prev => prev.filter(goal => goal.id !== goalId));
      await addNotification('Saving goal deleted', 'info');
    } catch (error) {
      console.error('Error deleting saving goal:', error);
      throw error;
    }
  }, [userId]);

  const contributeTosavingGoal = useCallback(async (goalId: string, amount: number) => {
    if (!userId) return;

    const goal = savingGoals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      const newAmount = goal.currentAmount + amount;
      const { data, error } = await supabase
        .from('saving_goals')
        .update({ current_amount: newAmount })
        .eq('id', goalId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      const updatedGoal = convertSavingGoal(data);
      setSavingGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      
      const isComplete = newAmount >= goal.targetAmount;
      if (isComplete) {
        await addNotification(`Congratulations! You've reached your goal: ${goal.name}`, 'success');
      } else {
        await addNotification(`Added ${amount} to ${goal.name}`, 'success');
      }
    } catch (error) {
      console.error('Error contributing to saving goal:', error);
      throw error;
    }
  }, [userId, savingGoals]);

  // Notification management functions
  const addNotification = useCallback(async (message: string, type: Notification['type'] = 'info') => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          message,
          type,
          read: false
        })
        .select()
        .single();

      if (error) throw error;

      const newNotification = convertNotification(data);
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }, [userId]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      const updatedNotification = convertNotification(data);
      setNotifications(prev => prev.map(n => n.id === notificationId ? updatedNotification : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, [userId]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }, [userId]);

  const clearAllNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  }, [userId]);

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
        .select();

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }, [userId]);

  // Computed values
  const getTodaysTasks = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.split('T')[0] === today;
    });
  }, [tasks]);

  const getIncome = useCallback(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getExpenses = useCallback(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getBalance = useCallback(() => {
    return getIncome() - getExpenses();
  }, [getIncome, getExpenses]);

  const getTaskCategories = useCallback(() => {
    return Array.from(new Set(tasks.map(task => task.category)));
  }, [tasks]);

  const getTransactionCategories = useCallback(() => {
    return {
      income: Array.from(new Set(transactions
        .filter(t => t.type === 'income')
        .map(t => t.category))),
      expense: Array.from(new Set(transactions
        .filter(t => t.type === 'expense')
        .map(t => t.category)))
    };
  }, [transactions]);

  const getUnreadNotificationsCount = useCallback(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

  return {
    // State
    tasks,
    transactions,
    savingGoals,
    notifications,
    loading,
    
    // Task functions
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    
    // Transaction functions
    addTransaction,
    deleteTransaction,
    
    // Saving goal functions
    addSavingGoal,
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
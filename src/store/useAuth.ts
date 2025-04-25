import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthState } from '../types';

const USERS_STORAGE_KEY = 'budgetboss_users';
const AUTH_STORAGE_KEY = 'budgetboss_auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return savedAuth ? JSON.parse(savedAuth) : { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const register = (email: string, password: string, name: string) => {
    const users = getUsers();
    
    if (users.some(user => user.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    setAuthState({ user: newUser, isAuthenticated: true });
    return newUser;
  };

  const login = (email: string, password: string) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    setAuthState({ user, isAuthenticated: true });
    return user;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  return {
    ...authState,
    register,
    login,
    logout,
  };
};
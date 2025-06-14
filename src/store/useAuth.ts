import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthState } from '../types';

const USERS_STORAGE_KEY = 'budgetboss_users';
const AUTH_STORAGE_KEY = 'budgetboss_auth';

/**
 * Hash a string using SHA-256. Used for password hashing.
 * @param str - The string to hash
 */
const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Custom React hook for authentication logic.
 * Provides register, login, logout, and current auth state.
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return savedAuth ? JSON.parse(savedAuth) : { user: null, isAuthenticated: false };
  });

  /**
   * Get all users from localStorage.
   */
  const getUsers = useCallback((): User[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }, []);

  // Verify authentication state on mount
  useEffect(() => {
    const verifyAuth = () => {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const { user, isAuthenticated } = JSON.parse(savedAuth);
        if (isAuthenticated && user) {
          // Verify user still exists in users list
          const users = getUsers();
          const userExists = users.some(u => u.id === user.id);
          if (!userExists) {
            setAuthState({ user: null, isAuthenticated: false });
          }
        }
      }
    };
    verifyAuth();
  }, [getUsers]);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  /**
   * Save all users to localStorage.
   */
  const saveUsers = useCallback((users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, []);

  /**
   * Register a new user.
   * @throws Error if email already exists.
   */
  const register = useCallback(async (email: string, password: string, name: string): Promise<User> => {
    const users = getUsers();
    if (users.some(user => user.email === email)) {
      throw new Error('Email already exists');
    }
    const hashedPassword = await hashString(password);
    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    setAuthState({ user: newUser, isAuthenticated: true });
    return newUser;
  }, [getUsers, saveUsers]);

  /**
   * Login a user.
   * @throws Error if credentials are invalid.
   */
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const users = getUsers();
    const hashedPassword = await hashString(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    setAuthState({ user, isAuthenticated: true });
    return user;
  }, [getUsers]);

  /**
   * Logout the current user.
   */
  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  /**
   * Memoized return value for hook consumers.
   */
  return useMemo(() => ({
    ...authState,
    /** Register a new user (async). */
    register,
    /** Login with email and password (async). */
    login,
    /** Logout the current user. */
    logout,
  }), [authState, register, login, logout]);
};
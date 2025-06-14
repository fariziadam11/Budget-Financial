import { useState, useEffect, useCallback, useMemo } from 'react';
import { User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, AuthState } from '../types';

/**
 * Custom React hook for Supabase authentication.
 * Provides register, login, logout, and current auth state.
 */
export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  // Convert Supabase user to our User type
  const convertSupabaseUser = useCallback(async (supabaseUser: SupabaseUser): Promise<User> => {
    // Get user profile from our users table
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to basic user info
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email || '',
        password: '', // Not needed for Supabase auth
        createdAt: supabaseUser.created_at
      };
    }

    return {
      id: profile.id,
      email: supabaseUser.email || '',
      name: profile.name,
      password: '', // Not needed for Supabase auth
      createdAt: profile.created_at
    };
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthState({ user: null, isAuthenticated: false });
        } else if (session?.user) {
          const user = await convertSupabaseUser(session.user);
          setAuthState({ user, isAuthenticated: true });
        } else {
          setAuthState({ user: null, isAuthenticated: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({ user: null, isAuthenticated: false });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = await convertSupabaseUser(session.user);
          setAuthState({ user, isAuthenticated: true });
        } else {
          setAuthState({ user: null, isAuthenticated: false });
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [convertSupabaseUser]);

  /**
   * Register a new user with Supabase Auth.
   */
  const register = useCallback(async (email: string, password: string, name: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Registration failed - no user returned');
      }

      // The user profile will be created automatically by the database trigger
      const user = await convertSupabaseUser(data.user);
      setAuthState({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, [convertSupabaseUser]);

  /**
   * Login with email and password.
   */
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Login failed - no user returned');
      }

      const user = await convertSupabaseUser(data.user);
      setAuthState({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [convertSupabaseUser]);

  /**
   * Logout the current user.
   */
  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  /**
   * Memoized return value for hook consumers.
   */
  return useMemo(() => ({
    ...authState,
    loading,
    register,
    login,
    logout,
  }), [authState, loading, register, login, logout]);
};
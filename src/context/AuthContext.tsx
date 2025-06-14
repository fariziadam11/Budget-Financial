import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '../store/useSupabaseAuth';

const AuthContext = createContext<ReturnType<typeof useSupabaseAuth> | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useSupabaseAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};
import React, { createContext, useContext, ReactNode } from 'react';
import { useStore } from '../store/useStore';

// Create the context
const StoreContext = createContext<ReturnType<typeof useStore> | undefined>(undefined);

// Provider component
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useStore();
  
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook for using the store context
export const useStoreContext = () => {
  const context = useContext(StoreContext);
  
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  
  return context;
};
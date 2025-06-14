import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthContext();
  const location = useLocation();

  // Check if we have a valid authentication state
  useEffect(() => {
    const savedAuth = localStorage.getItem('budgetboss_auth');
    if (savedAuth) {
      const { isAuthenticated: savedIsAuthenticated, user: savedUser } = JSON.parse(savedAuth);
      if (!savedIsAuthenticated || !savedUser) {
        // If saved state is invalid, clear it
        localStorage.removeItem('budgetboss_auth');
      }
    }
  }, []);

  if (!isAuthenticated || !user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import RequireAuth from './components/auth/RequireAuth';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Budget from './pages/Budget';
import Savings from './pages/Savings';
import CurrencyPage from './pages/CurrencyPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'budget', element: <Budget /> },
      { path: 'savings', element: <Savings /> },
      { path: 'currency', element: <CurrencyPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <StoreProvider>
            <RouterProvider router={router} />
          </StoreProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
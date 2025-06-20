import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../context/AuthContext';
import { LogInIcon, MailIcon, LockIcon, ArrowLeftIcon, AlertCircleIcon, InfoIcon } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific Supabase errors
      if (err?.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
        setShowHelp(true);
      } else if (err?.message?.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.');
      } else if (err?.message?.includes('Too many requests')) {
        setError('Too many login attempts. Please wait a moment before trying again.');
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-gray-50 to-yellow-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-700 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back to Home
        </motion.button>

        <div className="flex items-center justify-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-black tracking-tight text-black dark:text-white mb-2">
              BUDGET<span className="text-yellow-400">BOSS</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Please login to your account.</p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg flex items-start">
                <AlertCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
              
              {showHelp && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 text-blue-700 dark:text-blue-300 rounded-lg"
                >
                  <div className="flex items-start">
                    <InfoIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="font-medium">Having trouble logging in?</p>
                      <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                        <li>Double-check your email address for typos</li>
                        <li>Make sure your password is correct</li>
                        <li>If you recently registered, check your email for a confirmation link</li>
                        <li>Try resetting your password if you've forgotten it</li>
                      </ul>
                      <p className="text-sm mt-3">
                        Don't have an account yet?{' '}
                        <Link 
                          to="/register" 
                          className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                        >
                          Create one here
                        </Link>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2 text-black dark:text-white">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (showHelp) setShowHelp(false);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500 rounded-lg transition-colors duration-200"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2 text-black dark:text-white">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (showHelp) setShowHelp(false);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500 rounded-lg transition-colors duration-200"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold p-3 flex items-center justify-center rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogInIcon size={20} className="mr-2" />
            Login
          </motion.button>
        </form>

        <motion.div 
          className="mt-6 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 font-medium transition-colors duration-200"
            >
              Register
            </Link>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link 
              to="/" 
              className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 font-medium transition-colors duration-200"
            >
              return to the landing page
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../context/AuthContext';
import { LogInIcon } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-700 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">
            BUDGET<span className="text-yellow-400">BOSS</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold mb-2 text-black dark:text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-black dark:text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black p-3 font-bold flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
          >
            <LogInIcon size={20} className="mr-2" />
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
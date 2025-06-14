import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../context/AuthContext';
import { UserPlusIcon, UserIcon, MailIcon, LockIcon } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(email, password, name);
      navigate('/app');
    } catch (err) {
      setError('Email already exists');
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
            <p className="text-gray-600 dark:text-gray-400">Create your account and start managing your finances!</p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2 text-black dark:text-white">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500 rounded-lg transition-colors duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2 text-black dark:text-white">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500 rounded-lg transition-colors duration-200"
                  required
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500 rounded-lg transition-colors duration-200"
                  required
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
            <UserPlusIcon size={20} className="mr-2" />
            Register
          </motion.button>
        </form>

        <motion.p 
          className="mt-6 text-center text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 font-medium transition-colors duration-200"
          >
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
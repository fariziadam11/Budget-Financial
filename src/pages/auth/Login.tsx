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
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-black tracking-tight">
            BUDGET<span className="text-yellow-400">BOSS</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 font-bold flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
          >
            <LogInIcon size={20} className="mr-2" />
            Login
          </button>
        </form>

        <p className="mt-6 text-center">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
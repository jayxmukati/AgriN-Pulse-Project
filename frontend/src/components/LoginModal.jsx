import { X } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // OAuth2 Password Request Form expects x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const res = await axios.post(`${API_BASE}/api/v1/auth/token`, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const token = res.data.access_token;
        localStorage.setItem('agrin_token', token);
        onLoginSuccess(token);
        onClose();
      } else {
        await axios.post(`${API_BASE}/api/v1/auth/signup`, {
          email,
          password,
          full_name: fullName,
          preferred_language: 'en'
        });
        // Auto switch to login after signup
        setIsLogin(true);
        setError('Signup successful. Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-sm p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-1 text-center font-headline-md tracking-tight">
          {isLogin ? 'Welcome Back' : 'Join AgriN-Pulse'}
        </h2>
        <p className="text-xs text-center text-white/60 mb-6">
          {isLogin ? 'Log in to sync your telemetry data.' : 'Create an account to access premium diagnostics.'}
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-green-400/50 transition-colors"
              required
            />
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-green-400/50 transition-colors"
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-green-400/50 transition-colors"
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-400 text-black font-bold text-sm py-3 rounded-xl mt-2 hover:bg-green-300 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-white/60">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-green-300 font-bold hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/60">Sign in to your Vibing account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm animate-slide-up">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium">Username or Email</label>
            <input 
              className="tech-input w-full" 
              value={identifier} 
              onChange={e => setIdentifier(e.target.value)} 
              placeholder="Enter your username or email"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium">Password</label>
            <input 
              className="tech-input w-full" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>
          
          <button 
            className={`tech-button w-full text-lg py-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            New to Vibing? 
            <span className="text-primary-400 hover:text-primary-300 cursor-pointer ml-1 transition-colors duration-300">
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 
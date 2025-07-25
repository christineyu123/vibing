import React, { useState } from 'react';
import PhotoSelect from './PhotoSelect';
import FreeOfferings from './FreeOfferings';
import PlanSelect from './PlanSelect';

const initialState = {
  username: '',
  email: '',
  password: '',
  user_type: 'coder',
  user_plan: 'free',
  photo_choice: '/photos/pig.png',
  description: '',
  tags: '',
  calendly: '',
  free_offerings: [],
};

export default function Register({ onRegister }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      onRegister(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Join Vibing</h2>
          <p className="text-white/60">Connect with experts and coders in your field</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm animate-slide-up">
              {error}
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-white/80 text-sm font-medium">Username</label>
              <input 
                className="tech-input w-full" 
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                placeholder="Enter your username"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-white/80 text-sm font-medium">Email</label>
              <input 
                className="tech-input w-full" 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="your@email.com"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium">Password</label>
            <input 
              className="tech-input w-full" 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="Create a strong password"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium">Register as</label>
            <select 
              className="tech-input w-full" 
              name="user_type" 
              value={form.user_type} 
              onChange={handleChange}
            >
              <option value="coder">Vibe Coder</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <PlanSelect value={form.user_plan} onChange={val => setForm({ ...form, user_plan: val })} />
          </div>
          
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <label className="block text-white/80 text-sm font-medium mb-4">Profile Photo</label>
            <PhotoSelect value={form.photo_choice} onChange={val => setForm({ ...form, photo_choice: val })} />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium">Description</label>
            <textarea 
              className="tech-input w-full h-24 resize-none" 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Tell others about yourself and your expertise..."
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium">Keywords</label>
            <input 
              className="tech-input w-full" 
              name="tags" 
              value={form.tags} 
              onChange={handleChange} 
              placeholder="React, Python, AI, etc. (comma separated)"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium">Calendly Link (Optional)</label>
            <input 
              className="tech-input w-full" 
              name="calendly" 
              value={form.calendly} 
              onChange={handleChange} 
              placeholder="https://calendly.com/your-link"
            />
          </div>
          
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <FreeOfferings offerings={form.free_offerings} setOfferings={offerings => setForm({ ...form, free_offerings: offerings })} />
          </div>
          
          <button 
            className={`tech-button w-full text-lg py-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 
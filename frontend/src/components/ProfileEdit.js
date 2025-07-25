import React, { useState } from 'react';
import PhotoSelect from './PhotoSelect';
import FreeOfferings from './FreeOfferings';

export default function ProfileEdit({ user, token, onUpdate }) {
  const [form, setForm] = useState({
    username: user.username,
    photo_choice: user.photo_choice,
    description: user.description,
    tags: user.tags.join(','),
    calendly: user.calendly || '',
    free_offerings: Array.isArray(user.free_offerings) ? user.free_offerings : [],
  });
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
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      onUpdate(data.user);
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
          <h2 className="text-3xl font-bold text-white mb-2">Edit Profile</h2>
          <p className="text-white/60">Update your information and preferences</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm animate-slide-up">
              {error}
            </div>
          )}
          
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
                Saving Changes...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 
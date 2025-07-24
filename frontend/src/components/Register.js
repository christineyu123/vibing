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
  photo_choice: '/photos/photo1.jpg',
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
    <form className="p-4" style={{ maxWidth: 500, margin: '0 auto' }} onSubmit={handleSubmit}>
      <h2 className="mb-3 text-center">Register for Vibing</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input className="form-control" name="username" value={form.username} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Register as</label>
        <select className="form-select" name="user_type" value={form.user_type} onChange={handleChange}>
          <option value="coder">Vibe Coder</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <PlanSelect value={form.user_plan} onChange={val => setForm({ ...form, user_plan: val })} />
      <div className="mb-3">
        <label className="form-label">Profile Photo</label>
        <PhotoSelect value={form.photo_choice} onChange={val => setForm({ ...form, photo_choice: val })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Keywords (comma separated)</label>
        <input className="form-control" name="tags" value={form.tags} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Calendly Link (optional)</label>
        <input className="form-control" name="calendly" value={form.calendly} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <FreeOfferings offerings={form.free_offerings} setOfferings={offerings => setForm({ ...form, free_offerings: offerings })} />
      </div>
      <button className="btn btn-primary w-100" type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
} 
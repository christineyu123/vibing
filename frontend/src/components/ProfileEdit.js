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
    <form className="p-4" style={{ maxWidth: 500, margin: '0 auto' }} onSubmit={handleSubmit}>
      <h2 className="mb-3 text-center">Edit Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input className="form-control" name="username" value={form.username} onChange={handleChange} required />
      </div>
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
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
} 
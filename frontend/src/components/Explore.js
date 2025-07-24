import React, { useState, useEffect } from 'react';
import ProfileView from './ProfileView';

export default function Explore({ token, viewerPlan, currentUser }) {
  const [coders, setCoders] = useState([]);
  const [experts, setExperts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/users?user_type=coder', { headers: { Authorization: `Bearer ${token}` } })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) {
            console.error('Coder fetch error:', data);
            setError(data.error || data.msg || 'Failed to fetch coders');
            return [];
          }
          console.log('Coder fetch response:', data);
          return data.users || [];
        })
        .catch(e => { console.error('Coder fetch exception:', e); setError(e.message); return []; }),
      fetch('/api/users?user_type=expert', { headers: { Authorization: `Bearer ${token}` } })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) {
            console.error('Expert fetch error:', data);
            setError(data.error || data.msg || 'Failed to fetch experts');
            return [];
          }
          console.log('Expert fetch response:', data);
          return data.users || [];
        })
        .catch(e => { console.error('Expert fetch exception:', e); setError(e.message); return []; })
    ]).then(([coders, experts]) => {
      setCoders(coders);
      setExperts(experts);
    }).finally(() => setLoading(false));
  }, [token]);

  // No filtering of currentUser, always show all users

  return (
    <div>
      <h2 className="mb-3">Explore Vibe Coders</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="row mb-4">
          {coders.map(u => (
            <div className="col-md-3 mb-3" key={u.id}>
              <div className="card h-100 text-center" style={{ cursor: 'pointer' }} onClick={() => setSelected(u)}>
                <img src={u.photo_choice} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', margin: '16px auto 0', objectFit: 'cover' }} />
                <div className="card-body p-2">
                  <h5 className="card-title mb-0">{u.username}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <h2 className="mb-3 mt-5">Explore Experts</h2>
      {loading ? <div>Loading...</div> : (
        <div className="row mb-4">
          {experts.map(u => (
            <div className="col-md-3 mb-3" key={u.id}>
              <div className="card h-100 text-center" style={{ cursor: 'pointer' }} onClick={() => setSelected(u)}>
                <img src={u.photo_choice} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', margin: '16px auto 0', objectFit: 'cover' }} />
                <div className="card-body p-2">
                  <h5 className="card-title mb-0">{u.username}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile</h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <ProfileView user={selected} viewerPlan={viewerPlan} onSendMessage={async (subject, body) => {}} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
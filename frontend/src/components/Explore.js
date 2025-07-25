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

  const UserCard = ({ user, type }) => (
    <div 
      className="glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow group animate-fade-in"
      onClick={() => setSelected(user)}
    >
      <div className="text-center">
        <div className="relative mb-4">
          <img 
            src={user.photo_choice} 
            alt="Profile" 
            className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-white/20 group-hover:ring-primary-400 transition-all duration-300"
          />
          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            type === 'coder' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {type === 'coder' ? 'C' : 'E'}
          </div>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-300 transition-colors duration-300">
          {user.username}
        </h3>
        <div className="text-white/60 text-sm mb-3 line-clamp-2">
          {user.description}
        </div>
        {user.tags && user.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {user.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {user.tags.length > 3 && (
              <span className="text-xs text-white/40">
                +{user.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm animate-slide-up">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-white/70">Loading users...</span>
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Vibe Coders</h2>
              <div className="ml-3 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                {coders.length} found
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coders.map(user => (
                <UserCard key={user.id} user={user} type="coder" />
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Experts</h2>
              <div className="ml-3 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                {experts.length} found
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {experts.map(user => (
                <UserCard key={user.id} user={user} type="expert" />
              ))}
            </div>
          </div>
        </>
      )}
      
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">User Profile</h3>
              <button 
                className="text-white/60 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg"
                onClick={() => setSelected(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ProfileView user={selected} viewerPlan={viewerPlan} onSendMessage={async (subject, body) => {}} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
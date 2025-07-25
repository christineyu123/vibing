import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Explore from './components/Explore';
import ProfileEdit from './components/ProfileEdit';
import ProfileView from './components/ProfileView';

function App() {
  const [page, setPage] = useState('register');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);

  const handleRegister = data => {
    setUser(data.user);
    setToken(data.access_token);
    setPage('home');
  };
  const handleLogin = data => {
    setUser(data.user);
    setToken(data.access_token);
    setPage('home');
  };
  const handleUpdate = updatedUser => {
    setUser(updatedUser);
    setProfileEdit(false);
  };
  const handleSendMessage = async (toUserId, subject, body) => {
    if (!token) return;
    const res = await fetch(`/api/message/${toUserId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subject, body }),
    });
    return res.ok;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-300" 
              onClick={() => setPage('home')}
            >
              Vibing
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button 
                    className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setPage('explore')}
                  >
                    Explore
                  </button>
                  <button 
                    className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setProfileEdit(true)}
                  >
                    Edit Profile
                  </button>
                  <span className="text-white/70 text-sm">Hi, {user.username}!</span>
                  <button 
                    className="tech-button"
                    onClick={() => { setUser(null); setToken(null); setPage('login'); }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setPage('login')}
                  >
                    Login
                  </button>
                  <button 
                    className="tech-button"
                    onClick={() => setPage('register')}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {page === 'register' && <Register onRegister={handleRegister} />}
        {page === 'login' && <Login onLogin={handleLogin} />}
        {page === 'home' && user && !profileEdit && (
          <div className="glass-card max-w-2xl mx-auto p-8 text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to Vibing, {user.username}!
            </h2>
            <div className="mb-8">
              <span className="text-white/70 text-lg">Your plan: </span>
              <span className={`text-xl font-semibold ${user.user_plan === 'pro' ? 'text-yellow-400' : 'text-green-400'}`}>
                {user.user_plan}
              </span>
            </div>
            <div className="flex gap-4 justify-center">
              <button 
                className="tech-button"
                onClick={() => setPage('explore')}
              >
                Explore
              </button>
              <button 
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                onClick={() => setProfileEdit(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
        {profileEdit && user && (
          <ProfileEdit user={user} token={token} onUpdate={handleUpdate} />
        )}
        {page === 'explore' && user && (
          <Explore
            token={token}
            viewerPlan={user.user_plan}
            currentUser={user}
            onSendMessage={async (toUserId, subject, body) => handleSendMessage(toUserId, subject, body)}
          />
        )}
      </div>
    </div>
  );
}

export default App;

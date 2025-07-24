import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Explore from './components/Explore';
import ProfileEdit from './components/ProfileEdit';
import ProfileView from './components/ProfileView';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div style={{ background: '#e0e0f7', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand navbar-light" style={{ background: '#8f2dff' }}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setPage('home')}>Vibing</span>
          <div>
            {user ? (
              <>
                <button className="btn btn-outline-light me-2" onClick={() => setPage('explore')}>Explore</button>
                <button className="btn btn-outline-light me-2" onClick={() => setProfileEdit(true)}>Edit Profile</button>
                <span className="text-white me-3">Hi, {user.username}!</span>
                <button className="btn btn-light" onClick={() => { setUser(null); setToken(null); setPage('login'); }}>Logout</button>
              </>
            ) : (
              <>
                <button className="btn btn-outline-light me-2" onClick={() => setPage('login')}>Login</button>
                <button className="btn btn-light" onClick={() => setPage('register')}>Register</button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="container py-4">
        {page === 'register' && <Register onRegister={handleRegister} />}
        {page === 'login' && <Login onLogin={handleLogin} />}
        {page === 'home' && user && !profileEdit && (
          <div className="text-center mt-5">
            <h2>Welcome to Vibing, {user.username}!</h2>
            <p>Your plan: <b>{user.user_plan}</b></p>
            <button className="btn btn-outline-primary me-2" onClick={() => setPage('explore')}>Explore</button>
            <button className="btn btn-outline-secondary" onClick={() => setProfileEdit(true)}>Edit Profile</button>
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

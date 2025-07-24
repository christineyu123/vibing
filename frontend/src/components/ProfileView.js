import React, { useState } from 'react';

export default function ProfileView({ user, viewerPlan, onSendMessage }) {
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const canContact = viewerPlan === 'pro';

  const handleSend = async () => {
    setSending(true);
    await onSendMessage(subject, msg);
    setSending(false);
    setShowMsg(false);
    setMsg('');
    setSubject('');
  };

  return (
    <div className="card p-4" style={{ maxWidth: 500, margin: '0 auto' }}>
      <div className="text-center mb-3">
        <img src={user.photo_choice} alt="Profile" style={{ width: 96, height: 96, borderRadius: '50%' }} />
        <h3 className="mt-2">{user.username}</h3>
        <span className="badge bg-info text-dark">{user.user_type === 'coder' ? 'Vibe Coder' : 'Expert'}</span>
      </div>
      <p><b>Description:</b> {user.description}</p>
      <p><b>Keywords:</b> {user.tags && user.tags.join(', ')}</p>
      {user.free_offerings && (
        <div>
          <b>Free Offerings:</b>
          <ul>
            {Array.isArray(user.free_offerings)
              ? user.free_offerings.map((o, i) => <li key={i}>{o}</li>)
              : null}
          </ul>
        </div>
      )}
      <div className="mb-2">
        <b>Email:</b>{' '}
        {canContact && user.email ? (
          <span>{user.email}</span>
        ) : (
          <span className="text-muted">(Pro only)</span>
        )}
      </div>
      <div className="mb-2">
        <b>Calendly:</b>{' '}
        {user.calendly ? (
          canContact ? (
            <a href={user.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm">Book Call</a>
          ) : (
            <button className="btn btn-outline-secondary btn-sm" disabled>Pro only</button>
          )
        ) : (
          <button className="btn btn-outline-secondary btn-sm" disabled>No Calendly</button>
        )}
      </div>
      <div className="mb-2">
        <b>Send Message:</b>{' '}
        {canContact ? (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => setShowMsg(!showMsg)}>
              {showMsg ? 'Cancel' : 'Send Message'}
            </button>
            {showMsg && (
              <div className="mt-2">
                <input
                  className="form-control mb-2"
                  placeholder="Subject (optional)"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Type your message..."
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                />
                <button className="btn btn-success btn-sm" onClick={handleSend} disabled={sending || !msg}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            )}
          </>
        ) : (
          <button className="btn btn-outline-secondary btn-sm" disabled>Pro only</button>
        )}
      </div>
    </div>
  );
} 
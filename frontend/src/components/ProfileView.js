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
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative mb-4 inline-block">
          <img 
            src={user.photo_choice} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-400/50"
          />
          <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${
            user.user_type === 'coder' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {user.user_type === 'coder' ? 'Coder' : 'Expert'}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{user.username}</h3>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          user.user_plan === 'pro' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-green-400/20 text-green-400'
        }`}>
          {user.user_plan} Plan
        </div>
      </div>
      
      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h4 className="text-white font-semibold mb-2">About</h4>
        <p className="text-white/80 text-sm leading-relaxed">{user.description}</p>
      </div>
      
      {user.tags && user.tags.length > 0 && (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h4 className="text-white font-semibold mb-3">Skills & Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {user.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {user.free_offerings && Array.isArray(user.free_offerings) && user.free_offerings.length > 0 && (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h4 className="text-white font-semibold mb-3">Free Offerings</h4>
          <ul className="space-y-2">
            {user.free_offerings.map((offering, idx) => (
              <li key={idx} className="flex items-center text-white/80 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                {offering}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid gap-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Email Contact</h4>
              <p className="text-white/60 text-sm">
                {canContact && user.email ? user.email : 'Available for Pro users only'}
              </p>
            </div>
            {!canContact && (
              <div className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                Pro Only
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-white font-semibold">Schedule a Call</h4>
              <p className="text-white/60 text-sm">Book time directly with {user.username}</p>
            </div>
          </div>
          {user.calendly ? (
            canContact ? (
              <a 
                href={user.calendly} 
                target="_blank" 
                rel="noopener noreferrer"
                className="tech-button inline-block text-center text-sm py-2 px-4"
              >
                Book Call
              </a>
            ) : (
              <button className="px-4 py-2 bg-white/10 text-white/50 rounded-lg cursor-not-allowed text-sm">
                Pro Only
              </button>
            )
          ) : (
            <button className="px-4 py-2 bg-white/10 text-white/50 rounded-lg cursor-not-allowed text-sm">
              No Calendly Link
            </button>
          )}
        </div>
        
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-white font-semibold">Send Message</h4>
              <p className="text-white/60 text-sm">Contact {user.username} directly</p>
            </div>
          </div>
          {canContact ? (
            <div className="space-y-3">
              <button 
                className={`tech-button text-sm py-2 px-4 ${showMsg ? 'bg-red-500 hover:bg-red-600' : ''}`}
                onClick={() => setShowMsg(!showMsg)}
              >
                {showMsg ? 'Cancel' : 'Send Message'}
              </button>
              {showMsg && (
                <div className="space-y-3 animate-slide-up">
                  <input
                    className="tech-input w-full"
                    placeholder="Subject (optional)"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                  />
                  <textarea
                    className="tech-input w-full h-24 resize-none"
                    placeholder="Type your message..."
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                  />
                  <button 
                    className={`tech-button text-sm py-2 px-4 ${(!msg || sending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSend} 
                    disabled={sending || !msg}
                  >
                    {sending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="px-4 py-2 bg-white/10 text-white/50 rounded-lg cursor-not-allowed text-sm">
              Pro Only
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 
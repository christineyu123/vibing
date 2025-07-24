import React from 'react';

export default function SubscriptionPlans({ selected, onSelect }) {
  return (
    <div className="row mb-4 justify-content-center">
      <div className="col-md-4">
        <div className={`card ${selected === 'free' ? 'border-primary' : ''}`} style={{ borderColor: '#8f2dff' }}>
          <div className="card-body">
            <h5 className="card-title" style={{ color: '#8f2dff' }}>Free</h5>
            <ul>
              <li>Browse profiles</li>
              <li>See free offerings</li>
              <li>Search by tags</li>
            </ul>
            <button className="btn btn-outline-primary w-100" style={{ borderColor: '#8f2dff', color: '#8f2dff' }} onClick={() => onSelect('free')}>
              Choose Free
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card ${selected === 'pro' ? 'border-primary' : ''}`} style={{ borderColor: '#8f2dff' }}>
          <div className="card-body">
            <h5 className="card-title" style={{ color: '#8f2dff' }}>Pro</h5>
            <ul>
              <li>See contact info</li>
              <li>Send messages</li>
              <li>Book calls via Calendly</li>
            </ul>
            <button className="btn btn-primary w-100" style={{ background: '#8f2dff', borderColor: '#8f2dff' }} onClick={() => onSelect('pro')}>
              Choose Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
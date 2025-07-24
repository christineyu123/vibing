import React from 'react';

export default function PlanSelect({ value, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label">Choose your plan</label>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="user_plan"
          id="planFree"
          value="free"
          checked={value === 'free'}
          onChange={() => onChange('free')}
        />
        <label className="form-check-label" htmlFor="planFree">
          Free (basic access)
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="user_plan"
          id="planPro"
          value="pro"
          checked={value === 'pro'}
          onChange={() => onChange('pro')}
        />
        <label className="form-check-label" htmlFor="planPro">
          Pro (see contact info, send messages, book calls)
        </label>
      </div>
    </div>
  );
} 
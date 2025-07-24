import React, { useState } from 'react';

export default function FreeOfferings({ offerings, setOfferings }) {
  const [input, setInput] = useState('');

  const addOffering = () => {
    if (input.trim()) {
      setOfferings([...offerings, input.trim()]);
      setInput('');
    }
  };

  const removeOffering = idx => {
    setOfferings(offerings.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="form-label">Free Offerings (optional)</label>
      <div className="d-flex mb-2">
        <input
          className="form-control me-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe a free offering..."
        />
        <button type="button" className="btn btn-outline-primary" onClick={addOffering}>
          Add
        </button>
      </div>
      <ul className="list-group">
        {offerings.map((off, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            {off}
            <button type="button" className="btn btn-sm btn-danger" onClick={() => removeOffering(idx)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 
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
    <div className="space-y-4">
      <label className="block text-white/80 text-sm font-medium">Free Offerings (Optional)</label>
      <p className="text-white/60 text-xs">Add services you'd offer for free to build connections</p>
      
      <div className="flex gap-2">
        <input
          className="tech-input flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g., 15-minute consultation, code review..."
          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addOffering())}
        />
        <button 
          type="button" 
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-300"
          onClick={addOffering}
        >
          Add
        </button>
      </div>
      
      {offerings.length > 0 && (
        <div className="space-y-2">
          {offerings.map((off, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 animate-slide-up">
              <span className="text-white/90 text-sm">{off}</span>
              <button 
                type="button" 
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded-md transition-colors duration-300"
                onClick={() => removeOffering(idx)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
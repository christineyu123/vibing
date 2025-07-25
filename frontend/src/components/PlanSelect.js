import React from 'react';

export default function PlanSelect({ value, onChange }) {
  return (
    <div className="space-y-4">
      <label className="block text-white/80 text-sm font-medium">Choose your plan</label>
      <div className="grid gap-4">
        <div 
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
            value === 'free' 
              ? 'border-green-400 bg-green-400/10 shadow-glow' 
              : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }`}
          onClick={() => onChange('free')}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="user_plan"
              id="planFree"
              value="free"
              checked={value === 'free'}
              onChange={() => onChange('free')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              value === 'free' ? 'border-green-400 bg-green-400' : 'border-white/40'
            }`}>
              {value === 'free' && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>
            <div>
              <div className="text-white font-semibold text-lg">Free Plan</div>
              <div className="text-white/60 text-sm">Basic access to explore profiles</div>
            </div>
          </div>
        </div>
        
        <div 
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
            value === 'pro' 
              ? 'border-yellow-400 bg-yellow-400/10 shadow-glow' 
              : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }`}
          onClick={() => onChange('pro')}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="user_plan"
              id="planPro"
              value="pro"
              checked={value === 'pro'}
              onChange={() => onChange('pro')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              value === 'pro' ? 'border-yellow-400 bg-yellow-400' : 'border-white/40'
            }`}>
              {value === 'pro' && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>
            <div>
              <div className="text-white font-semibold text-lg flex items-center">
                Pro Plan 
                <span className="ml-2 text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full">PREMIUM</span>
              </div>
              <div className="text-white/60 text-sm">See contact info, send messages, book calls</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
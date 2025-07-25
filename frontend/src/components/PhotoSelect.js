import React from 'react';

const photoList = [
  '/photos/pig.png',
  '/photos/dragon.png',
  '/photos/monkey.png',
  '/photos/dog1.png',
  '/photos/dog2.png',
  '/photos/cat1.png',
  '/photos/unicorn.png',
];

export default function PhotoSelect({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
      {photoList.map((src, idx) => (
        <label key={src} className="cursor-pointer">
          <input
            type="radio"
            name="photo_choice"
            value={src}
            checked={value === src}
            onChange={() => onChange(src)}
            className="sr-only"
          />
          <div className={`relative group transition-all duration-300 ${
            value === src ? 'scale-110' : 'hover:scale-105'
          }`}>
            <img
              src={src}
              alt={`Profile ${idx + 1}`}
              className={`w-16 h-16 rounded-full object-cover transition-all duration-300 ${
                value === src 
                  ? 'ring-4 ring-primary-500 shadow-glow' 
                  : 'ring-2 ring-white/20 group-hover:ring-white/40'
              }`}
            />
            {value === src && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center animate-pulse-glow">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
} 
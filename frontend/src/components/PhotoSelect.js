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
    <div className="d-flex flex-wrap gap-2">
      {photoList.map((src, idx) => (
        <label key={src} style={{ cursor: 'pointer' }}>
          <input
            type="radio"
            name="photo_choice"
            value={src}
            checked={value === src}
            onChange={() => onChange(src)}
            style={{ display: 'none' }}
          />
          <img
            src={src}
            alt={`Profile ${idx + 1}`}
            style={{
              border: value === src ? '3px solid #8f2dff' : '2px solid #eee',
              borderRadius: '50%',
              width: 64,
              height: 64,
              objectFit: 'cover',
              margin: 4,
            }}
          />
        </label>
      ))}
    </div>
  );
} 
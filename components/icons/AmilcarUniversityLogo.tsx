import React from 'react';

export const AmilcarUniversityLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#facc15', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <g transform="translate(5, 5) scale(0.9)">
      <path
        d="M45 0 C 45 0, 90 10, 90 30 L 90 60 C 90 80, 45 100, 45 100 C 45 100, 0 80, 0 60 L 0 30 C 0 10, 45 0, 45 0 Z"
        fill="url(#shieldGradient)"
        stroke="#ca8a04"
        strokeWidth="2"
      />
      <path
        d="M45 5 C 45 5, 85 15, 85 32 L 85 60 C 85 78, 45 95, 45 95 C 45 95, 5 78, 5 60 L 5 32 C 5 15, 45 5, 45 5 Z"
        fill="none"
        stroke="#fefce8"
        strokeWidth="1.5"
      />
      <text
        x="45"
        y="65"
        fontFamily="serif"
        fontSize="48"
        fontWeight="bold"
        fill="#a16207"
        textAnchor="middle"
        letterSpacing="-2"
      >
        AU
      </text>
    </g>
  </svg>
);
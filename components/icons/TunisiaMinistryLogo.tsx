import React from 'react';

export const TunisiaMinistryLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#003366', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#001a33', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    
    {/* Shield */}
    <path d="M 50,5 L 95,25 L 95,75 L 50,115 L 5,75 L 5,25 Z" fill="url(#grad1)" stroke="#d4af37" strokeWidth="2" />
    <path d="M 50,10 L 90,30 L 90,72 L 50,110 L 10,72 L 10,30 Z" fill="none" stroke="#d4af37" strokeWidth="1" />
    
    {/* Crescent and Star */}
    <path d="M 50 28 A 18 18 0 1 0 50 68 A 15 15 0 1 1 50 34" fill="#E70013" />
    <polygon points="58,42 61,48 67,49 62,53 64,59 58,56 52,59 54,53 49,49 55,48" fill="#E70013" />

    {/* Book */}
    <path d="M 25,65 Q 50,55 75,65 L 75,95 Q 50,105 25,95 Z" fill="#ffffff" />
    <path d="M 50,60 V 100" stroke="#d4af37" strokeWidth="1.5" />
    <path d="M 30,70 H 45 M 30,75 H 45 M 30,80 H 45 M 30,85 H 45" stroke="#003366" strokeWidth="0.8" />
    <path d="M 55,70 H 70 M 55,75 H 70 M 55,80 H 70 M 55,85 H 70" stroke="#003366" strokeWidth="0.8" />
    <path d="M 25,65 Q 50,75 75,65" fill="none" stroke="#d4af37" strokeWidth="1.5" />

    {/* Olive Branches */}
    <g transform="translate(-10, 0)">
      <path d="M 20,40 C 10,60 10,80 20,100" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <circle cx="21" cy="50" r="2.5" fill="#d4af37"/>
      <circle cx="23" cy="60" r="2.5" fill="#d4af37"/>
      <circle cx="25" cy="70" r="2.5" fill="#d4af37"/>
      <circle cx="28" cy="80" r="2.5" fill="#d4af37"/>
      <circle cx="32" cy="90" r="2.5" fill="#d4af37"/>
    </g>
    <g transform="translate(10, 0) scale(-1, 1) translate(-100, 0)">
      <path d="M 20,40 C 10,60 10,80 20,100" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <circle cx="21" cy="50" r="2.5" fill="#d4af37"/>
      <circle cx="23" cy="60" r="2.5" fill="#d4af37"/>
      <circle cx="25" cy="70" r="2.5" fill="#d4af37"/>
      <circle cx="28" cy="80" r="2.5" fill="#d4af37"/>
      <circle cx="32" cy="90" r="2.5" fill="#d4af37"/>
    </g>
  </svg>
);

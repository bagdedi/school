import React from 'react';

export const CoffeeIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-2.25 2.25m0 0l-2.25 2.25M17.25 10.5h2.25m-4.5 0h.008v.008h-.008v-.008zM12 21a9 9 0 110-18 9 9 0 010 18z"
    />
     <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M6.75 7.5l.75-5.25H16.5l.75 5.25m-11.25 0V21h12V7.5m-12 0h12" 
    />
  </svg>
);

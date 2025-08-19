import React from 'react';

export const BankIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m3 0h1.5m-4.5 3.75h1.5m3 0h1.5m-4.5 3.75h1.5m3 0h1.5m-4.5 3.75h1.5m3 0h1.5M12 3v18"
    />
  </svg>
);

import React from 'react';

export const BuildingOfficeIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21h9m-9-4v4m-9 0h9m-9-4v4m0-13h.01M12 6h.01M12 12h.01M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6h.01M12 12h.01M12 18h.01" />
  </svg>
);
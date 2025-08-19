import React from 'react';

export const ResetIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
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
      d="M4 4v5h5m11 7v-5h-5M4 9a9 9 0 0115-3.89m-4.11 8.89A9 9 0 015 15"
    />
  </svg>
);

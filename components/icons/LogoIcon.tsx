import React from 'react';

export const LogoIcon: React.FC = () => (
    <svg
      className="h-8 w-8 text-indigo-400"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
      <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
    </svg>
);
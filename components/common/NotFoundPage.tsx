import React from 'react';
import { LibraryIcon } from '../icons/LibraryIcon';

interface NotFoundPageProps {
  onNavigateHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Page not found</h1>
      <p className="text-gray-600 text-lg mb-8">Check that the URL was entered correctly and try again</p>
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Go to dashboard"
      >
        <LibraryIcon />
        <span>Go to dashboard</span>
      </button>
    </div>
  );
};

import React from 'react';
import { XIcon } from '../icons/XIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} m-4 relative flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center border-b p-6">
          <h2 id="modal-title" className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <XIcon />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-6 pt-4">
            {children}
        </div>
      </div>
    </div>
  );
};
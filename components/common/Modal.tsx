import React from 'react';
import { XIcon } from '../icons/XIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <XIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
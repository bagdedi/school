import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { AttestationType } from '../../types';

interface AttestationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (type: AttestationType) => void;
}

export const AttestationSelectionModal: React.FC<AttestationSelectionModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [selection, setSelection] = useState<AttestationType>('presence');

  const handleGenerateClick = () => {
    onGenerate(selection);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Type d'attestation" size="md">
      <div className="space-y-4 pt-4">
        <fieldset className="space-y-3">
          <legend className="sr-only">Type d'attestation</legend>
          <div className="flex items-center">
            <input
              id="inscription"
              name="attestation-type"
              type="radio"
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              checked={selection === 'inscription'}
              onChange={() => setSelection('inscription')}
            />
            <label htmlFor="inscription" className="ml-3 block text-sm font-medium text-gray-700">
              Attestation d'inscription
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="presence"
              name="attestation-type"
              type="radio"
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              checked={selection === 'presence'}
              onChange={() => setSelection('presence')}
            />
            <label htmlFor="presence" className="ml-3 block text-sm font-medium text-gray-700">
              Attestation de présence
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="both"
              name="attestation-type"
              type="radio"
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              checked={selection === 'both'}
              onChange={() => setSelection('both')}
            />
            <label htmlFor="both" className="ml-3 block text-sm font-medium text-gray-700">
              Les deux attestations
            </label>
          </div>
        </fieldset>
      </div>
      <div className="flex justify-end space-x-3 pt-6 mt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleGenerateClick}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Générer
        </button>
      </div>
    </Modal>
  );
};
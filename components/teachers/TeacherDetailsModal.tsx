import React from 'react';
import { Modal } from '../common/Modal';
import type { Teacher } from '../../types';
import { UserIcon } from '../icons/UserIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { BankIcon } from '../icons/BankIcon';
import { IdentificationIcon } from '../icons/IdentificationIcon';

interface TeacherDetailsModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md text-gray-800">{value || '-'}</p>
  </div>
);

export const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({ teacher, onClose }) => {
  if (!teacher) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Détails de l'enseignant" size="3xl">
      <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8 p-4">
        <div className="flex-shrink-0 flex flex-col items-center w-full md:w-48">
          <img
            src={teacher.avatar}
            alt={`${teacher.firstName} ${teacher.lastName}`}
            className="w-32 h-32 rounded-full ring-4 ring-indigo-200"
          />
          <h2 className="text-xl font-bold text-gray-800 mt-4 text-center">{`${teacher.firstName} ${teacher.lastName}`}</h2>
          <p className="text-sm text-gray-500">{teacher.matricule}</p>
          <p className="text-md font-semibold text-indigo-600 mt-1">{teacher.specialty}</p>
        </div>
        <div className="flex-grow w-full space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-white bg-cyan-500 p-3 rounded-t-md flex items-center">
              <UserIcon className="h-5 w-5 mr-3" /> Informations Personnelles
            </h3>
            <div className="border border-t-0 border-gray-200 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Genre" value={teacher.gender} />
              <DetailItem label="Date de naissance" value={teacher.dateOfBirth} />
              <DetailItem label="Lieu de naissance" value={teacher.placeOfBirth} />
              <DetailItem label="Nationalité" value={teacher.nationality} />
              <DetailItem label="Email" value={teacher.email} />
              <DetailItem label="Téléphone" value={teacher.phone} />
              <div className="sm:col-span-3">
                <DetailItem label="Adresse" value={teacher.address} />
              </div>
            </div>
          </div>
          {/* Professional Information */}
          <div className="bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-white bg-green-600 p-3 rounded-t-md flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-3" /> Informations Professionnelles
            </h3>
            <div className="border border-t-0 border-gray-200 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Diplôme" value={teacher.diploma} />
              <DetailItem label="Spécialité" value={teacher.specialty} />
              <DetailItem label="Etat Professionnelle" value={teacher.professionalStatus} />
              <DetailItem label="Années d'Expérience" value={teacher.yearsOfExperience} />
            </div>
          </div>
          {/* Bank Information */}
          <div className="bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-white bg-yellow-500 p-3 rounded-t-md flex items-center">
              <BankIcon className="h-5 w-5 mr-3" /> Informations Bancaires
            </h3>
            <div className="border border-t-0 border-gray-200 p-4 grid grid-cols-2 gap-4">
              <DetailItem label="Banque" value={teacher.bank} />
              <DetailItem label="RIB" value={teacher.rib} />
            </div>
          </div>
          {/* ID Information */}
           <div className="bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-white bg-red-600 p-3 rounded-t-md flex items-center">
              <IdentificationIcon className="h-5 w-5 mr-3" /> Pièce d'Identité
            </h3>
            <div className="border border-t-0 border-gray-200 p-4 grid grid-cols-2 gap-4">
              <DetailItem label="Type de Pièce" value={teacher.idType} />
              <DetailItem label="Numéro de Pièce" value={teacher.idNumber} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4 mt-4 border-t">
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Fermer
        </button>
      </div>
    </Modal>
  );
};

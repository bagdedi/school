import React from 'react';
import { Modal } from '../common/Modal';
import type { Student } from '../../types';
import { UserIcon } from '../icons/UserIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';

interface StudentDetailsModalProps {
  student: Student | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string | null | string[] }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md text-gray-800 capitalize">
        {Array.isArray(value) ? (value.length > 0 ? value.join(', ') : '-') : (value || '-')}
    </p>
  </div>
);

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Détails de l'étudiant" size="3xl">
      <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8 p-4">
        <div className="flex-shrink-0 flex flex-col items-center w-full md:w-48">
          <img
            src={student.avatar}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-32 h-32 rounded-full ring-4 ring-indigo-200"
          />
          <h2 className="text-xl font-bold text-gray-800 mt-4 text-center">{`${student.firstName} ${student.lastName}`}</h2>
          <p className="text-sm text-gray-500">{student.matricule}</p>
        </div>
        <div className="flex-grow w-full space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-white bg-blue-600 p-3 rounded-t-md flex items-center">
              <UserIcon className="h-5 w-5 mr-3" /> Informations Personnelles
            </h3>
            <div className="border border-t-0 border-gray-200 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Genre" value={student.gender} />
              <DetailItem label="Date de naissance" value={student.dateOfBirth} />
              <DetailItem label="Lieu de naissance" value={student.placeOfBirth} />
              <div className="sm:col-span-3">
                <DetailItem label="Adresse" value={student.address} />
              </div>
            </div>
          </div>
          {/* Academic Path */}
          <div className="bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-white bg-green-600 p-3 rounded-t-md flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-3" /> Parcours Académique
            </h3>
            <div className="border border-t-0 border-gray-200 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Niveau" value={student.academicLevel} />
              <DetailItem label="Spécialité" value={student.academicSpecialty} />
              <DetailItem label="Classe" value={student.classe} />
              <DetailItem label="Option(s)" value={student.option} />
              <DetailItem label="Année Scolaire" value={student.schoolYear} />
            </div>
          </div>
          {/* Parent Information */}
          <div className="bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-white bg-yellow-500 p-3 rounded-t-md flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-3" /> Informations des Parents
            </h3>
            <div className="border border-t-0 border-gray-200 p-4 grid grid-cols-2 gap-4">
              <DetailItem label="Téléphone Parents" value={student.parentPhone} />
              <DetailItem label="Email Parents" value={student.parentEmail} />
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
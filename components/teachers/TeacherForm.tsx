import React, { useState, useEffect } from 'react';
import type { Teacher } from '../../types';
import { UserIcon } from '../icons/UserIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { IdentificationIcon } from '../icons/IdentificationIcon';
import { BankIcon } from '../icons/BankIcon';
import { CameraIcon } from '../icons/CameraIcon';
import { InfoIcon } from '../icons/InfoIcon';

interface TeacherFormProps {
  teacher: Teacher | null;
  onSave: (teacherData: Omit<Teacher, 'id' | 'avatar' | 'photoUrl' | 'matricule'>) => void;
  onCancel: () => void;
}

const initialFormData = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  gender: 'Male',
  dateOfBirth: '1985-01-01',
  placeOfBirth: '',
  nationality: '',
  address: '',
  diploma: 'Doctorat',
  specialty: '',
  professionalStatus: 'Vacataire',
  yearsOfExperience: '',
  bank: '',
  rib: '',
  idType: 'CIN',
  idNumber: '',
  photo: null,
};


export const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (teacher) {
      // @ts-ignore
      setFormData({
        ...initialFormData,
        ...teacher,
        photo: null
      });
    } else {
      setFormData(initialFormData);
    }
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files[0] as any }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { photo, ...teacherData } = formData;
    onSave(teacherData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-cyan-500 p-3 rounded-t-md flex items-center">
            <UserIcon className="h-5 w-5 mr-3" />
            Informations Personnelles
        </h2>
        <div className="border border-t-0 border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date de Naissance</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
             <div>
                <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">Lieu de Naissance</label>
                <input type="text" id="placeOfBirth" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Genre</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option>Male</option>
                    <option>Female</option>
                </select>
            </div>
            <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationalité</label>
                <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required/>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
        </div>
      </div>

       {/* Professional Information */}
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-green-600 p-3 rounded-t-md flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-3" />
            Informations Professionnelles
        </h2>
        <div className="border border-t-0 border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <label htmlFor="diploma" className="block text-sm font-medium text-gray-700">Diplôme</label>
                <select id="diploma" name="diploma" value={formData.diploma} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option>Doctorat</option>
                    <option>Masters</option>
                    <option>Bachelors</option>
                </select>
            </div>
            <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Spécialité</label>
                <input type="text" id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required/>
            </div>
            <div>
                <label htmlFor="professionalStatus" className="block text-sm font-medium text-gray-700">Etat Professionnelle</label>
                <select id="professionalStatus" name="professionalStatus" value={formData.professionalStatus} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option>Vacataire</option>
                    <option>Permanent</option>
                    <option>Contractuel</option>
                </select>
            </div>
            <div>
                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">Années d'Expérience</label>
                <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="matricule" className="block text-sm font-medium text-gray-700">Matricule</label>
                <input type="text" id="matricule" name="matricule" value={teacher?.matricule || 'Généré automatiquement'} className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" disabled />
            </div>
        </div>
      </div>
      
      {/* Bank Information */}
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-yellow-500 p-3 rounded-t-md flex items-center">
            <BankIcon className="h-5 w-5 mr-3" />
            Informations Bancaires
        </h2>
        <div className="border border-t-0 border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
             <div>
                <label htmlFor="bank" className="block text-sm font-medium text-gray-700">Banque</label>
                <input type="text" id="bank" name="bank" value={formData.bank} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
             <div>
                <label htmlFor="rib" className="block text-sm font-medium text-gray-700">RIB</label>
                <input type="text" id="rib" name="rib" value={formData.rib} onChange={handleChange} placeholder="20 chiffres" maxLength={20} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
        </div>
      </div>

       {/* ID */}
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-red-600 p-3 rounded-t-md flex items-center">
            <IdentificationIcon className="h-5 w-5 mr-3" />
            Pièce d'Identité
        </h2>
        <div className="border border-t-0 border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <label htmlFor="idType" className="block text-sm font-medium text-gray-700">Type de Pièce</label>
                <select id="idType" name="idType" value={formData.idType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option>CIN</option>
                    <option>Passport</option>
                    <option>Birth Certificate</option>
                </select>
            </div>
            <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">Numéro de Pièce</label>
                <input type="text" id="idNumber" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="8 chiffres (ex: 12345678)" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
        </div>
      </div>
      
       {/* Profile Photo */}
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-purple-600 p-3 rounded-t-md flex items-center">
            <CameraIcon className="h-5 w-5 mr-3" />
            Photo de Profil
        </h2>
        <div className="border border-t-0 border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                 <div className='md:col-span-2'>
                     <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                    <div className="flex items-center space-x-4">
                        <span className="inline-block h-24 w-24 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                           <CameraIcon className="h-12 w-12 text-gray-400" />
                        </span>
                        <div>
                             <input type="file" id="photo" name="photo" onChange={handleFileChange} accept="image/jpeg, image/png" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                             <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG. Taille max: 2MB</p>
                        </div>
                    </div>
                 </div>
                 <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-md text-sm space-y-2">
                    <div className="flex items-start">
                        <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"/>
                        <p>La photo doit être récente et claire</p>
                    </div>
                    <div className="flex items-start">
                        <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"/>
                        <p>Format portrait de préférence</p>
                    </div>
                </div>
            </div>
        </div>
      </div>


      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
          Cancel
        </button>
        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          {teacher ? 'Save Changes' : 'Add Teacher'}
        </button>
      </div>
    </form>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import type { Student, Classe } from '../../types';
import { UserIcon } from '../icons/UserIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { CameraIcon } from '../icons/CameraIcon';


interface StudentFormProps {
  student: Student | null;
  onSave: (studentData: Omit<Student, 'id' | 'avatar' | 'photoUrl' | 'matricule'>) => void;
  onCancel: () => void;
  optionalSubjects: string[];
  classes: Classe[];
}

const initialFormData = {
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '2000-01-01',
    placeOfBirth: '',
    address: '',
    academicLevel: '', // niveau
    academicSpecialty: '', // specialité
    option: '',
    classe: '',
    parentPhone: '',
    parentEmail: '',
    photo: null,
};

const niveauOptions = ['1 annee', '2 annee', '3 annee', '4 annee'];


export const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel, optionalSubjects, classes }) => {
  const [formData, setFormData] = useState<any>(initialFormData);

  useEffect(() => {
    if (student) {
      setFormData({
        ...initialFormData,
        ...student,
        photo: null,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [student]);

  const availableSpecialites = useMemo(() => {
    if (!formData.academicLevel) {
      return [];
    }
    // Filter classes by the selected niveau
    const relevantClasses = classes.filter(c => c.niveau === formData.academicLevel);
    // Get unique specialites from these classes
    const uniqueSpecialites = [...new Set(relevantClasses.map(c => c.specialite))];
    // Sort them alphabetically
    return uniqueSpecialites.sort();
  }, [formData.academicLevel, classes]);

  const availableClasses = useMemo(() => {
    if (!formData.academicLevel || !formData.academicSpecialty) {
      return [];
    }
    return classes
      .filter(c => c.niveau === formData.academicLevel && c.specialite === formData.academicSpecialty)
      .map(c => c.name)
      .sort();
  }, [formData.academicLevel, formData.academicSpecialty, classes]);


  useEffect(() => {
    if (!availableSpecialites.includes(formData.academicSpecialty)) {
      setFormData(prev => ({...prev, academicSpecialty: '', classe: ''}));
    } else if (!availableClasses.includes(formData.classe)) {
      setFormData(prev => ({...prev, classe: ''}));
    }
    
    if (formData.academicLevel !== '3 annee' && formData.academicLevel !== '4 annee') {
      setFormData(prev => ({...prev, option: ''}));
    }
  }, [formData.academicLevel, availableSpecialites, availableClasses]);

  const isSpecialiteDisabled = !formData.academicLevel;
  const isOptionDisabled = formData.academicLevel !== '3 annee' && formData.academicLevel !== '4 annee';
  const isClasseDisabled = !formData.academicLevel || !formData.academicSpecialty;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    const { photo, ...studentData } = formData;
    onSave(studentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-blue-600 p-3 rounded-t-md flex items-center">
            <UserIcon className="h-5 w-5 mr-3" />
            Informations Personnelles
        </h2>
        <div className="border border-t-0 border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
             <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Genre</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option>Male</option>
                    <option>Female</option>
                </select>
            </div>
            <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date de naissance</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
                <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                <input type="text" id="placeOfBirth" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
        </div>
      </div>
      
      {/* Academic Path */}
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-green-600 p-3 rounded-t-md flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-3" />
            Parcours Académique
        </h2>
        <div className="border border-t-0 border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
             <div>
                <label htmlFor="academicLevel" className="block text-sm font-medium text-gray-700">Niveau</label>
                <select id="academicLevel" name="academicLevel" value={formData.academicLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option value="">Sélectionnez...</option>
                    {niveauOptions.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="academicSpecialty" className="block text-sm font-medium text-gray-700">Spécialité</label>
                <select id="academicSpecialty" name="academicSpecialty" value={formData.academicSpecialty} onChange={handleChange} disabled={isSpecialiteDisabled} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                    <option value="">Sélectionnez...</option>
                    {availableSpecialites.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="classe" className="block text-sm font-medium text-gray-700">Classe</label>
                <select id="classe" name="classe" value={formData.classe || ''} onChange={handleChange} disabled={isClasseDisabled} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                    <option value="">Sélectionnez...</option>
                    {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="option" className="block text-sm font-medium text-gray-700">Option</label>
                <select id="option" name="option" value={formData.option} onChange={handleChange} disabled={isOptionDisabled} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                    <option value="">Sélectionnez...</option>
                     {optionalSubjects.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>
        </div>
      </div>

       {/* Parent Information */}
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-yellow-500 p-3 rounded-t-md flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-3" />
            Informations des Parents
        </h2>
        <div className="border border-t-0 border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">Téléphone Parents</label>
                <input type="tel" id="parentPhone" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">Email Parents</label>
                <input type="email" id="parentEmail" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
        </div>
      </div>

       {/* Photo */}
        <div className="bg-gray-50 rounded-lg">
            <h2 className="text-md font-semibold text-white bg-purple-600 p-3 rounded-t-md flex items-center">
                <CameraIcon className="h-5 w-5 mr-3" />
                Photo
            </h2>
            <div className="border border-t-0 border-gray-200 p-6">
                 <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo de l'étudiant</label>
                 <input type="file" id="photo" name="photo" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>
      </div>


      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
          Annuler
        </button>
        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          {student ? 'Enregistrer les modifications' : 'Ajouter étudiant'}
        </button>
      </div>
    </form>
  );
};
import React, { useState, useEffect, useMemo } from 'react';
import type { Student, Classe } from '../../types';
import { UserIcon } from '../icons/UserIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { CameraIcon } from '../icons/CameraIcon';
import { toast } from 'react-hot-toast';


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
    option: [],
    classe: '',
    parentPhone: '',
    parentEmail: '',
    photo: null,
};

const niveauOptions = ['1 annee', '2 annee', '3 annee', '4 annee'];
const languageSubjects = ['espagnole', 'allemand'];


export const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel, optionalSubjects, classes }) => {
  const [formData, setFormData] = useState<any>(initialFormData);

  useEffect(() => {
    if (student) {
      setFormData({
        ...initialFormData,
        ...student,
        option: student.option || [],
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
    const relevantClasses = classes.filter(c => c.niveau === formData.academicLevel);
    const uniqueSpecialites = [...new Set(relevantClasses.map(c => c.specialite))];
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


  const isOptionDisabled = formData.academicLevel !== '3 annee' && formData.academicLevel !== '4 annee';
  
  useEffect(() => {
    if (!availableSpecialites.includes(formData.academicSpecialty)) {
      setFormData(prev => ({...prev, academicSpecialty: '', classe: ''}));
    } else if (!availableClasses.includes(formData.classe)) {
      setFormData(prev => ({...prev, classe: ''}));
    }
    
    if (isOptionDisabled) {
      setFormData(prev => ({...prev, option: []}));
    }
  }, [formData.academicLevel, availableSpecialites, availableClasses, isOptionDisabled]);


  const isSpecialiteDisabled = !formData.academicLevel;
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
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
        const currentOptions = prev.option || [];
        if (checked) {
            return { ...prev, option: [...currentOptions, value] };
        } else {
            return { ...prev, option: currentOptions.filter((opt: string) => opt !== value) };
        }
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (formData.academicLevel === '3 annee' || formData.academicLevel === '4 annee') {
        const selectedOptions = formData.option || [];
        const selectedLanguages = selectedOptions.filter((opt: string) => languageSubjects.includes(opt));

        if (selectedOptions.length < 2 || selectedOptions.length > 3) {
            toast.error('Veuillez sélectionner entre 2 et 3 matières optionnelles.');
            return;
        }
        if (selectedLanguages.length !== 1) {
            toast.error('Veuillez sélectionner exactement une langue comme matière optionnelle.');
            return;
        }
    }

    const { photo, ...studentData } = formData;
    onSave(studentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 rounded-t-lg flex items-center border-b border-gray-200">
            <UserIcon className="h-5 w-5 mr-3 text-blue-500" />
            Informations Personnelles
        </h2>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
      <div className="border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 rounded-t-lg flex items-center border-b border-gray-200">
            <AcademicCapIcon className="h-5 w-5 mr-3 text-green-500" />
            Parcours Académique
        </h2>
        <div className="p-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
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
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Option(s) <span className="text-xs text-gray-500">(pour 3ème/4ème année)</span></label>
                 <div className={`mt-2 grid grid-cols-2 gap-3 p-3 border rounded-md ${isOptionDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}>
                    {optionalSubjects.map(opt => (
                        <label key={opt} className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${isOptionDisabled ? 'text-gray-400' : 'cursor-pointer hover:bg-gray-50'} has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-300 has-[:checked]:ring-1 has-[:checked]:ring-indigo-200`}>
                            <input 
                                type="checkbox"
                                value={opt}
                                checked={formData.option?.includes(opt)}
                                onChange={handleCheckboxChange}
                                disabled={isOptionDisabled}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                            />
                            <span className="capitalize">{opt}</span>
                        </label>
                    ))}
                </div>
                 {!isOptionDisabled && <p className="text-xs text-gray-500 mt-1">Sélectionnez 2 à 3 matières, dont une seule langue (espagnole/allemand).</p>}
            </div>
        </div>
      </div>

       {/* Parent Information */}
      <div className="border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 rounded-t-lg flex items-center border-b border-gray-200">
            <UserGroupIcon className="h-5 w-5 mr-3 text-yellow-500" />
            Informations des Parents
        </h2>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
        <div className="border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 rounded-t-lg flex items-center border-b border-gray-200">
                <CameraIcon className="h-5 w-5 mr-3 text-purple-500" />
                Photo
            </h2>
            <div className="p-6">
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
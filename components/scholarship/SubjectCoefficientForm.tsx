import React, { useState, useEffect, useMemo } from 'react';
import type { SubjectCoefficient } from '../../types';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { levels as allLevels, specializationsByLevel } from './programData';

interface SubjectCoefficientFormProps {
  subject: SubjectCoefficient | null;
  onSave: (data: Omit<SubjectCoefficient, 'id'>) => void;
  onCancel: () => void;
}

const initialFormData = {
  subject: '',
  level: '',
  specialization: '',
  hours: '',
  coefficient: '',
};


export const SubjectCoefficientForm: React.FC<SubjectCoefficientFormProps> = ({ subject, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (subject) {
      setFormData({
        subject: subject.subject,
        level: subject.level,
        specialization: subject.specialization,
        hours: subject.hours,
        coefficient: subject.coefficient,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [subject]);
  
  const availableSpecializations = useMemo(() => {
    if (!formData.level) return [];
    return specializationsByLevel[formData.level] || [];
  }, [formData.level]);

  useEffect(() => {
    // Reset specialization if level changes and the current specialization is no longer valid
    if (formData.level && !availableSpecializations.includes(formData.specialization)) {
        setFormData(prev => ({...prev, specialization: ''}));
    }
  }, [formData.level, availableSpecializations]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold text-white bg-indigo-600 p-3 rounded-t-md flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-3" />
            Détails de la Matière
        </h2>
        <div className="border border-t-0 border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Matière</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau</label>
                <select id="level" name="level" value={formData.level} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option value="">Sélectionnez...</option>
                    {allLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Spécialité</label>
                <select id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} disabled={!formData.level} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" required>
                    <option value="">Sélectionnez...</option>
                    {availableSpecializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Heures</label>
                <input type="text" id="hours" name="hours" value={formData.hours} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="ex: 4 ou 1.5" required />
            </div>
            <div>
                <label htmlFor="coefficient" className="block text-sm font-medium text-gray-700">Coefficient</label>
                <input type="text" id="coefficient" name="coefficient" value={formData.coefficient} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="ex: 3 ou 1" required />
            </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
          Annuler
        </button>
        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          {subject ? 'Enregistrer les modifications' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

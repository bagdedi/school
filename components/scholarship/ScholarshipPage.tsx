import React, { useState, useMemo, useEffect } from 'react';
import type { SubjectCoefficient } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { Modal } from '../common/Modal';
import { SubjectCoefficientForm } from './SubjectCoefficientForm';
import { mockSubjectCoefficients } from './mockSubjectData';
import { ResetIcon } from '../icons/ResetIcon';
import { levels as allLevels, specializationsByLevel } from './programData';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { LibraryIcon } from '../icons/LibraryIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { ContinuousAssessmentDetails } from './ContinuousAssessmentDetails';

const ScholarshipPage: React.FC = () => {
  const [subjectCoefficients, setSubjectCoefficients] = useState<SubjectCoefficient[]>(() => {
    try {
      const savedData = localStorage.getItem('subjectCoefficients');
      return savedData ? JSON.parse(savedData) : mockSubjectCoefficients;
    } catch (error) {
      console.warn('Error reading subjectCoefficients from localStorage', error);
      return mockSubjectCoefficients;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('subjectCoefficients', JSON.stringify(subjectCoefficients));
    } catch (error) {
      console.warn('Error saving subjectCoefficients to localStorage', error);
    }
  }, [subjectCoefficients]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectCoefficient | null>(null);
  const [detailsSubject, setDetailsSubject] = useState<SubjectCoefficient | null>(null);
  
  const [filters, setFilters] = useState({ level: '', specialization: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddSubject = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject: SubjectCoefficient) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      setSubjectCoefficients(subjectCoefficients.filter(sc => sc.id !== subjectId));
    }
  };

  const handleSaveSubject = (data: Omit<SubjectCoefficient, 'id'>) => {
    if (editingSubject) {
      setSubjectCoefficients(
        subjectCoefficients.map(sc =>
          sc.id === editingSubject.id ? { ...sc, ...data } : sc
        )
      );
    } else {
      const newEntry: SubjectCoefficient = {
        id: `SC${Date.now()}`,
        ...data,
      };
      setSubjectCoefficients([...subjectCoefficients, newEntry]);
    }
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const availableSpecializations = useMemo(() => {
    if (!filters.level) return [];
    return specializationsByLevel[filters.level] || [];
  }, [filters.level]);

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => {
        const newFilters = { ...prev, [filterName]: value };
        if (filterName === 'level') {
            newFilters.specialization = '';
        }
        return newFilters;
    });
  };
  
  const resetFilters = () => {
    setFilters({ level: '', specialization: '' });
    setSearchQuery('');
  };

  const groupedAndFilteredData = useMemo(() => {
    const filtered = subjectCoefficients.filter(sc => {
      const searchMatch = sc.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const levelMatch = filters.level ? sc.level === filters.level : true;
      const specializationMatch = filters.specialization ? sc.specialization === filters.specialization : true;
      return searchMatch && levelMatch && specializationMatch;
    });

    return filtered.reduce((acc, subject) => {
        const { level, specialization } = subject;
        if (!acc[level]) {
            acc[level] = {};
        }
        if (!acc[level][specialization]) {
            acc[level][specialization] = [];
        }
        acc[level][specialization].push(subject);
        return acc;
    }, {} as Record<string, Record<string, SubjectCoefficient[]>>);

  }, [subjectCoefficients, searchQuery, filters]);

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Matières et Coefficients</h1>
            <p className="mt-1 text-gray-600">Gérez les matières, les heures et les coefficients du programme scolaire.</p>
          </div>
          <button
            onClick={handleAddSubject}
            className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon />
            <span className="ml-2">Ajouter une matière</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
            <input
                type="search"
                placeholder="Rechercher par matière..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="">Tous les Niveaux</option>
                {allLevels.map(level => (
                <option key={level} value={level}>{level}</option>
                ))}
            </select>
            <select
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                disabled={!filters.level}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            >
                <option value="">Toutes les Spécialités</option>
                {availableSpecializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
                ))}
            </select>
            <div className="md:col-span-3 flex justify-end">
                 <button onClick={resetFilters} className="flex items-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                    <ResetIcon className="mr-2 h-4 w-4"/>
                    Réinitialiser
                </button>
            </div>
        </div>

        {/* Results */}
        <div className="space-y-8 mt-8">
            {Object.keys(groupedAndFilteredData).length > 0 ? (
                Object.entries(groupedAndFilteredData).map(([level, specializations]) => (
                    <div key={level} className="p-4 border rounded-lg bg-gray-50/50 animate-fade-in">
                        <h2 className="text-xl font-bold text-indigo-700 flex items-center mb-4">
                            <LibraryIcon className="h-5 w-5 mr-3" />
                            {level}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-4 border-l-2 border-indigo-200">
                           {Object.entries(specializations).map(([specialization, subjects]) => (
                                <div key={specialization} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                   <h3 className="text-md font-semibold text-gray-800 bg-gray-100 px-4 py-3 rounded-t-lg flex items-center">
                                        <AcademicCapIcon className="h-5 w-5 mr-3 text-gray-500" />
                                        {specialization}
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="text-gray-600">
                                                    <th className="py-2 px-4 font-semibold">Matière</th>
                                                    <th className="py-2 px-4 font-semibold text-center">Heures</th>
                                                    <th className="py-2 px-4 font-semibold text-center">Coeff.</th>
                                                    <th className="py-2 px-4 font-semibold text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700">
                                                {subjects.sort((a,b) => a.subject.localeCompare(b.subject)).map(sc => (
                                                    <tr key={sc.id} className="border-t border-gray-200 hover:bg-gray-50">
                                                        <td className="py-2 px-4 font-medium">{sc.subject}</td>
                                                        <td className="py-2 px-4 text-center">{sc.hours}</td>
                                                        <td className="py-2 px-4 text-center font-bold text-indigo-600">{sc.coefficient}</td>
                                                        <td className="py-2 px-4">
                                                            <div className="flex justify-center items-center space-x-1">
                                                                <button onClick={() => setDetailsSubject(sc)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-200 transition-colors" aria-label={`Détails pour ${sc.subject}`}>
                                                                    <EyeIcon />
                                                                </button>
                                                                <button onClick={() => handleEditSubject(sc)} className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors" aria-label={`Modifier ${sc.subject}`}>
                                                                    <PencilIcon />
                                                                </button>
                                                                <button onClick={() => handleDeleteSubject(sc.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors" aria-label={`Supprimer ${sc.subject}`}>
                                                                    <TrashIcon />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                               </div>
                           ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 rounded-lg border bg-gray-50">
                    <p className="text-gray-600 font-semibold">Aucune donnée trouvée.</p>
                    <p className="text-sm text-gray-500 mt-1">Essayez d'ajuster vos filtres ou d'ajouter une nouvelle entrée.</p>
                </div>
            )}
        </div>
      </div>
      
      <Modal
        isOpen={!!detailsSubject}
        onClose={() => setDetailsSubject(null)}
        title="Détails du Contrôle Continu"
        size="3xl"
      >
        <ContinuousAssessmentDetails subject={detailsSubject} />
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Modifier une Matière' : 'Ajouter une Matière'}
        size="2xl"
      >
        <SubjectCoefficientForm
          subject={editingSubject}
          onSave={handleSaveSubject}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default ScholarshipPage;

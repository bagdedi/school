import React, { useState, useMemo } from 'react';
import type { Student, AttestationType, Classe, SharedFilterState } from '../../types';
import { AttestationSelectionModal } from './AttestationSelectionModal';

// This tells TypeScript that we expect `process` to be available in the global
// scope, as provided by the execution environment.
declare const process: any;

interface AttestationPageProps {
  students: Student[];
  classes: Classe[];
  filters: SharedFilterState;
  onFilterChange: (filterName: keyof SharedFilterState, value: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetFilters: () => void;
}

const AttestationPage: React.FC<AttestationPageProps> = ({ 
    students, 
    classes, 
    filters, 
    onFilterChange, 
    searchQuery, 
    setSearchQuery, 
    onResetFilters 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleAttestationClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleGenerate = (type: AttestationType) => {
    if (!selectedStudent) return;

    // The API key is required to access attestation pages in the deployment environment.
    // As per guidelines, it must be sourced from process.env.API_KEY.
    const apiKey = process.env.API_KEY;
    const studentData = encodeURIComponent(JSON.stringify(selectedStudent));
    const keyQueryParam = apiKey ? `&key=${apiKey}` : '';
    
    if (type === 'inscription' || type === 'both') {
      window.open(`/attestation/inscription?student=${studentData}${keyQueryParam}`, '_blank');
    }
    if (type === 'presence' || type === 'both') {
      window.open(`/attestation/presence?student=${studentData}${keyQueryParam}`, '_blank');
    }

    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const uniqueNiveaux = useMemo(() => [...new Set(classes.map(c => c.niveau))].sort(), [classes]);
  
  const availableSpecialites = useMemo(() => {
    if (!filters.niveau) {
      return [...new Set(classes.map(c => c.specialite))].sort();
    }
    return [...new Set(classes.filter(c => c.niveau === filters.niveau).map(c => c.specialite))].sort();
  }, [filters.niveau, classes]);

  const availableClasses = useMemo(() => {
    if (!filters.niveau || !filters.specialite) {
      return [];
    }
    return classes
      .filter(c => c.niveau === filters.niveau && c.specialite === filters.specialite)
      .map(c => c.name)
      .sort();
  }, [filters.niveau, filters.specialite, classes]);


  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchMatch =
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.matricule.toLowerCase().includes(searchQuery.toLowerCase());
      
      const niveauMatch = filters.niveau ? student.academicLevel === filters.niveau : true;
      const specialiteMatch = filters.specialite ? student.academicSpecialty === filters.specialite : true;
      const classeMatch = filters.classe ? student.classe === filters.classe : true;

      return searchMatch && niveauMatch && specialiteMatch && classeMatch;
    });
  }, [students, searchQuery, filters]);

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Attestations</h1>
                <p className="mt-1 text-gray-600">Recherchez un étudiant pour générer une attestation.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <input
                type="search"
                placeholder="Rechercher par nom ou matricule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:col-span-2 lg:col-span-1"
            />
            <select
                value={filters.niveau}
                onChange={(e) => onFilterChange('niveau', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="">Tous les Niveaux</option>
                {uniqueNiveaux.map(level => (
                <option key={level} value={level}>{level}</option>
                ))}
            </select>
            <select
                value={filters.specialite}
                onChange={(e) => onFilterChange('specialite', e.target.value)}
                disabled={!filters.niveau}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            >
                <option value="">Toutes les Spécialités</option>
                {availableSpecialites.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
                ))}
            </select>
            <select
                value={filters.classe}
                onChange={(e) => onFilterChange('classe', e.target.value)}
                disabled={!filters.niveau || !filters.specialite}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            >
                <option value="">Toutes les Classes</option>
                {availableClasses.map(c => (
                <option key={c} value={c}>{c}</option>
                ))}
            </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">Matricule</th>
                <th className="py-3 px-4 font-semibold">Nom Complet</th>
                <th className="py-3 px-4 font-semibold">Niveau</th>
                <th className="py-3 px-4 font-semibold">Spécialité</th>
                <th className="py-3 px-4 font-semibold">Classe</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredStudents.map((student, index) => (
                <tr key={student.matricule} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{index + 1}</td>
                  <td className="py-3 px-4">{student.matricule}</td>
                  <td className="py-3 px-4 capitalize">{`${student.firstName} ${student.lastName}`}</td>
                  <td className="py-3 px-4">{student.academicLevel}</td>
                  <td className="py-3 px-4 capitalize">{student.academicSpecialty}</td>
                  <td className="py-3 px-4">{student.classe}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleAttestationClick(student)} className="bg-teal-500 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-teal-600 transition-colors">
                        Attestation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <AttestationSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onGenerate={handleGenerate}
        />
      )}
    </>
  );
};

export default AttestationPage;
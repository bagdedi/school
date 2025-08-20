import React, { useState, useMemo } from 'react';
import { Timetable } from './Timetable';
import { mockEvents, initialClasses } from './mockData';
import { ResetIcon } from '../icons/ResetIcon';
import type { DayWorkingHours } from '../../types';
import { PrintIcon } from '../icons/PrintIcon';

interface TimetableStudentsPageProps {
  workingHours: DayWorkingHours[];
  schoolName: string;
}

const TimetableStudentsPage: React.FC<TimetableStudentsPageProps> = ({ workingHours, schoolName }) => {
  const [filters, setFilters] = useState({
    niveau: '',
    specialite: '',
    classe: '',
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: value };
      if (filterName === 'niveau') {
        newFilters.specialite = '';
        newFilters.classe = '';
      } else if (filterName === 'specialite') {
        newFilters.classe = '';
      }
      return newFilters;
    });
  };
  
  const resetFilters = () => {
    setFilters({ niveau: '', specialite: '', classe: '' });
  };

  const uniqueNiveaux = useMemo(() => [...new Set(initialClasses.map(c => c.niveau))].sort(), []);
  
  const availableSpecialites = useMemo(() => {
    if (!filters.niveau) return [];
    return [...new Set(initialClasses.filter(c => c.niveau === filters.niveau).map(c => c.specialite))].sort();
  }, [filters.niveau]);

  const availableClasses = useMemo(() => {
    if (!filters.niveau || !filters.specialite) return [];
    return initialClasses
      .filter(c => c.niveau === filters.niveau && c.specialite === filters.specialite)
      .map(c => c.name)
      .sort((a,b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [filters.niveau, filters.specialite]);


  const filteredEvents = useMemo(() => {
    if (!filters.classe) {
      return [];
    }
    return mockEvents.filter(event => event.className.startsWith(filters.classe));
  }, [filters.classe]);
    
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Emploi du temps: Étudiants</h1>
            <p className="mt-1 text-gray-600">Filtrez pour voir l'emploi du temps d'une classe spécifique.</p>
          </div>
          <button
            onClick={handlePrint}
            disabled={!filters.classe}
            className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <PrintIcon className="mr-2 h-4 w-4" />
            Exporter PDF
          </button>
       </div>
       
       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center flex-wrap gap-4 no-print">
            <div className="flex-grow">
                <label htmlFor="niveau-select" className="block text-sm font-medium text-gray-700">Niveau</label>
                <select
                    id="niveau-select"
                    value={filters.niveau}
                    onChange={(e) => handleFilterChange('niveau', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">Tous les niveaux</option>
                    {uniqueNiveaux.map(niveau => (
                      <option key={niveau} value={niveau}>{niveau}</option>
                    ))}
                </select>
            </div>
            <div className="flex-grow">
                <label htmlFor="specialite-select" className="block text-sm font-medium text-gray-700">Spécialité</label>
                <select
                    id="specialite-select"
                    value={filters.specialite}
                    onChange={(e) => handleFilterChange('specialite', e.target.value)}
                    disabled={!filters.niveau}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                >
                    <option value="">Toutes les spécialités</option>
                    {availableSpecialites.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
            </div>
            <div className="flex-grow">
                <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">Classe</label>
                <select
                    id="class-select"
                    value={filters.classe}
                    onChange={(e) => handleFilterChange('classe', e.target.value)}
                    disabled={!filters.specialite}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                >
                    <option value="">Sélectionnez une classe</option>
                    {availableClasses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
             <button onClick={resetFilters} className="self-end flex items-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                <ResetIcon className="mr-2 h-4 w-4"/>
                Réinitialiser
            </button>
       </div>
      
      {filteredEvents.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 mt-6">
            <p className="font-semibold">
                {filters.classe ? "Aucun cours programmé pour cette classe." : "Veuillez sélectionner une classe pour afficher son emploi du temps."}
            </p>
          </div>
      )}

      {filteredEvents.length > 0 && (
        <div id="export-container-students">
            <div className="hidden print:block text-sm mb-4">
                {filters.classe && (
                    <>
                        <div className="flex justify-between items-center mb-2">
                             <div>
                                <p className="font-bold text-lg">{schoolName}</p>
                                <p>Année Scolaire: 2025/2026</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">Emploi du Temps Étudiant</p>
                            </div>
                        </div>
                        <div className="border-t border-b border-gray-400 py-1 px-2 my-2 text-center">
                            <span className="font-semibold text-lg">Classe: {filters.classe}</span>
                        </div>
                    </>
                )}
            </div>
            <Timetable events={filteredEvents} workingHours={workingHours} displayMode="student" />
        </div>
      )}

    </div>
  );
};

export default TimetableStudentsPage;
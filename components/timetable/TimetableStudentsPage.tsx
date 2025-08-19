import React, { useState, useMemo } from 'react';
import { Timetable } from './Timetable';
import { mockEvents } from './mockData';
import { ResetIcon } from '../icons/ResetIcon';
import type { DayWorkingHours } from '../../types';
import { PrintIcon } from '../icons/PrintIcon';

interface TimetableStudentsPageProps {
  workingHours: DayWorkingHours[];
  schoolName: string;
}

const TimetableStudentsPage: React.FC<TimetableStudentsPageProps> = ({ workingHours, schoolName }) => {
  const [selectedClass, setSelectedClass] = useState('');
  
  const classes = useMemo(() => [...new Set(mockEvents.map(e => e.className))].sort(), []);

  const filteredEvents = useMemo(() => {
    if (!selectedClass) {
      return mockEvents;
    }
    return mockEvents.filter(event => event.className === selectedClass);
  }, [selectedClass]);
  
  const resetFilters = () => {
    setSelectedClass('');
  };

  const printTitle = selectedClass
    ? `Emploi du temps: ${selectedClass}`
    : "Emploi du temps: Toutes les classes";
    
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
            className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            <PrintIcon className="mr-2 h-4 w-4" />
            Exporter PDF
          </button>
       </div>
       
       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4 no-print">
            <div className="flex-grow">
              <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">
                Sélectionnez une classe
              </label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="mt-1 block w-full md:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Toutes les classes</option>
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
             <button onClick={resetFilters} className="mt-6 flex items-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                <ResetIcon className="mr-2 h-4 w-4"/>
                Réinitialiser
            </button>
       </div>

      <div id="export-container-students">
        <div className="hidden print:block text-center mb-4">
            <h1 className="text-2xl font-bold">{printTitle}</h1>
            <p>{schoolName}</p>
        </div>
        <Timetable events={filteredEvents} workingHours={workingHours} />
      </div>

    </div>
  );
};

export default TimetableStudentsPage;
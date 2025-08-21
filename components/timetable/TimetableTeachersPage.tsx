import React, { useState, useMemo, useEffect } from 'react';
import { Timetable } from './Timetable';
import { mockEvents } from './mockData';
import { ResetIcon } from '../icons/ResetIcon';
import type { DayWorkingHours, Teacher } from '../../types';
import { PrintIcon } from '../icons/PrintIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { SearchIcon } from '../icons/SearchIcon';


const timeToMinutes = (time: string): number => {
    if (!time) return 0;
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
};

interface TimetableTeachersPageProps {
  workingHours: DayWorkingHours[];
  schoolName: string;
  directorName: string;
  teachers: Teacher[];
}

const TimetableTeachersPage: React.FC<TimetableTeachersPageProps> = ({ workingHours, schoolName, directorName, teachers }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const specialties = useMemo(() => [...new Set(teachers.map(t => t.specialty))].sort(), [teachers]);

  const availableTeachers = useMemo(() => {
    let filteredTeachers = teachers;

    if (selectedSpecialty) {
      filteredTeachers = filteredTeachers.filter(t => t.specialty === selectedSpecialty);
    }
    
    if (searchQuery.trim() !== '') {
        const lowercasedQuery = searchQuery.toLowerCase().trim();
        filteredTeachers = filteredTeachers.filter(t => 
            `${t.firstName} ${t.lastName}`.toLowerCase().includes(lowercasedQuery) ||
            `${t.lastName} ${t.firstName}`.toLowerCase().includes(lowercasedQuery)
        );
    }

    return filteredTeachers.sort((a,b) => a.lastName.localeCompare(b.lastName));
  }, [selectedSpecialty, searchQuery, teachers]);
  
  // Effect to clear selected teacher if they are filtered out
  useEffect(() => {
    if (selectedTeacher && !availableTeachers.some(t => `${t.firstName} ${t.lastName}` === selectedTeacher)) {
      setSelectedTeacher('');
    }
  }, [availableTeachers, selectedTeacher]);


  const teacherDetails = useMemo(() => {
    if (!selectedTeacher) return null;

    const teacher = teachers.find(t => `${t.firstName} ${t.lastName}` === selectedTeacher);
    if (!teacher) return null;

    const events = mockEvents.filter(e => e.teacher === selectedTeacher);
    
    const volumeByClass: { [className: string]: number } = {};
    events.forEach(event => {
      const baseClassName = event.className.split(' GR')[0];
      const duration = (timeToMinutes(event.endTime) - timeToMinutes(event.startTime)) / 60;
      volumeByClass[baseClassName] = (volumeByClass[baseClassName] || 0) + duration;
    });

    const totalVolume = Object.values(volumeByClass).reduce((sum, hours) => sum + hours, 0);

    return {
      ...teacher,
      classes: Object.keys(volumeByClass).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      volumeByClass,
      totalVolume
    };
  }, [selectedTeacher, teachers]);

  const filteredEvents = useMemo(() => {
    if (!selectedTeacher) {
      return [];
    }
    return mockEvents.filter(event => event.teacher === selectedTeacher);
  }, [selectedTeacher]);
  
  const resetFilters = () => {
    setSelectedSpecialty('');
    setSelectedTeacher('');
    setSearchQuery('');
  };
  
  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherName = e.target.value;
    setSelectedTeacher(teacherName);
    if (teacherName) {
        const teacher = teachers.find(t => `${t.firstName} ${t.lastName}` === teacherName);
        if (teacher && !selectedSpecialty) {
            setSelectedSpecialty(teacher.specialty);
        }
    }
  };


  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Emploi du temps: Enseignants</h1>
            <p className="mt-1 text-gray-600">Filtrez pour voir l'emploi du temps d'un enseignant spécifique.</p>
          </div>
          <button
            onClick={handlePrint}
            disabled={!selectedTeacher}
            className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <PrintIcon className="mr-2 h-4 w-4" />
            Exporter PDF
          </button>
       </div>
       
       <div className="bg-white p-6 rounded-xl shadow-md no-print">
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-end">
                <div className="xl:col-span-1">
                    <label htmlFor="teacher-search" className="block text-sm font-medium text-gray-700 mb-1">
                        Rechercher par nom
                    </label>
                    <div className="relative">
                        <input
                            id="teacher-search"
                            type="search"
                            placeholder="Entrez un nom..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-1">
                    <label htmlFor="specialty-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Spécialité
                    </label>
                    <select
                        id="specialty-select"
                        value={selectedSpecialty}
                        onChange={(e) => {
                            setSelectedSpecialty(e.target.value);
                            setSelectedTeacher('');
                        }}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Toutes les spécialités</option>
                        {specialties.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
                <div className="xl:col-span-1">
                    <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Enseignant
                    </label>
                    <select
                        id="teacher-select"
                        value={selectedTeacher}
                        onChange={handleTeacherChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Sélectionnez un enseignant</option>
                        {availableTeachers.map(teacher => (
                            <option key={teacher.id} value={`${teacher.firstName} ${teacher.lastName}`}>{`${teacher.lastName} ${teacher.firstName}`}</option>
                        ))}
                    </select>
                </div>
                <button onClick={resetFilters} className="w-full xl:w-auto flex items-center justify-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                    <ResetIcon className="mr-2 h-4 w-4"/>
                    Réinitialiser
                </button>
           </div>
       </div>
       
      {teacherDetails && (
        <div className="bg-white p-6 rounded-xl shadow-md no-print animate-fade-in">
            <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="flex-shrink-0 flex flex-col items-center text-center w-full lg:w-48">
                    <img src={teacherDetails.avatar} alt={`${teacherDetails.firstName} ${teacherDetails.lastName}`} className="w-32 h-32 rounded-full mb-4 ring-4 ring-indigo-200" />
                    <h2 className="text-xl font-bold text-gray-800">{teacherDetails.firstName} {teacherDetails.lastName}</h2>
                    <p className="text-indigo-600 font-semibold mt-1">{teacherDetails.specialty}</p>
                </div>
                <div className="flex-grow w-full border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-8 pt-6 lg:pt-0">
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-4 rounded-r-md mb-6">
                        <div className="flex items-center">
                            <ClockIcon className="h-6 w-6 mr-3 flex-shrink-0"/>
                            <div>
                                <p className="font-bold text-lg">{teacherDetails.totalVolume} heures / semaine</p>
                                <p className="text-sm font-medium">Volume Horaire Total</p>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center"><UserGroupIcon className="h-5 w-5 mr-2 text-gray-500"/>Répartition par classe :</h3>
                        <div className="overflow-x-auto max-h-60 pr-2">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold text-gray-600 rounded-tl-md">Classe</th>
                                        <th className="px-4 py-2 font-semibold text-gray-600 rounded-tr-md">Volume Horaire</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {teacherDetails.classes.map(className => (
                                        <tr key={className} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium text-gray-800">{className}</td>
                                            <td className="px-4 py-2 text-gray-600">{teacherDetails.volumeByClass[className]} heures</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {!selectedTeacher && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 mt-6 no-print">
            <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">
                Veuillez sélectionner un enseignant
            </h3>
            <p>Utilisez les filtres ci-dessus pour afficher un emploi du temps.</p>
        </div>
      )}

      {selectedTeacher && filteredEvents.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 mt-6 no-print">
            <CalendarIcon />
            <p className="font-semibold mt-2">
                Aucun cours programmé pour cet enseignant.
            </p>
        </div>
      )}
      
      {filteredEvents.length > 0 && (
        <div id="export-container">
            <div className="hidden print:block text-sm mb-6 font-serif">
                {teacherDetails && (
                    <>
                        <div className="flex justify-between items-start text-xs">
                            <div className="text-left">
                                <p className="font-semibold">ministre d'education</p>
                                <p>lycée : <span className="font-bold">{schoolName}</span></p>
                                <p>année scolaire : <span className="font-bold">2025/2026</span></p>
                            </div>
                            <div className="text-right">
                                <p>horaire demandé :</p>
                                <p>horaire réel : <span className="font-bold">{teacherDetails.totalVolume}h</span></p>
                                <p>heures supplémentaires:</p>
                            </div>
                        </div>

                        <div className="text-center my-8">
                            <h1 className="font-bold text-base tracking-wider uppercase">Emploi du temps pour l'enseignant :</h1>
                            <p className="mt-2 text-sm font-semibold tracking-wider">{teacherDetails.firstName} {teacherDetails.lastName}</p>
                        </div>
                    </>
                )}
            </div>
            <Timetable events={filteredEvents} workingHours={workingHours} displayMode="teacher" />
            <div className="hidden print:block mt-16 text-sm font-serif">
                <div className="flex justify-between items-end">
                    <p>le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <div className="text-center">
                        <p className="mb-16">le directeur :</p>
                        <p>{directorName}</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default TimetableTeachersPage;

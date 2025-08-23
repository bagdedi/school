import React, { useState, useMemo, useEffect } from 'react';
import type { Teacher, Classe, Student, StudentGrades, Term } from '../../types';
import { mockEvents } from '../timetable/mockData';
import { mockSubjectCoefficients } from '../scholarship/mockSubjectData';
import { ResetIcon } from '../icons/ResetIcon';
import { DocumentChartBarIcon } from '../icons/DocumentChartBarIcon';
import { GradeEntryModal } from './GradeEntryModal';

interface ResultatPageProps {
  teachers: Teacher[];
  classes: Classe[];
  students: Student[];
  grades: StudentGrades[];
  setGrades: React.Dispatch<React.SetStateAction<StudentGrades[]>>;
}

const terms: Term[] = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

const ResultatPage: React.FC<ResultatPageProps> = ({ teachers, classes, students, grades, setGrades }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term>('Trimestre 1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Classe | null>(null);

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>();
    mockSubjectCoefficients.forEach(sc => subjects.add(sc.subject));
    return Array.from(subjects).sort();
  }, []);

  const availableTeachers = useMemo(() => {
    if (!selectedSubject) return [];
    return teachers
      .filter(t => t.specialty === selectedSubject)
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [selectedSubject, teachers]);

  useEffect(() => {
    // Reset teacher if the selected subject changes
    setSelectedTeacher('');
  }, [selectedSubject]);
  
  const teacherClasses = useMemo(() => {
    if (!selectedTeacher || !selectedSubject) return [];
    
    // Find all class names where the teacher teaches the selected subject
    const taughtClassNames = new Set<string>();
    mockEvents.forEach(event => {
      if (event.teacher === selectedTeacher && event.subject === selectedSubject) {
        taughtClassNames.add(event.className.split(' GR')[0]);
      }
    });

    // Get the full class objects for those names
    return classes.filter(c => taughtClassNames.has(c.name))
        .sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  }, [selectedTeacher, selectedSubject, classes]);


  const handleOpenModal = (classe: Classe) => {
    setSelectedClass(classe);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const resetFilters = () => {
    setSelectedSubject('');
    setSelectedTeacher('');
  };
  
  const teacherDetails = teachers.find(t => `${t.firstName} ${t.lastName}` === selectedTeacher);


  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Saisie des Résultats</h1>
            <p className="mt-1 text-gray-600">Sélectionnez une matière, un enseignant et une classe pour saisir les notes.</p>
          </div>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {terms.map(term => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  selectedTerm === term
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>


        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700">Matière</label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionnez une matière</option>
                {uniqueSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700">Enseignant</label>
              <select
                id="teacher-select"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                disabled={!selectedSubject}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              >
                <option value="">Sélectionnez un enseignant</option>
                {availableTeachers.map(t => <option key={t.id} value={`${t.firstName} ${t.lastName}`}>{`${t.lastName} ${t.firstName}`}</option>)}
              </select>
            </div>
            <button onClick={resetFilters} className="w-full md:w-auto flex items-center justify-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
              <ResetIcon className="mr-2 h-4 w-4" />
              Réinitialiser
            </button>
          </div>
        </div>

        {selectedTeacher && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Classes de {selectedTeacher} en {selectedSubject}</h2>
            {teacherClasses.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Classe</th>
                                <th className="py-3 px-4 font-semibold">Niveau</th>
                                <th className="py-3 px-4 font-semibold">Spécialité</th>
                                <th className="py-3 px-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {teacherClasses.map(classe => (
                                <tr key={classe.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{classe.name}</td>
                                    <td className="py-3 px-4">{classe.niveau}</td>
                                    <td className="py-3 px-4">{classe.specialite}</td>
                                    <td className="py-3 px-4 text-center">
                                        <button 
                                            onClick={() => handleOpenModal(classe)}
                                            className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                                        >
                                            Saisir les notes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                    <DocumentChartBarIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>Aucune classe trouvée pour cet enseignant dans cette matière.</p>
                </div>
            )}
          </div>
        )}
      </div>
      
      {isModalOpen && selectedClass && teacherDetails && selectedSubject && (
        <GradeEntryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          classe={selectedClass}
          teacher={teacherDetails}
          subjectName={selectedSubject}
          students={students.filter(s => s.classe === selectedClass.name)}
          allGrades={grades}
          setAllGrades={setGrades}
          term={selectedTerm}
        />
      )}
    </>
  );
};

export default ResultatPage;
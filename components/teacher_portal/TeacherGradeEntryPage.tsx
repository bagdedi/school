import React, { useState, useMemo, useEffect } from 'react';
import type { Teacher, Classe, Student, StudentGrades, Term } from '../../types';
import { mockEvents } from '../timetable/mockData';
import { ResetIcon } from '../icons/ResetIcon';
import { DocumentChartBarIcon } from '../icons/DocumentChartBarIcon';
import { GradeEntryModal } from '../results/GradeEntryModal';

interface TeacherGradeEntryPageProps {
  teacher: Teacher;
  classes: Classe[];
  students: Student[];
  grades: StudentGrades[];
  setGrades: React.Dispatch<React.SetStateAction<StudentGrades[]>>;
}

const terms: Term[] = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

const TeacherGradeEntryPage: React.FC<TeacherGradeEntryPageProps> = ({ teacher, classes, students, grades, setGrades }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term>('Trimestre 1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Classe | null>(null);

  const teacherName = `${teacher.firstName} ${teacher.lastName}`;

  const teacherSubjects = useMemo(() => {
      const subjects = new Set<string>();
      mockEvents.forEach(event => {
          if (event.teacher === teacherName) {
              subjects.add(event.subject);
          }
      });
      return Array.from(subjects).sort();
  }, [teacherName]);

  const teacherClasses = useMemo(() => {
    if (!selectedSubject) return [];
    
    const taughtClassNames = new Set<string>();
    mockEvents.forEach(event => {
      if (event.teacher === teacherName && event.subject === selectedSubject) {
        taughtClassNames.add(event.className.split(' GR')[0]);
      }
    });

    return classes.filter(c => taughtClassNames.has(c.name))
        .sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }, [teacherName, selectedSubject, classes]);

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
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Saisie des Résultats</h1>
            <p className="mt-1 text-gray-600">Sélectionnez une matière et une classe pour saisir les notes.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700">Matière</label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionnez une de vos matières</option>
                {teacherSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </div>
            <button onClick={resetFilters} className="w-full md:w-auto flex items-center justify-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
              <ResetIcon className="mr-2 h-4 w-4" />
              Réinitialiser
            </button>
          </div>
        </div>

        {selectedSubject && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Vos classes en {selectedSubject}</h2>
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
                    <p>Aucune classe trouvée pour vous dans cette matière.</p>
                </div>
            )}
          </div>
        )}
      </div>
      
      {isModalOpen && selectedClass && selectedSubject && (
        <GradeEntryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          classe={selectedClass}
          teacher={teacher}
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

export default TeacherGradeEntryPage;